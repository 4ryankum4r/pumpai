import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Message } from "../types";
import { nanoid } from "nanoid";
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolInvocation } from "ai";
import {
  getToolComponent,
  preprocessToolResult,
  ValidToolName,
} from "./tools/registry";
import { isToolResult } from "../types/tools";
import {
  SuccessResults,
  hasSuccessComponent,
  SuccessResultsMap,
} from "./tools/SuccessResults";
import { ToolNames } from "./ToolNames";

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
  isWaitingForResponse?: boolean;
  addToolResult: (result: { toolCallId: string; result: unknown }) => void;
  onStop?: () => void;
}

const isMessageReadyToRender = (message: Message): boolean => {
  const hasContent = Boolean(message.content?.trim());
  const toolInvocations = message.toolInvocations ?? [];

  if (!hasContent && !toolInvocations.length) {
    return false;
  }

  const hasValidTools = toolInvocations.some((tool) => {
    // Check for pending tool calls
    if (tool.state === "call") {
      return Boolean(getToolComponent(tool));
    }

    // Check for completed tool results
    if (tool.state === "result") {
      const toolResult = (tool as { result?: unknown }).result;
      if (!isToolResult(toolResult)) return false;

      const { status } = toolResult;
      return (
        status === "error" ||
        status === "cancelled" ||
        (status === "success" && hasSuccessComponent(tool.toolName))
      );
    }

    return false;
  });

  return hasContent || hasValidTools;
};

export default function ChatMessage({
  message,
  isLoading,
  addToolResult,
  onStop,
}: ChatMessageProps) {
  const toolNames =
    message.toolInvocations?.map((tool) => tool.toolName).filter(Boolean) || [];

  if (!isMessageReadyToRender(message)) {
    return (
      <div className="w-full">
        {toolNames.length > 0 && (
          <div className="w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto px-4">
            <ToolNames toolNames={toolNames} className="py-2" />
          </div>
        )}
      </div>
    );
  }

  const renderToolInvocation = (toolInvocation: ToolInvocation) => {
    if (!toolInvocation) return null;

    const { state, toolCallId, toolName } = toolInvocation;
    const toolResult = (toolInvocation as { result?: unknown }).result;

    // Handle successful tool execution
    if (
      state === "result" &&
      isToolResult(toolResult) &&
      toolResult.status === "success"
    ) {
      if (hasSuccessComponent(toolName)) {
        return (
          <div key={toolCallId} className="mt-4">
            <SuccessResults
              toolName={toolName as keyof SuccessResultsMap}
              data={
                toolResult.data as SuccessResultsMap[keyof SuccessResultsMap]
              }
            />
          </div>
        );
      }
      return null;
    }

    // Handle error or cancelled states
    if (
      state === "result" &&
      isToolResult(toolResult) &&
      (toolResult.status === "error" || toolResult.status === "cancelled")
    ) {
      const isError = toolResult.status === "error";
      const errorMessage = toolResult.error?.message;

      return (
        <div
          key={toolCallId}
          className="flex flex-col gap-2 bg-background/50 rounded-lg p-3 border border-border"
        >
          <div className="flex items-center gap-3">
            <XCircle
              className={cn(
                "w-4 h-4 flex-shrink-0 opacity-70",
                isError ? "text-destructive" : "text-destructive/90"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[0.9375rem] text-muted-foreground">
                [{isError ? "error" : "cancelled"}]:{" "}
                <span className="text-destructive">
                  {toolResult.message ||
                    (isError ? "operation failed" : "operation cancelled")}
                </span>
              </p>
            </div>
          </div>
          {isError && errorMessage && (
            <div className="ml-7 text-[0.875rem] text-muted-foreground/80">
              [details]:{" "}
              <span className="text-destructive/80">{errorMessage}</span>
            </div>
          )}
        </div>
      );
    }

    // Handle pending tool calls
    if (state === "call") {
      const ToolComponent = getToolComponent(toolInvocation);
      if (!ToolComponent) return null;

      try {
        return (
          <ToolComponent
            key={toolCallId}
            args={toolInvocation.args}
            onSubmit={(toolResult) => {
              const processedResult = preprocessToolResult(
                toolName as ValidToolName,
                toolResult
              );
              addToolResult({
                toolCallId,
                result: processedResult,
              });
            }}
          />
        );
      } catch (error) {
        console.error("Error rendering tool invocation:", error);
        return (
          <div
            key={toolCallId}
            className="flex flex-col gap-2 bg-background/50 rounded-lg p-3 border border-border"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-4 h-4 flex-shrink-0 text-destructive opacity-70" />
              <p className="text-[0.9375rem] text-muted-foreground">
                [error]:{" "}
                <span className="text-destructive">failed to render tool</span>
              </p>
            </div>
            <div className="ml-7 text-[0.875rem] text-muted-foreground/80">
              [details]:{" "}
              <span className="text-destructive/80">
                {error instanceof Error ? error.message : "unknown error"}
              </span>
            </div>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="w-full">
      {toolNames.length > 0 && (
        <div className="w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto px-4">
          <ToolNames toolNames={toolNames} className="py-2" />
        </div>
      )}
      {isMessageReadyToRender(message) && (
        <div className="py-2">
          <div className="w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto px-4">
            <div
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start",
                "w-full"
              )}
            >
              <div
                className={cn(
                  "min-w-0 max-w-full sm:max-w-[85%] rounded-lg",
                  message.role === "assistant"
                    ? "bg-chat-bg/60"
                    : "bg-primary text-foreground",
                  "transition-all duration-200"
                )}
              >
                <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div
                      className={cn(
                        "prose prose-sm max-w-none break-words",
                        message.role === "assistant"
                          ? "text-muted-foreground"
                          : "!text-primary-foreground prose-headings:!text-primary-foreground prose-p:!text-primary-foreground prose-strong:!text-primary-foreground",
                        isLoading && "opacity-60"
                      )}
                    >
                      {isLoading && onStop && (
                        <div className="mb-2 flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent" />
                          <button
                            onClick={onStop}
                            className="text-xs text-destructive hover:text-destructive/90"
                          >
                            Stop generating
                          </button>
                        </div>
                      )}
                      {/* Show tool results first */}
                      {message.toolInvocations &&
                        message.toolInvocations.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {message.toolInvocations.map((toolInvocation) =>
                              renderToolInvocation(toolInvocation)
                            )}
                          </div>
                        )}
                      {/* Then show message content */}
                      {message.content?.trim() && (
                        <ReactMarkdown
                          components={{
                            code({ className, children, ...props }) {
                              const isInline = (props as { inline?: boolean })
                                .inline;
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return !isInline && match ? (
                                <div
                                  key={nanoid()}
                                  className="relative group/code mt-3 mb-1"
                                >
                                  <div className="absolute -top-4 left-0 right-0 h-6 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/30 rounded-t-lg flex items-center px-2 sm:px-3">
                                    <span className="text-[10px] font-medium text-foreground/70">
                                      {match[1].toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="!bg-muted/30 dark:!bg-muted/20 !rounded-lg !rounded-tl-none !pt-4 text-xs !mt-0 !mb-0 whitespace-pre-wrap break-all">
                                    <SyntaxHighlighter
                                      style={vscDarkPlus}
                                      language={match[1]}
                                      customStyle={{ fontSize: "inherit" }}
                                      wrapLongLines={true}
                                    >
                                      {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                  </div>
                                </div>
                              ) : (
                                <code
                                  key={nanoid()}
                                  {...props}
                                  className={cn(
                                    "px-1.5 py-0.5 rounded-md text-xs sm:text-sm break-all",
                                    message.role === "assistant"
                                      ? "bg-muted/40 dark:bg-muted/30"
                                      : "bg-primary/10"
                                  )}
                                >
                                  {children}
                                </code>
                              );
                            },
                            p({ children }) {
                              return (
                                <p
                                  key={nanoid()}
                                  className="mb-2 last:mb-0 break-words text-xs sm:text-sm leading-relaxed"
                                >
                                  {children}
                                </p>
                              );
                            },
                            ul({ children }) {
                              return (
                                <ul
                                  key={nanoid()}
                                  className="mb-2 last:mb-0 space-y-1.5 text-xs sm:text-sm list-disc pl-4 marker:text-muted-foreground"
                                >
                                  {children}
                                </ul>
                              );
                            },
                            ol({ children }) {
                              return (
                                <ol
                                  key={nanoid()}
                                  className="mb-2 last:mb-0 space-y-1.5 text-xs sm:text-sm list-decimal pl-4 marker:text-muted-foreground"
                                >
                                  {children}
                                </ol>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
