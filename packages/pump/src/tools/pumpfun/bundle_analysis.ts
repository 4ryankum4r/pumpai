import axios, { AxiosResponse } from "axios";
import {
  BundleAnalysisResponse,
  PumpFunTrade,
  WalletSummary,
} from "../../types/index.js";

const BASE_URL = "https://frontend-api.pump.fun";
const TOTAL_SUPPLY = 1_000_000_000_000_000; // 1 billion with 6 decimals

async function getAllTrades(mint: string): Promise<PumpFunTrade[]> {
  try {
    const countResponse: AxiosResponse<number> = await axios.get(
      `${BASE_URL}/trades/count/${mint}?minimumSize=0`,
    );
    const totalTrades = countResponse.data;

    let allTrades: PumpFunTrade[] = [];
    const limit = 200;
    const totalCalls = Math.ceil(totalTrades / limit);

    const promises: Promise<AxiosResponse<PumpFunTrade[]>>[] = [];
    for (let i = 0; i < totalCalls; i++) {
      const offset = i * limit;
      promises.push(
        axios.get<PumpFunTrade[]>(
          `${BASE_URL}/trades/all/${mint}?limit=${limit}&offset=${offset}&minimumSize=0`,
        ),
      );
    }

    const responses: AxiosResponse<PumpFunTrade[]>[] =
      await Promise.all(promises);
    allTrades = responses.flatMap((response) => response.data);

    return allTrades;
  } catch (error: any) {
    console.error("Error fetching trades:", error);
    throw error;
  }
}

function analyzeWallets(
  allTrades: PumpFunTrade[],
  bundleTrades: PumpFunTrade[],
): Record<string, WalletSummary> {
  const walletSummary: Record<string, WalletSummary> = {};
  const wallets = new Set(bundleTrades.map((t) => t.user));

  wallets.forEach((wallet) => {
    const walletTrades = allTrades.filter((t) => t.user === wallet);
    let currentBalance = 0;
    let totalBought = 0;
    let totalSold = 0;
    let username: string | undefined = undefined;

    walletTrades.forEach((trade) => {
      if (trade.username) username = trade.username;
      if (trade.is_buy) {
        currentBalance += trade.token_amount;
        totalBought += trade.token_amount;
      } else {
        currentBalance -= trade.token_amount;
        totalSold += trade.token_amount;
      }
    });

    walletSummary[wallet] = {
      currentBalance: Math.max(0, currentBalance),
      totalBought,
      totalSold,
      username: username,
    };
  });

  return walletSummary;
}

function analyzeHolding(
  allTrades: PumpFunTrade[],
  bundleTrades: PumpFunTrade[],
) {
  let holdingAmount = 0;
  const wallets = new Set(bundleTrades.map((t) => t.user));

  wallets.forEach((wallet) => {
    const walletTrades = allTrades.filter((t) => t.user === wallet);
    let balance = 0;

    walletTrades.forEach((trade) => {
      if (trade.is_buy) {
        balance += trade.token_amount;
      } else {
        balance -= trade.token_amount;
      }
    });

    holdingAmount += Math.max(0, balance);
  });

  return {
    holdingAmount,
    holdingPercentage: holdingAmount,
  };
}

function categorizeBundle(trades: PumpFunTrade[]): string {
  const buyRatio = trades.filter((t) => t.is_buy).length / trades.length;

  if (buyRatio === 1) return "🎯 Snipers";
  if (buyRatio > 0.7) return "✅ Regular Buyers";
  if (buyRatio < 0.3) return "📉 Sellers";
  return "🔄 Mixed Activity";
}

export async function analyzePumpFunBundles(
  mint: string,
): Promise<BundleAnalysisResponse> {
  try {
    const trades = await getAllTrades(mint);

    // Group trades by slot
    const tradesBySlot: Record<number, PumpFunTrade[]> = {};
    trades.forEach((trade) => {
      if (!tradesBySlot[trade.slot]) {
        tradesBySlot[trade.slot] = [];
      }
      if (tradesBySlot[trade.slot]) {
        tradesBySlot[trade.slot]!.push(trade);
      }
    });

    // Analyze each slot for potential bundles
    const bundles = Object.entries(tradesBySlot)
      .filter(([_slot, slotTrades]) => slotTrades.length >= 2)
      .map(([slot, slotTrades]) => {
        const uniqueWallets = new Set(slotTrades.map((t) => t.user)).size;
        const totalTokenAmount = slotTrades.reduce(
          (sum, t) => sum + t.token_amount,
          0,
        );
        const totalSolAmount = slotTrades.reduce(
          (sum, t) => sum + t.sol_amount,
          0,
        );

        const holdingAnalysis = analyzeHolding(trades, slotTrades);
        const walletSummaries = analyzeWallets(trades, slotTrades);

        return {
          slot: parseInt(slot),
          uniqueWallets,
          trades: slotTrades,
          totalTokenAmount,
          totalSolAmount: totalSolAmount / 1e9, // Convert to SOL (9 decimals)
          supplyPercentage: ((totalTokenAmount / TOTAL_SUPPLY) * 100).toFixed(
            4,
          ),
          holdingAmount: holdingAnalysis.holdingAmount,
          holdingPercentage: (
            (holdingAnalysis.holdingAmount / TOTAL_SUPPLY) *
            100
          ).toFixed(4),
          category: categorizeBundle(slotTrades),
          walletSummaries,
        };
      })
      .sort((a, b) => b.totalSolAmount - a.totalSolAmount);

    return {
      mint,
      totalTrades: trades.length,
      bundles,
    };
  } catch (error: any) {
    throw error;
  }
}
