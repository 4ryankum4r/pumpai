import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PumpFunTokenData } from "../../types/index.js";

// Constants
export const PUMP_PROGRAM_ID = new PublicKey(
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
);
export const PUMP_CURVE_SEED = Buffer.from("bonding-curve");
export const PUMP_CURVE_TOKEN_DECIMALS = 6;
export const PUMP_CURVE_STATE_SIGNATURE = new Uint8Array([
  0x17, 0xb7, 0xf8, 0x37, 0x60, 0xd8, 0xac, 0x60,
]);
export const INITIAL_REAL_TOKEN_RESERVES = 793100000000000n;

// Utility functions
export function findPumpCurveAddress(tokenMint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [PUMP_CURVE_SEED, tokenMint.toBuffer()],
    PUMP_PROGRAM_ID,
  )[0];
}

export async function fetchPumpFunTokenData(
  mintAddress: string,
): Promise<PumpFunTokenData> {
  const response = await fetch(
    `https://frontend-api.pump.fun/coins/${mintAddress}?sync=true`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch token data: ${response.statusText}`);
  }
  return response.json();
}

export function calculatePumpCurvePrice(
  virtualSolReserves: bigint,
  virtualTokenReserves: bigint,
): number {
  if (
    !virtualSolReserves ||
    !virtualTokenReserves ||
    virtualSolReserves <= 0n ||
    virtualTokenReserves <= 0n
  ) {
    throw new RangeError("Invalid reserve data");
  }

  // Use BigInt for all calculations with 12 extra decimal places of precision
  const EXTRA_PRECISION = 12;
  const PRECISION_MULTIPLIER = 10n ** BigInt(EXTRA_PRECISION);

  // Calculate with extra precision: (solReserves * 10^(TOKEN_DECIMALS + EXTRA_PRECISION)) / (LAMPORTS_PER_SOL * tokenReserves)
  const numerator =
    virtualSolReserves *
    10n ** BigInt(PUMP_CURVE_TOKEN_DECIMALS) *
    PRECISION_MULTIPLIER;
  const denominator = BigInt(LAMPORTS_PER_SOL) * virtualTokenReserves;

  // Convert back to number with the extra precision preserved
  return Number(numerator / denominator) / Number(PRECISION_MULTIPLIER);
}

export function calculateBondingProgress(virtualTokenReserves: bigint): number {
  if (virtualTokenReserves >= INITIAL_REAL_TOKEN_RESERVES) {
    return 0;
  }
  return (
    1 -
    Number(virtualTokenReserves * 10000n) /
      Number(INITIAL_REAL_TOKEN_RESERVES) /
      10000
  );
}

// Corrected bonding progress calculation
export function calculateBondingProgressWithRealReserves(
  realTokenReserves: bigint,
): number {
  if (realTokenReserves >= INITIAL_REAL_TOKEN_RESERVES) {
    return 0; // If real reserves are greater or equal, progress is 0%
  }
  // Use scaled division for better precision
  return (
    1 -
    Number(realTokenReserves * 10000n) /
      Number(INITIAL_REAL_TOKEN_RESERVES) /
      10000
  );
}
