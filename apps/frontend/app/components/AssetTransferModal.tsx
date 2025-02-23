import { useState, useEffect, useCallback } from "react";
import {
  PublicKey,
  Transaction,
  VersionedTransaction,
  ComputeBudgetProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { useWallet } from "../hooks/wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Asset } from "../types/api/wallet";
import { walletClient } from "../clients/wallet";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountIdempotentInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useNotificationStore } from "../store/notificationStore";
import { usePriorityFees } from "../hooks/wallet";
import { Loader2, ArrowUpRight } from "lucide-react";

interface AssetTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
  onSuccess?: () => void;
}

// Add error type definitions
interface TokenError {
  code?: string;
  message: string;
  details?: {
    tokenAddress?: string;
    requiredBalance?: string;
    currentBalance?: string;
    [key: string]: unknown;
  };
}

function getErrorMessage(error: unknown): {
  message: string;
  details?: unknown;
} {
  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes("invalid address")) {
      return { message: "Invalid recipient address format" };
    }
    if (error.message.includes("insufficient")) {
      return { message: "Insufficient balance for this transfer" };
    }
    if (error.message.includes("recentBlockhash")) {
      return {
        message: "Network error, please try again",
        details: "Failed to get recent blockhash",
      };
    }
    if (error.message.includes("0x1")) {
      return {
        message: "Transaction failed - Account not found",
        details: "The recipient token account doesn't exist",
      };
    }
    // Handle specific token account errors
    if (error.message.includes("InvalidAccountData")) {
      return {
        message: "Invalid token account",
        details: "The recipient needs a token account for this token",
      };
    }
    if (error.message.includes("TokenAccountNotFoundError")) {
      return {
        message: "Token account not found",
        details: "Creating a new token account for the recipient",
      };
    }
    // Return the original error message if no specific handling
    return { message: error.message };
  }

  // Handle TokenError type
  const tokenError = error as TokenError;
  if (tokenError.code || tokenError.details) {
    return {
      message: tokenError.message,
      details: tokenError.details,
    };
  }

  // Default error message
  return { message: "Failed to transfer tokens" };
}

export function AssetTransferModal({
  isOpen,
  onClose,
  asset,
  onSuccess,
}: AssetTransferModalProps) {
  const { wallet, sendTransaction } = useWallet();
  const { addNotification } = useNotificationStore();
  const [serializedTx, setSerializedTx] = useState<string>();
  const { data: priorityFees } = usePriorityFees(serializedTx);
  const [computeUnits, setComputeUnits] = useState<number>();

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState("");

  const handleClose = () => {
    setAmount("");
    setRecipientAddress("");
    setTransferError("");
    onClose();
  };

  // Create base transaction for fee estimation
  const createBaseTransaction = useCallback(
    async (
      recipientWallet: PublicKey,
      tokenAmount: number,
      senderATA: PublicKey,
      recipientATA: PublicKey,
      mintAddress: PublicKey
    ) => {
      const { blockhash } = await walletClient.getLatestBlockhash();
      const transaction = new Transaction();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(wallet!.address);

      // Add ATA creation instruction
      transaction.add(
        createAssociatedTokenAccountIdempotentInstruction(
          new PublicKey(wallet!.address),
          recipientATA,
          recipientWallet,
          mintAddress
        )
      );

      // Add token transfer instruction
      transaction.add(
        createTransferInstruction(
          senderATA,
          recipientATA,
          new PublicKey(wallet!.address),
          tokenAmount
        )
      );

      return transaction;
    },
    [wallet]
  );

  // Update serialized transaction when inputs change
  const updateTransactionForFees = useCallback(async () => {
    if (!wallet?.address || !recipientAddress || !amount || !asset.token_info) {
      setSerializedTx(undefined);
      return;
    }

    try {
      const recipientWallet = new PublicKey(recipientAddress);
      const mintAddress = new PublicKey(asset.id);
      const tokenAmount = Math.floor(
        parseFloat(amount) * Math.pow(10, asset.token_info.decimals || 0)
      );

      const senderATA = await getAssociatedTokenAddress(
        mintAddress,
        new PublicKey(wallet.address),
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const recipientATA = await getAssociatedTokenAddress(
        mintAddress,
        recipientWallet,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const transaction = await createBaseTransaction(
        recipientWallet,
        tokenAmount,
        senderATA,
        recipientATA,
        mintAddress
      );

      // Get fresh blockhash and set fee payer
      const { blockhash } = await walletClient.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(wallet.address);

      // Convert to VersionedTransaction for simulation
      const versionedTx = new VersionedTransaction(
        transaction.compileMessage()
      );

      // Serialize using base64 for simulation
      const serialized = Buffer.from(versionedTx.serialize()).toString(
        "base64"
      );
      setSerializedTx(serialized);

      // Get simulation results
      const { simulation } =
        await walletClient.simulateTransactionFee(serialized);
      const estimatedUnits = Math.ceil(
        // Add 40% buffer to estimated compute units, defaulting to 200k if simulation doesn't provide value
        (simulation.unitsConsumed || 200000) * 1.4
      );
      setComputeUnits(Math.min(estimatedUnits, 1400000)); // Cap at 1.4M CU
    } catch (error) {
      console.error("Error updating transaction for fees:", error);
      setSerializedTx(undefined);
      setComputeUnits(undefined);
    }
  }, [
    wallet,
    recipientAddress,
    amount,
    asset.token_info,
    asset.id,
    createBaseTransaction,
  ]);

  // Debounce the update to prevent too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      updateTransactionForFees();
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [updateTransactionForFees]);

  const handleTransfer = async () => {
    if (!wallet?.address || !recipientAddress || !amount || !asset.token_info) {
      return;
    }

    setTransferError("");
    setIsTransferring(true);

    try {
      // Only handle token transfers
      if (!asset.token_info) {
        throw new Error("Only token transfers are supported");
      }

      // Validate recipient address
      let recipientWallet: PublicKey;
      try {
        recipientWallet = new PublicKey(recipientAddress);
      } catch (error) {
        throw new Error(
          "Invalid recipient address format: " +
            (error instanceof Error ? error.message : String(error))
        );
      }

      // Validate amount
      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }

      const tokenAmount = Math.floor(
        transferAmount * Math.pow(10, asset.token_info.decimals || 0)
      );
      if (tokenAmount > Number(asset.token_info.balance)) {
        throw new Error(
          `Insufficient ${asset.token_info.symbol || "token"} balance`
        );
      }

      // Get accounts
      const mintAddress = new PublicKey(asset.id);
      const senderATA = await getAssociatedTokenAddress(
        mintAddress,
        new PublicKey(wallet.address),
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const recipientATA = await getAssociatedTokenAddress(
        mintAddress,
        recipientWallet,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Create the transaction
      const transaction = await createBaseTransaction(
        recipientWallet,
        tokenAmount,
        senderATA,
        recipientATA,
        mintAddress
      );

      // Add compute budget instructions at the start
      const computeBudgetIxs: Array<TransactionInstruction> = [];

      if (computeUnits) {
        computeBudgetIxs.push(
          ComputeBudgetProgram.setComputeUnitLimit({
            units: computeUnits,
          })
        );
      }

      if (priorityFees?.high) {
        computeBudgetIxs.push(
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: Math.max(priorityFees.high, 10000),
          })
        );
      }

      // Set final transaction instructions
      transaction.instructions = [
        ...computeBudgetIxs,
        ...transaction.instructions,
      ];

      // Convert to versioned transaction
      const versionedTransaction = new VersionedTransaction(
        transaction.compileMessage()
      );

      // Sign and serialize using base64
      if (!wallet.signTransaction) {
        throw new Error("Wallet must support transaction signing");
      }

      const signedTx = await wallet.signTransaction(transaction);
      const serializedForSim = Buffer.from(signedTx.serialize()).toString(
        "base64"
      );

      // Simulate the transaction first
      try {
        const { simulation } =
          await walletClient.simulateTransactionFee(serializedForSim);

        if (simulation.error || !simulation.logs) {
          throw new Error(
            `Simulation failed: ${JSON.stringify(simulation.error || "Unknown error")}`
          );
        }

        // If simulation succeeds, proceed with sending
        const { signature, confirmation } = await sendTransaction(
          versionedTransaction,
          {
            commitment: "processed",
            maxRetries: 3,
          }
        );

        if (confirmation?.value.err) {
          throw new Error(
            `Transaction failed: ${JSON.stringify(confirmation.value.err)}`
          );
        }

        // Success notification with signature and explorer link
        addNotification("success", "Transfer successful", {
          message: `Sent ${amount} ${asset.token_info.symbol || "tokens"}`,
          signature,
          recipient: recipientAddress,
          amount,
          symbol: asset.token_info.symbol,
          explorerUrl: `https://explorer.solana.com/tx/${signature}`,
        });

        handleClose();
        onSuccess?.();
      } catch (error) {
        console.error("Simulation or transfer error:", error);
        const { message, details } = getErrorMessage(error);
        const errorDetails = {
          details,
          symbol: asset.token_info.symbol,
          amount,
          recipient: recipientAddress,
        };

        if (error instanceof Error && error.cause) {
          Object.assign(errorDetails, { cause: error.cause });
        }

        addNotification("error", message, errorDetails);
        setTransferError(message);
      }
    } catch (error) {
      console.error("Transaction setup error:", error);
      const { message } = getErrorMessage(error);
      setTransferError(message);
      addNotification("error", "Failed to setup transaction", {
        details: message,
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] border-border bg-background fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg font-medium text-foreground">
            send {asset.token_info?.symbol || "tokens"}
          </DialogTitle>
          <DialogDescription className="pt-2 sm:pt-3 text-sm text-muted-foreground">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground">
                  amount {asset.token_info?.symbol || ""}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setTransferError("");
                    }}
                    placeholder="0.0"
                    step="0.000001"
                    min="0"
                    className="bg-muted border-border text-foreground"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (asset.token_info?.balance) {
                        const maxAmount =
                          Number(asset.token_info.balance) /
                          Math.pow(10, asset.token_info.decimals || 0);
                        setAmount(maxAmount.toString());
                        setTransferError("");
                      }
                    }}
                    disabled={!asset.token_info?.balance}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    [max]
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-foreground">
                  recipient address
                </Label>
                <Input
                  id="recipient"
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => {
                    setRecipientAddress(e.target.value);
                    setTransferError("");
                  }}
                  placeholder="Solana address"
                  className="bg-muted border-border text-foreground"
                />
              </div>
              {transferError && (
                <div className="text-destructive text-sm">
                  [{transferError}]
                </div>
              )}
              <div className="text-xs sm:text-sm opacity-80">
                available balance:{" "}
                {asset.token_info
                  ? `${(Number(asset.token_info.balance) / Math.pow(10, asset.token_info.decimals || 0)).toLocaleString()} ${asset.token_info.symbol || ""}`
                  : "1 NFT"}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-3 sm:pt-4">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isTransferring}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            [cancel]
          </Button>
          {asset.token_info ? (
            <Button
              variant="ghost"
              onClick={handleTransfer}
              disabled={isTransferring || !recipientAddress || !amount}
              className="text-sm text-primary hover:text-primary hover:bg-primary/10"
            >
              {isTransferring ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  [sending...]
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  [send]
                </>
              )}
            </Button>
          ) : (
            <Button disabled className="text-sm">
              [NFT Transfers Not Supported]
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
