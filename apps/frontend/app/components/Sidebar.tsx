import { Loader2, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { ThreadPreview } from "../types";
import { usePrivy } from "@privy-io/react-auth";
import { useWalletSetup } from "../hooks/useWalletSetup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface SidebarProps {
  threads: ThreadPreview[];
  selectedThread: string | null;
  onSelectThread: (threadId: string) => void;
  onCreateThread: () => void;
  isLoading: boolean;
  onDeleteClick: (thread: ThreadPreview) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export default function Sidebar({
  threads,
  selectedThread,
  onSelectThread,
  onCreateThread,
  isLoading,
  onDeleteClick,
  onToggleCollapse,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: SidebarProps) {
  const { user } = usePrivy();
  const { createAndDelegateWallet, isCreatingWallet } = useWalletSetup();
  const [threadToDelete, setThreadToDelete] = useState<ThreadPreview | null>(
    null
  );
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);

  const handleNewChatClick = async () => {
    if (user?.wallet?.delegated) {
      onCreateThread();
    } else if (needsWalletSetup) {
      try {
        await createAndDelegateWallet();
      } catch (error) {
        console.error("Failed to setup wallet:", error);
      }
    }
  };

  const handleDeleteClick = async (
    thread: ThreadPreview,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setThreadToDelete(thread);
  };

  const confirmDelete = async () => {
    if (!threadToDelete) return;

    setDeletingThreadId(threadToDelete.threadId);
    try {
      await onDeleteClick(threadToDelete);
    } finally {
      setDeletingThreadId(null);
      setThreadToDelete(null);
    }
  };

  const formatThreadName = (thread: ThreadPreview) => {
    return thread.title || "[new chat]";
  };

  const canCreateNewChat = user?.wallet?.delegated;
  const needsWalletSetup = !user?.wallet || !user.wallet.delegated;

  return (
    <>
      {/* Sidebar */}
      <div className="flex flex-col h-full w-[260px] bg-background border-r border-border">
        {/* Header */}
        <div className="flex-shrink-0 h-12 p-2 border-b border-border">
          <div className="flex items-center justify-between h-full">
            <Button
              onClick={handleNewChatClick}
              variant="ghost"
              className={`bg-background hover:bg-background/80 text-muted-foreground hover:text-foreground text-sm h-8
                ${onToggleCollapse ? "w-[calc(100%-36px)]" : "w-full"}`}
              disabled={isLoading || isCreatingWallet}
            >
              {isLoading || isCreatingWallet ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {canCreateNewChat ? (
                <div className="flex items-center gap-2">[new chat] [+]</div>
              ) : (
                "[setup wallet to chat]"
              )}
            </Button>
            {onToggleCollapse && (
              <Button
                variant="ghost"
                onClick={onToggleCollapse}
                className="text-muted-foreground hover:text-foreground md:hidden h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {threads.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">[no chats yet]</p>
              <p className="text-xs mt-2 opacity-80">
                {canCreateNewChat
                  ? "[start a new chat to begin]"
                  : needsWalletSetup && user?.wallet
                    ? "[activate wallet to start chatting]"
                    : "[setup wallet to start chatting]"}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5 p-2">
              {threads.map((thread) => (
                <div
                  key={thread.threadId}
                  onClick={() => {
                    onSelectThread(thread.threadId);
                    if (window.innerWidth < 768) {
                      onToggleCollapse?.();
                    }
                  }}
                  className={`flex items-center h-8 px-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors active:bg-accent/70 group
                    ${selectedThread === thread.threadId ? "bg-accent" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className={`truncate text-sm font-medium ${
                        selectedThread === thread.threadId
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {formatThreadName(thread)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="ml-2 text-xs h-6 px-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive active:text-destructive/70 transition-opacity"
                    onClick={(e) => handleDeleteClick(thread, e)}
                    disabled={deletingThreadId === thread.threadId}
                  >
                    {deletingThreadId === thread.threadId ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "[x]"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Section - Only Load More */}
        {hasMore && (
          <div className="flex-none border-t border-border p-2">
            <Button
              variant="ghost"
              className="w-full bg-background hover:bg-background/80 text-muted-foreground hover:text-foreground text-sm sm:text-base"
              onClick={onLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  [loading...]
                </>
              ) : (
                "[load more]"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={threadToDelete !== null}
        onOpenChange={(open) => !open && setThreadToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px] border-border bg-background fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-medium text-foreground">
              delete chat
            </DialogTitle>
            <DialogDescription className="pt-2 sm:pt-3 text-sm text-muted-foreground">
              <div className="space-y-2">
                <div>warning: this action is permanent</div>
                <div className="text-xs sm:text-sm opacity-80">
                  chat: {threadToDelete?.title || "untitled"}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-3 sm:pt-4">
            <Button
              variant="ghost"
              onClick={() => setThreadToDelete(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              [cancel]
            </Button>
            <Button
              variant="ghost"
              onClick={confirmDelete}
              disabled={deletingThreadId !== null}
              className="text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {deletingThreadId ? "[deleting...]" : "[confirm delete]"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
