"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState, FormEvent } from "react";
import { useClusterStore } from "../store/clusterStore";
import { useThreadMessages, useSaveAllMessages } from "../hooks/chat";
import ChatMessage from "./ChatMessage";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInterfaceProps {
  threadId: string | null;
}

export default function ChatInterface({ threadId }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: initialMessages = [] } = useThreadMessages(threadId);
  const { mutate: saveAllMessages } = useSaveAllMessages();
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [hasActiveToolCall, setHasActiveToolCall] = useState(false);
  const [inputHeight, setInputHeight] = useState(52); // Default height

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    addToolResult,
    reload,
  } = useChat({
    api: "/api/chat/message",
    id: threadId || undefined,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Solana-Cluster": useClusterStore.getState().selectedCluster,
    },
    body: {
      threadId,
    },
    onResponse: () => {
      setIsWaitingForResponse(false);
    },
    initialMessages,
    generateId: () => `msg_${nanoid()}`,
    sendExtraMessageFields: true,
  });

  // Handle failed tool calls
  const handleFailedTools = (errorMessage: string, code: string) => {
    const lastMessage = messages[messages.length - 1];
    const pendingTools = lastMessage?.toolInvocations?.filter(
      (tool) => tool.state === "call"
    );

    pendingTools?.forEach((tool) => {
      addToolResult({
        toolCallId: tool.toolCallId,
        result: {
          status: "error",
          message: errorMessage,
          error: {
            code,
            message: errorMessage,
          },
        },
      });
    });
  };

  // Check for active tool calls in any message
  useEffect(() => {
    const hasActiveTool = messages.some((message) =>
      message?.toolInvocations?.some((t) => t.state === "call")
    );
    setHasActiveToolCall(hasActiveTool);
  }, [messages]);

  // Save messages when they change and not loading
  useEffect(() => {
    if (!isLoading && threadId && messages.length > 0) {
      saveAllMessages({ messages, threadId });
    }
  }, [messages, isLoading, threadId, saveAllMessages]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Wrap handleSubmit to set waiting state
  const wrappedHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setIsWaitingForResponse(true);
    handleSubmit(e);
  };

  // Add handler for stopping
  const handleStop = () => {
    handleFailedTools("Operation stopped by user", "OPERATION_STOPPED");
    setIsWaitingForResponse(false);
    stop();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        const formEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        }) as unknown as FormEvent<HTMLFormElement>;
        wrappedHandleSubmit(formEvent);
      }
    }
  };

  const handleRetry = () => {
    handleFailedTools("Operation failed", "OPERATION_FAILED");
    reload();
  };

  // Handle textarea height adjustment
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    const textarea = e.target;
    textarea.style.height = "52px"; // Reset height
    const newHeight = Math.min(200, textarea.scrollHeight); // Cap at 200px
    textarea.style.height = `${newHeight}px`;
    setInputHeight(newHeight);
  };

  if (!threadId) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
            Welcome to PumpAI
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-8">
            Start a new chat or select an existing one to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto pumpai-scrollbar">
        <div className="max-w-3xl mx-auto w-full py-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center max-w-lg mx-auto space-y-4">
                <h3 className="text-3xl font-semibold text-foreground">
                  Start a New Conversation
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ask me anything about pump.fun actions - I can help you
                  analyze and interact with pump.fun&apos;s features and
                  ecosystem!
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLoading={
                  isLoading &&
                  messages.length > 0 &&
                  message.id === messages[messages.length - 1].id &&
                  message.role === "assistant"
                }
                isWaitingForResponse={isWaitingForResponse}
                addToolResult={addToolResult}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex-shrink-0 px-4 mb-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-2 bg-background/50 rounded-lg p-3 border border-border">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[0.9375rem] text-muted-foreground flex items-center gap-2">
                    <span className="text-destructive text-sm">[error]</span>
                    <span className="text-destructive/90">{error.message}</span>
                  </p>
                </div>
                <Button
                  onClick={handleRetry}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  [retry]
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isWaitingForResponse && (
        <div className="flex-shrink-0 px-4 mb-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Input form */}
      <div className="flex-shrink-0 bg-background py-4">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={wrappedHandleSubmit}>
            <div className="relative flex items-end">
              <Textarea
                value={input}
                onChange={handleTextareaChange}
                placeholder={
                  hasActiveToolCall
                    ? "waiting for response..."
                    : "type your message..."
                }
                rows={1}
                className="resize-none pr-[100px] text-[15px] text-foreground dark:text-foreground placeholder:text-muted-foreground/70 min-h-[52px] bg-muted border-border w-full"
                style={{
                  height: `${inputHeight}px`,
                  maxHeight: "200px",
                  overflowY: inputHeight >= 200 ? "auto" : "hidden",
                }}
                disabled={isLoading || hasActiveToolCall}
                onKeyDown={handleKeyDown}
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                <Button
                  type="submit"
                  disabled={isLoading || hasActiveToolCall || !input.trim()}
                  className="bg-primary hover:bg-primary/90 !text-primary-foreground font-medium transition-all duration-200 px-3 h-8"
                >
                  send
                </Button>
                {(isWaitingForResponse || hasActiveToolCall || isLoading) && (
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleStop}
                    className="bg-destructive/10 hover:bg-destructive/20 !text-destructive font-medium transition-all duration-200 px-3 h-8"
                  >
                    stop
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
