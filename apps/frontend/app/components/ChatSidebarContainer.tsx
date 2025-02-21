"use client";

import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCreateThread, useDeleteThread, chatKeys } from "../hooks/chat";
import { chatClient } from "../clients/chat";
import { ThreadPreview } from "../types";
import Sidebar from "./Sidebar";

interface ChatSidebarContainerProps {
  threadId: string | null;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ChatSidebarContainer({
  threadId,
  isCollapsed = false,
  onToggleCollapse,
}: ChatSidebarContainerProps) {
  const router = useRouter();
  const { mutateAsync: createThreadMutation } = useCreateThread();
  const { mutateAsync: deleteThreadMutation } = useDeleteThread();

  // Fetch threads with infinite query
  const {
    data,
    isLoading: isThreadsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: chatKeys.threads(),
    queryFn: async ({ pageParam }) => {
      return chatClient.getThreads({
        limit: 20,
        cursor: pageParam as string | undefined,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });

  // Flatten all threads from all pages
  const threads = data?.pages.flatMap((page) => page.threads) || [];

  const handleCreateThread = async () => {
    try {
      const response = await createThreadMutation();
      router.push(`/?cid=${response.threadId}`);
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  const handleDeleteThread = async (thread: ThreadPreview) => {
    try {
      await deleteThreadMutation(thread.threadId);
      if (threadId === thread.threadId) {
        router.push("/");
      }
      // Refresh the threads list after deletion
      refetch();
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  const handleSelectThread = (threadId: string) => {
    router.push(`/?cid=${threadId}`);
  };

  return (
    <div className="h-full">
      <Sidebar
        threads={threads}
        selectedThread={threadId}
        onSelectThread={(threadId) => {
          handleSelectThread(threadId);
          // Close sidebar on mobile after selecting a thread
          if (window.innerWidth < 768) {
            onToggleCollapse?.();
          }
        }}
        onCreateThread={handleCreateThread}
        isLoading={isThreadsLoading}
        onDeleteClick={handleDeleteThread}
        hasMore={!!hasNextPage}
        isLoadingMore={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
    </div>
  );
}
