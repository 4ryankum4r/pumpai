import { Card, CardContent } from "@/components/ui/card";
import { TokenBalancesResponse } from "@repo/pumpai-agent";
import { CopyAddress } from "../../CopyAddress";

interface TokenBalancesSuccessProps {
  data: TokenBalancesResponse;
}

export function TokenBalancesSuccess({ data }: TokenBalancesSuccessProps) {
  return (
    <Card className="bg-gradient-to-br from-background to-background border-border">
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-base font-medium">[token balances]</h3>
          <p className="text-sm text-muted-foreground">[sol: {data.sol} SOL]</p>
        </div>

        <div className="space-y-2">
          {data.tokens.map((token) => (
            <div
              key={token.tokenAddress}
              className="p-3 bg-accent/10 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    [{token.name || token.symbol}]
                  </div>
                  <div className="text-sm text-muted-foreground">
                    [{token.balance} {token.symbol}]
                  </div>
                </div>
              </div>
              <div className="w-full text-xs">
                <CopyAddress
                  address={token.tokenAddress}
                  explorerUrl={`https://solscan.io/token/${token.tokenAddress}`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
