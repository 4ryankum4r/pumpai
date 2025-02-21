import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ExternalLink, Twitter, MessageCircle } from "lucide-react";
import type { TokenPriceResponse } from "@repo/pumpai-agent";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface TokenPriceSuccessProps {
  data: TokenPriceResponse;
}

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) return "0 SOL";

  // Convert to string with maximum precision
  const fullPrecision = price.toFixed(20).replace(/\.?0+$/, "");

  // Split into whole and decimal parts
  const [whole, decimal] = fullPrecision.split(".");

  // Format whole number part with commas
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // If there's a decimal part, combine them
  const formattedPrice = decimal
    ? `${formattedWhole}.${decimal}`
    : formattedWhole;

  return `${formattedPrice} SOL`;
}

function formatMarketCap(marketCap: number | undefined): string {
  if (!marketCap) return "N/A";
  return marketCap.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function TokenPriceSuccess({ data }: TokenPriceSuccessProps) {
  if (!data) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-blue-500/10 to-background">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0 flex items-center">
            {data.imageUri ? (
              <Image
                src={data.imageUri}
                alt={data.name || "Token Logo"}
                width={44}
                height={44}
                className="rounded-lg"
              />
            ) : (
              <Image
                src="/tools/pump-fun.svg"
                alt="Pump.fun Logo"
                width={44}
                height={44}
                className="rounded-lg"
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-500 flex items-center gap-2">
              {data.name || "Token"} ({data.symbol})
              {data.isRaydiumPool && (
                <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">
                  Raydium
                </span>
              )}
            </h3>
            {data.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {data.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5">
        <InfoItem label="Token Price" value={formatPrice(data.priceSOL)} />
        <InfoItem
          label="Market Cap"
          value={formatMarketCap(data.usdMarketCap)}
        />
        <InfoItem label="Token Mint" value={data.mint} isCode />
        <InfoItem label="Curve Address" value={data.curveAddress} isCode />
        {data.raydiumPoolAddress && (
          <InfoItem
            label="Raydium Pool"
            value={data.raydiumPoolAddress}
            isCode
          />
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          className="w-full text-sm hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
          onClick={() =>
            window.open(`https://pump.fun/coin/${data.mint}`, "_blank")
          }
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Pump.fun
        </Button>
        {data.twitter && (
          <Button
            variant="outline"
            className="w-full text-sm hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
            onClick={() => window.open(data.twitter, "_blank")}
          >
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </Button>
        )}
        {data.telegram && (
          <Button
            variant="outline"
            className="w-full text-sm hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
            onClick={() => window.open(data.telegram, "_blank")}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Telegram
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  isCode?: boolean;
  link?: string;
}

function InfoItem({ label, value, isCode, link }: InfoItemProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors gap-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-primary hover:underline text-sm break-all"
        >
          {value}
          <ExternalLink className="w-4 h-4" />
        </a>
      ) : isCode ? (
        <code className="bg-background/80 px-3 py-1.5 rounded text-sm break-all font-mono">
          {value}
        </code>
      ) : (
        <span className="text-sm break-all font-medium">{value}</span>
      )}
    </div>
  );
}
