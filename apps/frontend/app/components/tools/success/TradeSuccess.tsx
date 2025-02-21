import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, AlertCircle } from "lucide-react";
import { JupiterSwapResponse } from "@repo/pumpai-agent";

interface TradeSuccessProps {
  data: JupiterSwapResponse;
}

function formatTokenAmount(amount: number, symbol: string): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M ${symbol}`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K ${symbol}`;
  }
  return `${amount.toFixed(amount < 0.01 ? 6 : 2)} ${symbol}`;
}

export function TradeSuccess({ data }: TradeSuccessProps) {
  if (!data) return null;

  const inputSymbol =
    data.inputToken === "So11111111111111111111111111111111111111112"
      ? "SOL"
      : data.inputToken;
  const outputSymbol =
    data.outputToken === "So11111111111111111111111111111111111111112"
      ? "SOL"
      : data.outputToken;

  const isError = data.status === "error" || !data.transaction;

  return (
    <Card className="bg-gradient-to-br from-background to-background border-border">
      <CardContent className="pt-6 space-y-6">
        {/* Trade Summary */}
        <div className="space-y-2">
          <h3 className="text-base font-medium">
            {isError ? "[trade failed]" : "[trade executed]"}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              [{formatTokenAmount(data.inputAmount, inputSymbol)}]
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">[{outputSymbol}]</span>
          </div>
        </div>

        {/* Status/Error Message */}
        {(data.status || data.message || data.error) && (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">[status]</div>
            <div className="text-sm space-y-1">
              {isError && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>[error]</span>
                </div>
              )}
              {data.message && (
                <div className="text-muted-foreground">[{data.message}]</div>
              )}
              {data.error?.message && (
                <div className="text-red-500">[{data.error.message}]</div>
              )}
            </div>
          </div>
        )}

        {/* Transaction */}
        {data.transaction && (
          <>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">[transaction]</div>
              <code className="block w-full bg-accent/10 px-3 py-2 rounded text-xs font-mono break-all">
                {data.transaction}
              </code>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1 text-sm hover:bg-accent/50 transition-colors"
                onClick={() =>
                  window.open(
                    `https://solscan.io/tx/${data.transaction}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                [view on solscan]
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
