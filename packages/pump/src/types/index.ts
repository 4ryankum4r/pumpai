export * from "./input.js";
export * from "./cluster.js";
export * from "./action.js";

export interface Config {
  OPENAI_API_KEY?: string;
  JUPITER_REFERRAL_ACCOUNT?: string;
  JUPITER_FEE_BPS?: number;
  FLASH_PRIVILEGE?: string;
  HELIUS_API_KEY?: string;
  PRIORITY_LEVEL?: "low" | "medium" | "high";
}

export interface Creator {
  address: string;
  percentage: number;
}

export interface PumpFunTokenOptions {
  twitter?: string;
  telegram?: string;
  website?: string;
  initialLiquiditySOL?: number;
  slippageBps?: number;
  priorityFee?: number;
}

export interface PumpfunLaunchResponse {
  signature: string;
  mint: string;
  metadataUri?: string;
  error?: string;
}

export interface TokenBalancesResponse {
  sol: number;
  tokens: Array<{
    tokenAddress: string;
    name: string;
    symbol: string;
    balance: number;
    decimals: number;
  }>;
}

export interface TransferResponse {
  signature: string;
  amount: number;
  token?: string;
  recipient: string;
}

export interface TokenPriceResponse {
  priceSOL: number;
  mint: string;
  curveAddress: string;
  isRaydiumPool?: boolean;
  raydiumPoolAddress?: string;
  name?: string;
  symbol?: string;
  description?: string;
  imageUri?: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  marketCap?: number;
  usdMarketCap?: number;
}

export interface BondingCurveResponse {
  bondingProgress: number;
  priceSOL: number;
  complete: boolean;
  mint: string;
  curveAddress: string;
  // Token metadata
  name?: string;
  symbol?: string;
  description?: string;
  imageUri?: string;
  // Social links
  twitter?: string;
  telegram?: string;
  website?: string;
  // Market data
  isRaydiumPool?: boolean;
  raydiumPoolAddress?: string;
  marketCap?: number;
  usdMarketCap?: number;
}

export interface JupiterTokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  tags: string[];
  logoURI: string;
  daily_volume: number;
  freeze_authority: string | null;
  mint_authority: string | null;
  permanent_delegate: string | null;
  extensions: {
    coingeckoId?: string;
  };
}

export interface PumpFunTokenData {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  metadata_uri: string;
  twitter?: string;
  telegram?: string;
  bonding_curve: string;
  associated_bonding_curve: string;
  creator: string;
  created_timestamp: number;
  raydium_pool: string | null;
  complete: boolean;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  total_supply: number;
  website?: string;
  show_name: boolean;
  king_of_the_hill_timestamp?: number;
  market_cap: number;
  reply_count: number;
  last_reply: number;
  nsfw: boolean;
  market_id: string;
  usd_market_cap: number;
}

export interface JupiterFetchPriceResponse {
  price: string;
}

export interface JupiterSwapResponse {
  transaction: string;
  inputAmount: number;
  inputToken: string;
  outputToken: string;
  status?: "success" | "error";
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

// Pumpfun bundle analysis
export interface PumpFunTrade {
  slot: number;
  user: string;
  username?: string;
  token_amount: number;
  sol_amount: number;
  is_buy: boolean;
  signature: string;
  timestamp: number;
}

export interface WalletSummary {
  currentBalance: number;
  totalBought: number;
  totalSold: number;
  username?: string;
}

export interface BundleAnalysis {
  slot: number;
  uniqueWallets: number;
  trades: PumpFunTrade[];
  totalTokenAmount: number;
  totalSolAmount: number;
  supplyPercentage: string;
  holdingAmount: number;
  holdingPercentage: string;
  category: string;
  walletSummaries: Record<string, WalletSummary>;
}

export interface BundleAnalysisResponse {
  mint: string;
  totalTrades: number;
  bundles: BundleAnalysis[];
}
