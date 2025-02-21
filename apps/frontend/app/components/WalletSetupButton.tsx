import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  useSolanaWallets,
  useHeadlessDelegatedActions,
  usePrivy,
  type WalletWithMetadata,
} from "@privy-io/react-auth";

interface WalletSetupButtonProps {
  onSuccess?: () => void;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export function WalletSetupButton({
  onSuccess,
  className = "",
  variant = "default",
}: WalletSetupButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const { wallets, createWallet } = useSolanaWallets();
  const { delegateWallet } = useHeadlessDelegatedActions();
  const { user } = usePrivy();
  const [isCreating, setIsCreating] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the embedded wallet if it exists
  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");

  // Check if any wallet is delegated
  const hasDelegatedWallet = user?.linkedAccounts.some(
    (account): account is WalletWithMetadata =>
      account.type === "wallet" && account.delegated
  );

  const needsDelegation = embeddedWallet && !hasDelegatedWallet;
  const isSetup = hasDelegatedWallet;

  // Reset error when dialog is closed
  useEffect(() => {
    if (!showDialog) {
      setError(null);
    }
  }, [showDialog]);

  // Don't show the button if wallet is already set up
  if (isSetup) {
    return null;
  }

  const handleCreateAndDelegate = async () => {
    try {
      // First create the wallet if needed
      if (!embeddedWallet) {
        setIsCreating(true);
        await createWallet();
        setIsCreating(false);
      }

      // Then delegate the wallet
      setIsDelegating(true);
      const walletToDelegate =
        embeddedWallet || wallets.find((w) => w.walletClientType === "privy");
      if (!walletToDelegate) {
        throw new Error("No wallet found to delegate");
      }

      await delegateWallet({
        address: walletToDelegate.address,
        chainType: "solana",
      });

      setShowDialog(false);
      onSuccess?.();
    } catch (err) {
      console.error("Failed to setup wallet:", err);
      setError(err instanceof Error ? err.message : "Failed to setup wallet");
    } finally {
      setIsCreating(false);
      setIsDelegating(false);
    }
  };

  // Button text based on current state
  const buttonText = isCreating
    ? "[creating wallet...]"
    : isDelegating
      ? "[activating...]"
      : needsDelegation
        ? "[activate wallet]"
        : "[setup wallet]";

  // If wallet needs delegation, show only the activation button
  if (needsDelegation) {
    return (
      <Button
        onClick={handleCreateAndDelegate}
        className={`bg-background hover:bg-background/80 text-muted-foreground hover:text-foreground text-sm ${className}`}
        variant={variant}
        disabled={isDelegating}
      >
        {isDelegating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {buttonText}
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className={`bg-background hover:bg-background/80 text-muted-foreground hover:text-foreground text-sm ${className}`}
        variant={variant}
        disabled={isCreating || isDelegating}
      >
        {(isCreating || isDelegating) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {buttonText}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="border-border bg-background">
          <DialogHeader className="p-6 border-b border-border">
            <DialogTitle className="text-xl text-foreground">
              [setup your wallet]
            </DialogTitle>
            <DialogDescription className="pt-2 text-muted-foreground">
              [you need a Solana wallet to use PumpAI. this will create and
              activate your wallet in one step.]
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            {error && (
              <div className="text-sm text-destructive mb-4">
                [error: {error}]
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={isCreating || isDelegating}
                className="border-border"
              >
                [cancel]
              </Button>
              <Button
                onClick={handleCreateAndDelegate}
                disabled={isCreating || isDelegating}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    [creating wallet...]
                  </>
                ) : isDelegating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    [activating...]
                  </>
                ) : (
                  "[setup wallet]"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
