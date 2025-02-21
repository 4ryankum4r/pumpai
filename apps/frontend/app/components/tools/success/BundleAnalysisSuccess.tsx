import { Target, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import type { BundleAnalysisResponse } from "@repo/pumpai-agent";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface BundleAnalysisSuccessProps {
  data: BundleAnalysisResponse;
}

function formatAmount(amount: number, decimals: number = 6): string {
  const value = amount / Math.pow(10, decimals);
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface BundleTypeIconProps {
  category: string;
  buyRatio: number;
}

function BundleTypeIcon({ buyRatio }: BundleTypeIconProps) {
  if (buyRatio > 0.7) {
    return <TrendingUp className="w-4 h-4 text-green-500" />;
  }
  if (buyRatio < 0.3) {
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  }
  return <Target className="w-4 h-4 text-yellow-500" />;
}

export function BundleAnalysisSuccess({ data }: BundleAnalysisSuccessProps) {
  const [selectedBundle, setSelectedBundle] = useState(0);

  if (!data?.bundles || data.bundles.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-background to-background border-border">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            No trading bundles were detected.
          </p>
        </CardContent>
      </Card>
    );
  }

  const topBundles = data.bundles.slice(0, 5);
  const currentBundle = topBundles[selectedBundle];

  return (
    <Card className="bg-gradient-to-br from-background to-background border-border">
      <CardContent className="pt-6 space-y-6">
        {/* Disclaimer */}
        <div className="p-3 rounded-lg bg-card/5 border border-border/50">
          <p className="text-xs text-muted-foreground">
            Note: This analysis only includes trades from the bonding curve
            contract on Pump.fun. Post-graduation trading data is not included.
          </p>
        </div>

        {/* Bundle Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Top Bundles</h3>
            <span className="text-sm text-muted-foreground">
              {data.totalTrades} total trades
            </span>
          </div>

          {/* Bundle Navigation */}
          <div className="flex flex-col gap-2">
            {topBundles.map((bundle, index) => {
              const buyCount = bundle.trades.filter((t) => t.is_buy).length;
              const sellCount = bundle.trades.filter((t) => !t.is_buy).length;
              const buyRatio = buyCount / bundle.trades.length;

              return (
                <button
                  key={bundle.slot}
                  onClick={() => setSelectedBundle(index)}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    selectedBundle === index
                      ? "bg-primary/10 border-primary/50"
                      : "bg-card/5 border-border/50 hover:bg-card/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <BundleTypeIcon
                          category={bundle.category}
                          buyRatio={buyRatio}
                        />
                        <span className="text-sm font-medium">
                          {bundle.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-0.5 bg-background/50 rounded">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="text-xs font-medium text-green-500">
                            {buyCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span className="text-xs font-medium text-red-500">
                            {sellCount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{bundle.totalSolAmount.toFixed(1)} SOL</span>
                      <span className="text-muted-foreground">
                        {bundle.uniqueWallets} wallets
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bundle Details */}
        {currentBundle && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary">
                Bundle {selectedBundle + 1} Details
              </h2>
              <span className="text-sm text-muted-foreground">
                Slot {currentBundle.slot}
              </span>
            </div>

            {/* Token Flow */}
            <div className="rounded-lg border border-border/50 overflow-hidden bg-card/5">
              <div className="px-4 py-3 border-b border-border/50">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-sm font-medium">Token Flow</h3>
                    <span className="text-xs text-muted-foreground">
                      Supply Impact
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-green-500">Buys</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-500">
                      +
                      {formatAmount(
                        currentBundle.trades
                          .filter((t) => t.is_buy)
                          .reduce((sum, t) => sum + t.token_amount, 0)
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(
                        (currentBundle.trades
                          .filter((t) => t.is_buy)
                          .reduce((sum, t) => sum + t.token_amount, 0) /
                          1e15) *
                        100
                      ).toFixed(2)}
                      % of supply
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-red-500">Sells</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-500">
                      -
                      {formatAmount(
                        currentBundle.trades
                          .filter((t) => !t.is_buy)
                          .reduce((sum, t) => sum + t.token_amount, 0)
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(
                        (currentBundle.trades
                          .filter((t) => !t.is_buy)
                          .reduce((sum, t) => sum + t.token_amount, 0) /
                          1e15) *
                        100
                      ).toFixed(2)}
                      % of supply
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trade History */}
            <div className="rounded-lg border border-border/50 overflow-hidden bg-card/5">
              <div className="px-4 py-3 border-b border-border/50">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-sm font-medium">Trade History</h3>
                    <span className="text-xs text-muted-foreground">
                      {currentBundle.trades.length} transactions
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="px-4 py-2 border-b border-border/50">
                  <div className="grid grid-cols-[2fr,1fr,1fr,auto] gap-6">
                    <div className="text-xs font-medium text-muted-foreground">
                      Wallet
                    </div>
                    <div className="text-xs font-medium text-muted-foreground text-right">
                      Amount
                    </div>
                    <div className="text-xs font-medium text-muted-foreground text-right">
                      Value
                    </div>
                    <div className="text-xs font-medium text-muted-foreground text-right w-10">
                      View
                    </div>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
                  {currentBundle.trades.map((trade, index) => (
                    <div
                      key={`${trade.signature}-${index}`}
                      className="px-4 py-2 grid grid-cols-[2fr,1fr,1fr,auto] gap-6 items-center hover:bg-card/5 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-1.5 h-1.5 flex-shrink-0 rounded-full ${
                            trade.is_buy ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono text-xs truncate">
                            {trade.user.slice(0, 6)}...{trade.user.slice(-4)}
                          </span>
                          {trade.username && (
                            <span className="text-primary text-xs truncate hidden sm:inline">
                              @{trade.username}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-medium ${
                            trade.is_buy ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {trade.is_buy ? "+" : "-"}
                          {formatAmount(trade.token_amount)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium">
                          {(trade.sol_amount / 1e9).toFixed(2)} SOL
                        </span>
                      </div>
                      <div className="flex justify-end w-10">
                        <a
                          href={`https://solscan.io/tx/${trade.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-muted-foreground/60 hover:text-primary rounded-md hover:bg-primary/10 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wallet Positions */}
            <div className="rounded-lg border border-border/50 overflow-hidden bg-card/5">
              <div className="px-4 py-3 border-b border-border/50">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-sm font-medium">Wallet Positions</h3>
                    <span className="text-xs text-muted-foreground">
                      {Object.keys(currentBundle.walletSummaries).length}{" "}
                      wallets
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="px-4 py-2 border-b border-border/50">
                  <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-6">
                    <div className="text-xs font-medium text-muted-foreground">
                      Wallet
                    </div>
                    <div className="text-xs font-medium text-muted-foreground text-right">
                      Current Balance
                    </div>
                    <div className="text-xs font-medium text-muted-foreground text-right">
                      Total Bought
                    </div>
                    <div className="text-xs font-medium text-muted-foreground text-right">
                      Total Sold
                    </div>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
                  {Object.entries(currentBundle.walletSummaries).map(
                    ([wallet, summary], index) => (
                      <div
                        key={`${wallet}-${index}`}
                        className="px-4 py-2 grid grid-cols-[2fr,1fr,1fr,1fr] gap-6 items-center hover:bg-card/5 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-1.5 h-1.5 flex-shrink-0 rounded-full ${
                              summary.currentBalance > 0
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-mono text-xs truncate">
                              {wallet.slice(0, 6)}...{wallet.slice(-4)}
                            </span>
                            {summary.username && (
                              <span className="text-primary text-xs truncate hidden sm:inline">
                                @{summary.username}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-medium ${
                              summary.currentBalance > 0
                                ? "text-green-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatAmount(summary.currentBalance)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium text-green-500">
                            {formatAmount(summary.totalBought)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium text-red-500">
                            {formatAmount(summary.totalSold)}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
