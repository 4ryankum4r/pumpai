import { PublicKey, Connection } from "@solana/web3.js";
import { TokenPriceResponse } from "../../types/index.js";
import {
  PUMP_CURVE_STATE_SIGNATURE,
  fetchPumpFunTokenData,
  findPumpCurveAddress,
  calculatePumpCurvePrice,
} from "./utils.js";

export interface PumpCurveState {
  virtualTokenReserves: bigint;
  virtualSolReserves: bigint;
  realTokenReserves: bigint;
  realSolReserves: bigint;
  tokenTotalSupply: bigint;
  complete: boolean;
}

const PUMP_CURVE_STATE_OFFSETS = {
  VIRTUAL_TOKEN_RESERVES: 0x08,
  VIRTUAL_SOL_RESERVES: 0x10,
  REAL_TOKEN_RESERVES: 0x18,
  REAL_SOL_RESERVES: 0x20,
  TOKEN_TOTAL_SUPPLY: 0x28,
  COMPLETE: 0x30,
};

async function getPumpCurveState(
  conn: Connection,
  curveAddress: PublicKey,
): Promise<PumpCurveState> {
  console.log(
    `Fetching pump curve state for address: ${curveAddress.toString()}`,
  );
  const accountInfo = await conn.getAccountInfo(curveAddress);
  if (!accountInfo?.data) throw new Error("Curve account not found");

  const signature = accountInfo.data.subarray(0, 8);
  if (Buffer.compare(signature, PUMP_CURVE_STATE_SIGNATURE) !== 0) {
    throw new Error("Invalid curve account signature");
  }

  const data = Buffer.from(accountInfo.data);
  const state = {
    virtualTokenReserves: data.readBigUInt64LE(
      PUMP_CURVE_STATE_OFFSETS.VIRTUAL_TOKEN_RESERVES,
    ),
    virtualSolReserves: data.readBigUInt64LE(
      PUMP_CURVE_STATE_OFFSETS.VIRTUAL_SOL_RESERVES,
    ),
    realTokenReserves: data.readBigUInt64LE(
      PUMP_CURVE_STATE_OFFSETS.REAL_TOKEN_RESERVES,
    ),
    realSolReserves: data.readBigUInt64LE(
      PUMP_CURVE_STATE_OFFSETS.REAL_SOL_RESERVES,
    ),
    tokenTotalSupply: data.readBigUInt64LE(
      PUMP_CURVE_STATE_OFFSETS.TOKEN_TOTAL_SUPPLY,
    ),
    complete: data[PUMP_CURVE_STATE_OFFSETS.COMPLETE] === 1,
  };

  console.log("Pump curve state:", {
    ...state,
    virtualTokenReserves: state.virtualTokenReserves.toString(),
    virtualSolReserves: state.virtualSolReserves.toString(),
    realTokenReserves: state.realTokenReserves.toString(),
    realSolReserves: state.realSolReserves.toString(),
    tokenTotalSupply: state.tokenTotalSupply.toString(),
  });

  return state;
}

export async function getPumpFunTokenPrice(
  connection: Connection,
  mintAddress: string,
): Promise<TokenPriceResponse> {
  console.log(`Getting pump fun token price for mint: ${mintAddress}`);

  const tokenData = await fetchPumpFunTokenData(mintAddress);
  const curveAddress = findPumpCurveAddress(new PublicKey(mintAddress));

  let priceSOL = 0;
  try {
    // Get price from smart contract regardless of Raydium status
    const curveState = await getPumpCurveState(connection, curveAddress);
    priceSOL = calculatePumpCurvePrice(
      curveState.virtualSolReserves,
      curveState.virtualTokenReserves,
    );

    console.log("Smart contract price calculation:", {
      virtualSolReserves: curveState.virtualSolReserves.toString(),
      virtualTokenReserves: curveState.virtualTokenReserves.toString(),
      calculatedPrice: priceSOL,
      isRaydiumPool: !!tokenData.raydium_pool,
      marketCap: tokenData.market_cap,
      usdMarketCap: tokenData.usd_market_cap,
    });
  } catch (err) {
    const error = err as Error;
    console.log(
      "Failed to calculate price from smart contract:",
      error?.message || "Unknown error",
    );
  }

  return {
    priceSOL,
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
}

export { getPumpCurveState };
