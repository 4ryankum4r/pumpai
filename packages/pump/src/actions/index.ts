import { ACTION_NAMES } from "./actionNames.js";
import {
  closeEmptyTokenAccountsAction,
  getBalanceAction,
  getBalanceOtherAction,
  getTokenBalancesAction,
  getTPSAction,
  requestFaucetFundsAction,
  transferAction,
} from "./solana/index.js";
import {
  launchPumpfunTokenAction,
  getTokenPricePumpFunAction,
  getBondingCurvePumpFunAction,
  getBundleAnalysisPumpFunAction,
} from "./pumpfun/index.js";
import {
  getTokenDataByAddressAction,
  getTokenDataByTickerAction,
} from "./dexscreener/index.js";
import askForConfirmationAction from "./confirmation/askForConfirmation.js";
import fetchPriceAction from "./jupiter/fetchPrice.js";
import tradeAction from "./jupiter/trade.js";

export { ACTION_NAMES };

export const ACTIONS = {
  [ACTION_NAMES.CLOSE_EMPTY_TOKEN_ACCOUNTS]: closeEmptyTokenAccountsAction,
  [ACTION_NAMES.GET_BALANCE]: getBalanceAction,
  [ACTION_NAMES.GET_BALANCE_OTHER]: getBalanceOtherAction,
  [ACTION_NAMES.GET_TOKEN_BALANCES]: getTokenBalancesAction,
  [ACTION_NAMES.GET_TPS]: getTPSAction,
  [ACTION_NAMES.REQUEST_FAUCET_FUNDS]: requestFaucetFundsAction,
  [ACTION_NAMES.TRANSFER]: transferAction,
  [ACTION_NAMES.ASK_FOR_CONFIRMATION]: askForConfirmationAction,
  [ACTION_NAMES.LAUNCH_PUMPFUN_TOKEN]: launchPumpfunTokenAction,
  [ACTION_NAMES.GET_TOKEN_PRICE_PUMPFUN]: getTokenPricePumpFunAction,
  [ACTION_NAMES.GET_BONDING_CURVE_PUMPFUN]: getBondingCurvePumpFunAction,
  [ACTION_NAMES.GET_BUNDLE_ANALYSIS_PUMPFUN]: getBundleAnalysisPumpFunAction,
  [ACTION_NAMES.GET_TOKEN_DATA_BY_ADDRESS]: getTokenDataByAddressAction,
  [ACTION_NAMES.GET_TOKEN_DATA_BY_TICKER]: getTokenDataByTickerAction,
  [ACTION_NAMES.FETCH_PRICE]: fetchPriceAction,
  [ACTION_NAMES.JUPITER_SWAP]: tradeAction,
};

export type { Action, ActionExample, Handler } from "../types/action.js";
