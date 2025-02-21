import { cn } from "@/lib/utils";
import { ACTION_NAMES } from "@repo/pumpai-agent";
import React from "react";

interface ToolNamesProps {
  toolNames: string[];
  className?: string;
}

const TOOL_DISPLAY_CONFIG: Record<string, { label: string }> = {
  [ACTION_NAMES.LAUNCH_PUMPFUN_TOKEN]: {
    label: "launch token",
  },
  [ACTION_NAMES.GET_TOKEN_PRICE_PUMPFUN]: {
    label: "pumpfun token price",
  },
  [ACTION_NAMES.GET_BONDING_CURVE_PUMPFUN]: {
    label: "pumpfun bonding curve",
  },
  [ACTION_NAMES.GET_BUNDLE_ANALYSIS_PUMPFUN]: {
    label: "pumpfun bundle analysis",
  },
  [ACTION_NAMES.TRANSFER]: {
    label: "transfer",
  },
  [ACTION_NAMES.GET_TOKEN_BALANCES]: {
    label: "token balances",
  },
  [ACTION_NAMES.GET_TOKEN_DATA_BY_ADDRESS]: {
    label: "token data",
  },
  [ACTION_NAMES.GET_TOKEN_DATA_BY_TICKER]: {
    label: "token data",
  },
  [ACTION_NAMES.GET_BALANCE]: {
    label: "balance",
  },
  [ACTION_NAMES.GET_BALANCE_OTHER]: {
    label: "other balance",
  },
  [ACTION_NAMES.GET_TPS]: {
    label: "network tps",
  },
  [ACTION_NAMES.REQUEST_FAUCET_FUNDS]: {
    label: "faucet",
  },
  [ACTION_NAMES.CLOSE_EMPTY_TOKEN_ACCOUNTS]: {
    label: "close empty",
  },
  [ACTION_NAMES.ASK_FOR_CONFIRMATION]: {
    label: "confirmation",
  },
  [ACTION_NAMES.FETCH_PRICE]: {
    label: "price",
  },
  [ACTION_NAMES.JUPITER_SWAP]: {
    label: "trade",
  },
};

export function ToolNames({ toolNames, className }: ToolNamesProps) {
  if (!toolNames.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {toolNames.map((name, index) => {
        const config = TOOL_DISPLAY_CONFIG[name];
        if (!config) return null;

        return (
          <div
            key={index}
            className="text-xs px-2 py-1 rounded-md bg-primary/5 text-muted-foreground hover:text-foreground border border-primary/10 hover:bg-primary/10 transition-colors"
            title={name}
          >
            [{config.label}]
          </div>
        );
      })}
    </div>
  );
}
