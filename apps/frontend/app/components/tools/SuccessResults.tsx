import {
  ACTION_NAMES,
  PumpfunLaunchResponse,
  TokenBalancesResponse,
  TokenPriceResponse,
  BondingCurveResponse,
  JupiterSwapResponse,
  BundleAnalysisResponse,
} from "@repo/pumpai-agent";
import { PumpFunSuccess } from "./success/PumpFunSuccess";
import { TokenBalancesSuccess } from "./success/TokenBalancesSuccess";
import { ConfirmationSuccess } from "./success/ConfirmationSuccess";
import { TokenPriceSuccess } from "./success/TokenPriceSuccess";
import { BondingCurveSuccess } from "./success/BondingCurveSuccess";
import { TradeSuccess } from "./success/TradeSuccess";
import { BundleAnalysisSuccess } from "./success/BundleAnalysisSuccess";

// Define a mapping of tool names to their success result types
export type SuccessResultsMap = {
  [ACTION_NAMES.LAUNCH_PUMPFUN_TOKEN]: PumpfunLaunchResponse;
  [ACTION_NAMES.GET_TOKEN_BALANCES]: TokenBalancesResponse;
  [ACTION_NAMES.ASK_FOR_CONFIRMATION]: { confirmed: boolean };
  [ACTION_NAMES.GET_TOKEN_PRICE_PUMPFUN]: TokenPriceResponse;
  [ACTION_NAMES.GET_BONDING_CURVE_PUMPFUN]: BondingCurveResponse;
  [ACTION_NAMES.JUPITER_SWAP]: JupiterSwapResponse;
  [ACTION_NAMES.GET_BUNDLE_ANALYSIS_PUMPFUN]: BundleAnalysisResponse;
};

// Registry of tools that have success components
export const SUCCESS_COMPONENTS_REGISTRY = {
  [ACTION_NAMES.LAUNCH_PUMPFUN_TOKEN]: true,
  [ACTION_NAMES.GET_TOKEN_BALANCES]: true,
  [ACTION_NAMES.ASK_FOR_CONFIRMATION]: true,
  [ACTION_NAMES.GET_TOKEN_PRICE_PUMPFUN]: true,
  [ACTION_NAMES.GET_BONDING_CURVE_PUMPFUN]: true,
  [ACTION_NAMES.JUPITER_SWAP]: true,
  [ACTION_NAMES.GET_BUNDLE_ANALYSIS_PUMPFUN]: true,
} as const;

// Type guard to check if a tool has success results
export function hasSuccessComponent(
  toolName: string
): toolName is keyof SuccessResultsMap {
  return toolName in SUCCESS_COMPONENTS_REGISTRY;
}

interface SuccessResultsProps<T extends keyof SuccessResultsMap> {
  toolName: T;
  data: SuccessResultsMap[T];
}

export function SuccessResults<T extends keyof SuccessResultsMap>({
  toolName,
  data,
}: SuccessResultsProps<T>) {
  switch (toolName) {
    case ACTION_NAMES.LAUNCH_PUMPFUN_TOKEN:
      return <PumpFunSuccess data={data as PumpfunLaunchResponse} />;
    case ACTION_NAMES.GET_TOKEN_BALANCES:
      return <TokenBalancesSuccess data={data as TokenBalancesResponse} />;
    case ACTION_NAMES.ASK_FOR_CONFIRMATION:
      return <ConfirmationSuccess data={data as { confirmed: boolean }} />;
    case ACTION_NAMES.GET_TOKEN_PRICE_PUMPFUN:
      return <TokenPriceSuccess data={data as TokenPriceResponse} />;
    case ACTION_NAMES.GET_BONDING_CURVE_PUMPFUN:
      return <BondingCurveSuccess data={data as BondingCurveResponse} />;
    case ACTION_NAMES.JUPITER_SWAP:
      return <TradeSuccess data={data as JupiterSwapResponse} />;
    case ACTION_NAMES.GET_BUNDLE_ANALYSIS_PUMPFUN:
      return <BundleAnalysisSuccess data={data as BundleAnalysisResponse} />;
    default:
      return null;
  }
}
