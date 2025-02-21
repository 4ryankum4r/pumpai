import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Twitter, MessageCircle } from "lucide-react";
import type { BondingCurveResponse } from "@repo/pumpai-agent";
import Image from "next/image";

interface BondingCurveSuccessProps {
  data: BondingCurveResponse;
}

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) return "0 SOL";
  const fullPrecision = price.toFixed(20).replace(/\.?0+$/, "");
  const [whole, decimal] = fullPrecision.split(".");
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formattedPrice = decimal
    ? `${formattedWhole}.${decimal}`
    : formattedWhole;
  return `${formattedPrice} SOL`;
}

function formatProgress(progress: number | null | undefined): string {
  if (progress === null || progress === undefined) return "0%";
  return `${(progress * 100).toFixed(2)}%`;
}

function formatMarketCap(marketCap: number | undefined): string {
  if (!marketCap) return "N/A";
  return marketCap.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function BondingCurveSuccess({ data }: BondingCurveSuccessProps) {
  if (!data) return null;

  return (
    <Card className="bg-gradient-to-br from-background to-background border-border">
      <CardContent className="pt-6 space-y-6">
        {/* Token Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            {data.imageUri ? (
              <Image
                src={data.imageUri}
                alt={data.name || "Token Logo"}
                width={40}
                height={40}
                className="rounded-lg"
              />
            ) : (
              <Image
                src="/tools/pump-fun.svg"
                alt="Pump.fun Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium flex items-center gap-2">
              [{data.name || "Token"}] [{data.symbol}]
              {data.isRaydiumPool && (
                <span className="text-xs bg-accent/50 px-2 py-0.5 rounded-full">
                  [raydium]
                </span>
              )}
            </h3>
            {data.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                [{data.description}]
              </p>
            )}
          </div>
        </div>

        {/* Token Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">[price]</span>
            <span>{formatPrice(data.priceSOL)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">[market cap]</span>
            <span>{formatMarketCap(data.usdMarketCap)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">[bonding progress]</span>
            <span>{formatProgress(data.bondingProgress)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">[status]</span>
            <span>
              {data.isRaydiumPool
                ? "[raydium]"
                : data.complete
                  ? "[complete]"
                  : "[active]"}
            </span>
          </div>
        </div>

        {/* Contract Info */}
        <div className="space-y-2 text-xs">
          <div className="text-muted-foreground">[contract info]</div>
          <div className="space-y-1.5">
            <code className="block w-full bg-accent/10 px-3 py-2 rounded break-all">
              [mint: {data.mint}]
            </code>
            <code className="block w-full bg-accent/10 px-3 py-2 rounded break-all">
              [curve: {data.curveAddress}]
            </code>
            {data.raydiumPoolAddress && (
              <code className="block w-full bg-accent/10 px-3 py-2 rounded break-all">
                [pool: {data.raydiumPoolAddress}]
              </code>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1 text-sm hover:bg-accent/50 transition-colors"
            onClick={() =>
              window.open(`https://pump.fun/coin/${data.mint}`, "_blank")
            }
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            [view on pump.fun]
          </Button>
          {data.twitter && (
            <Button
              variant="outline"
              className="flex-1 text-sm hover:bg-accent/50 transition-colors"
              onClick={() => window.open(data.twitter, "_blank")}
            >
              <Twitter className="w-4 h-4 mr-2" />
              [twitter]
            </Button>
          )}
          {data.telegram && (
            <Button
              variant="outline"
              className="flex-1 text-sm hover:bg-accent/50 transition-colors"
              onClick={() => window.open(data.telegram, "_blank")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              [telegram]
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
