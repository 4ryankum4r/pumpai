import { Connection, PublicKey } from "@solana/web3.js";
import { BondingCurveResponse, PumpFunTokenData } from "../../types/index.js";
import {
  calculatePumpCurvePrice,
  fetchPumpFunTokenData,
  findPumpCurveAddress,
  calculateBondingProgressWithRealReserves,
} from "./utils.js";
import { getPumpCurveState } from "./token_price_pump_fun.js";

export async function getPumpFunBondingCurve(
  connection: Connection,
  mintAddress: string,
): Promise<BondingCurveResponse> {
  const tokenData: PumpFunTokenData = await fetchPumpFunTokenData(mintAddress);
  const curveAddress = findPumpCurveAddress(new PublicKey(mintAddress));
  const curveState = await getPumpCurveState(connection, curveAddress);

  let priceSOL = 0;
  try {
    // Calculate price regardless of Raydium status for historical reference
    priceSOL = calculatePumpCurvePrice(
      curveState.virtualSolReserves,
      curveState.virtualTokenReserves,
    );
  } catch (err) {
    const error = err as Error;
    console.log(
      "Failed to calculate bonding curve price:",
      error?.message || "Unknown error",
    );
  }

  const bondingProgress = calculateBondingProgressWithRealReserves(
    curveState.realTokenReserves,
  );

  // Construct the response object with essential data
  const response: BondingCurveResponse = {
    bondingProgress,
    priceSOL,
    complete: curveState.complete,
    mint: mintAddress,
    curveAddress: curveAddress.toBase58(),
    // Token metadata
    name: tokenData.name,
    symbol: tokenData.symbol,
    description: tokenData.description,
    imageUri: tokenData.image_uri,
    // Social links
    twitter: tokenData.twitter,
    telegram: tokenData.telegram,
    website: tokenData.website,
    // Market data
    isRaydiumPool: !!tokenData.raydium_pool,
    raydiumPoolAddress: tokenData.raydium_pool || undefined,
    marketCap: tokenData.market_cap,
    usdMarketCap: tokenData.usd_market_cap,
  };

  // Add toJSON for serialization
  (response as any).toJSON = function () {
    return {
      ...this,
      bondingProgress: Number(this.bondingProgress),
      priceSOL: Number(this.priceSOL),
      marketCap: this.marketCap ? Number(this.marketCap) : undefined,
      usdMarketCap: this.usdMarketCap ? Number(this.usdMarketCap) : undefined,
    };
  };

  return response;
}
