import { useState } from "react";
import { usePrivy, useHeadlessDelegatedActions } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useStoreWallet } from "./wallet";

interface WalletSetupState {
  isCreatingWallet: boolean;
  isDelegatingWallet: boolean;
  error: string | null;
  needsDelegation: boolean;
  hasWallet: boolean;
  isDelegated: boolean;
}

interface WalletSetupActions {
  createAndDelegateWallet: () => Promise<void>;
  delegateExistingWallet: () => Promise<void>;
  resetError: () => void;
  setError: (error: string | null) => void;
}

export const useWalletSetup = (): WalletSetupState & WalletSetupActions => {
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isDelegatingWallet, setIsDelegatingWallet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createWallet } = useSolanaWallets();
  const { delegateWallet } = useHeadlessDelegatedActions();
  const { mutateAsync: storeWallet } = useStoreWallet();
  const { user } = usePrivy();

  // Wallet states
  const hasWallet = !!user?.wallet;
  const isDelegated = hasWallet && !!user?.wallet?.delegated;
  const needsDelegation = hasWallet && !isDelegated;

  const resetError = () => setError(null);

  const delegateExistingWallet = async () => {
    if (!user?.wallet?.address) {
      throw new Error("No wallet found to delegate");
    }

    try {
      setIsDelegatingWallet(true);
      setError(null);

      // Delegate the wallet
      await delegateWallet({
        address: user.wallet.address,
        chainType: "solana",
      });

      // Store the wallet after delegation
      await storeWallet({
        address: user.wallet.address,
        chainType: user.wallet.chainType,
      });
    } catch (err) {
      console.error("Error delegating wallet:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delegate wallet"
      );
      throw err;
    } finally {
      setIsDelegatingWallet(false);
    }
  };

  const createAndDelegateWallet = async () => {
    try {
      setIsCreatingWallet(true);
      setError(null);

      // If user has a wallet but it's not delegated, just delegate it
      if (needsDelegation) {
        setIsCreatingWallet(false); // Reset creating state since we're delegating
        return delegateExistingWallet();
      }

      // If user already has a delegated wallet, prevent creation
      if (isDelegated) {
        setIsCreatingWallet(false);
        throw new Error("User already has a delegated wallet");
      }

      // Create new wallet
      const wallet = await createWallet();
      if (!wallet?.address) {
        throw new Error("Failed to create wallet");
      }

      // Delegate the new wallet
      setIsDelegatingWallet(true);
      await delegateWallet({
        address: wallet.address,
        chainType: "solana",
      });

      // Store the wallet
      await storeWallet({
        address: wallet.address,
        chainType: wallet.chainType,
      });
    } catch (err) {
      console.error("Error in wallet setup:", err);
      setError(err instanceof Error ? err.message : "Failed to setup wallet");
      throw err;
    } finally {
      setIsCreatingWallet(false);
      setIsDelegatingWallet(false);
    }
  };

  return {
    // States
    isCreatingWallet,
    isDelegatingWallet,
    error,
    needsDelegation,
    hasWallet,
    isDelegated,
    // Actions
    createAndDelegateWallet,
    delegateExistingWallet,
    resetError,
    setError,
  };
};
