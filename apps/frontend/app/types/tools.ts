/**
 * This module defines the type system for tool results in the application.
 * Tools are external integrations or actions that can be invoked, and this
 * provides a standardized way to handle their responses.
 */

import {
  PumpfunLaunchResponse,
  ACTION_NAMES,
  LaunchPumpfunTokenInput,
  AskForConfirmationInput,
} from "@repo/pumpai-agent";

/**
 * Possible status values for a tool execution result
 * - success: The tool executed successfully
 * - error: The tool encountered an error during execution
 * - cancelled: The tool execution was cancelled by the user or system
 */
export type ToolResultStatus = "success" | "error" | "cancelled";

/**
 * Base interface for all tool results
 * @template T The type of the successful result data
 *
 * For example:
 * const result: ToolResultBase<{ count: number }> = {
 *   status: "success",
 *   message: "Counter updated",
 *   data: { count: 42 }
 * };
 */
export interface ToolResultBase<T = unknown> {
  /** The execution status of the tool */
  status: ToolResultStatus;
  /** A human-readable message describing the result */
  message: string;
  /** The actual result data, present only on successful execution */
  data?: T;
  /** Error information, present only when status is "error" */
  error?: {
    /** Machine-readable error code */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Additional error context/stack trace */
    details?: unknown;
  };
}

/**
 * Specific result type for the PumpFun Launch tool
 * Extends the base result type with PumpfunLaunchResponse as the data type
 */
export type PumpFunLaunchToolResult = ToolResultBase<PumpfunLaunchResponse>;

/**
 * Specific result type for the Confirmation tool
 */
export type ConfirmationToolResult = ToolResultBase<{
  confirmed: boolean;
}>;

// export type JupiterSwapToolResult = ToolResultBase<JupiterSwapResponse>;

/**
 * Registry that maps tool names to their corresponding result types
 * This allows for type-safe access to tool results based on the tool name
 *
 * To add a new tool, extend this interface with a new entry:
 * [ACTION_NAMES.NEW_TOOL]: ToolResultBase<NewToolResponseType>;
 */
export interface ToolResultTypes {
  [ACTION_NAMES.LAUNCH_PUMPFUN_TOKEN]: PumpFunLaunchToolResult;
  [ACTION_NAMES.ASK_FOR_CONFIRMATION]: ConfirmationToolResult;
  // [ACTION_NAMES.JUPITER_SWAP]: JupiterSwapToolResult;
  // Add other tool result types here as needed
}

/**
 * Helper type that extracts the result type for a specific tool from the registry
 * @template T The tool name (key) from ToolResultTypes
 *
 * Usage:
 * const result: ToolResultType<typeof ACTION_NAMES.LAUNCH_PUMPFUN_TOKEN>;
 */
export type ToolResultType<T extends keyof ToolResultTypes> =
  ToolResultTypes[T];

/**
 * Type guard function that checks if a value matches the ToolResultBase structure
 * Used for runtime type checking of tool results
 *
 * Usage:
 * if (isToolResult(response)) {
 *   // TypeScript now knows response has status and message properties
 *   console.log(response.status, response.message);
 * }
 */
export function isToolResult(value: unknown): value is ToolResultBase {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    "message" in value &&
    (value as ToolResultBase).status in
      {
        success: true,
        error: true,
        cancelled: true,
      }
  );
}

/**
 * Registry that maps tool names to their corresponding input types
 */
export interface ToolInputTypes {
  [ACTION_NAMES.LAUNCH_PUMPFUN_TOKEN]: LaunchPumpfunTokenInput;
  [ACTION_NAMES.ASK_FOR_CONFIRMATION]: AskForConfirmationInput;
  // Add new tool input types here
}

/**
 * Helper type that extracts the input type for a specific tool
 */
export type ToolInputType<T extends keyof ToolInputTypes> = ToolInputTypes[T];
