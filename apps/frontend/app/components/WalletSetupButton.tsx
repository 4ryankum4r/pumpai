import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useWalletSetup } from "../hooks/useWalletSetup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

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
  const {
    isCreatingWallet,
    isDelegatingWallet,
    error,
    needsDelegation,
    isDelegated,
    createAndDelegateWallet,
    delegateExistingWallet,
    resetError,
  } = useWalletSetup();

  // Reset error when dialog is closed
  useEffect(() => {
    if (!showDialog) {
      resetError();
    }
  }, [showDialog, resetError]);

  // Don't show the button if wallet is already delegated
  if (isDelegated) {
    return null;
  }

  const isLoading = isCreatingWallet || isDelegatingWallet;

  // Handle button click based on wallet state
  const handleClick = () => {
    if (needsDelegation) {
      handleDelegateWallet();
    } else {
      setShowDialog(true);
    }
  };

  const handleCreateWallet = async () => {
    try {
      await createAndDelegateWallet();
      setShowDialog(false);
      onSuccess?.();
    } catch (err) {
      console.error("Failed to setup wallet:", err);
    }
  };

  const handleDelegateWallet = async () => {
    try {
      await delegateExistingWallet();
      onSuccess?.();
    } catch (err) {
      console.error("Failed to delegate wallet:", err);
    }
  };

  // Button text based on current state
  const buttonText = isCreatingWallet
    ? "[creating wallet...]"
    : isDelegatingWallet
      ? "[activating wallet...]"
      : needsDelegation
        ? "[activate wallet]"
        : "[create wallet]";

  // Dialog content based on action type
  const dialogTitle = needsDelegation
    ? "[activate your wallet]"
    : "[create a solana wallet]";
  const dialogDescription = needsDelegation
    ? "[to use PumpAI features, you need to activate your wallet. this allows us to perform automated actions on your behalf.]"
    : "[you need a Solana wallet to use PumpAI. create one now to get started.]";

  return (
    <>
      <Button
        onClick={handleClick}
        className={className}
        variant={variant}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {buttonText}
      </Button>

      {/* Only show dialog for wallet creation, not for delegation */}
      {!needsDelegation && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="border-border bg-background">
            <div className="border-b border-border">
              <DialogHeader className="p-6">
                <DialogTitle className="text-xl text-foreground">
                  {dialogTitle}
                </DialogTitle>
                <DialogDescription className="pt-2 text-muted-foreground">
                  {dialogDescription}
                </DialogDescription>
              </DialogHeader>
            </div>

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
                  disabled={isLoading}
                  className="border-border"
                >
                  [cancel]
                </Button>
                <Button
                  onClick={handleCreateWallet}
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {buttonText}
                    </>
                  ) : (
                    "[create wallet]"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
