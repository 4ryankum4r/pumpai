import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Features
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover what PumpAI can do for you
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8">
            {/* Token Analysis Section */}
            <div className="p-8 rounded-lg border border-border bg-background/50">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Token Analysis
              </h2>
              <div className="grid gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-foreground">
                    Bonding Curve Analysis
                  </h3>
                  <p className="text-muted-foreground">
                    Track bonding curve progress, current price, and completion
                    status of any token on Pump.fun.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-foreground">
                    Bundle Analysis
                  </h3>
                  <p className="text-muted-foreground">
                    Analyze trading bundles, patterns, and holder behavior to
                    make informed decisions.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-foreground">
                    Price Tracking
                  </h3>
                  <p className="text-muted-foreground">
                    Get real-time token prices and market data from multiple
                    sources including Jupiter.
                  </p>
                </div>
              </div>
            </div>

            {/* Trading Actions Section */}
            <div className="p-8 rounded-lg border border-border bg-background/50">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Trading Actions
              </h2>
              <div className="grid gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-foreground">
                    Token Launch
                  </h3>
                  <p className="text-muted-foreground">
                    Launch new tokens on Pump.fun with customizable metadata and
                    initial liquidity settings.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-foreground">
                    Token Swaps
                  </h3>
                  <p className="text-muted-foreground">
                    Execute token swaps through Jupiter Exchange with optimal
                    routing and pricing.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-foreground">
                    Wallet Management
                  </h3>
                  <p className="text-muted-foreground">
                    Check balances, manage token accounts, and execute trades
                    all through natural language commands.
                  </p>
                </div>
              </div>
            </div>

            {/* Example Commands Section */}
            <div className="p-8 rounded-lg border border-border bg-background/50">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Example Commands
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 rounded bg-muted/30 text-muted-foreground">
                  &ldquo;Check bonding curve for TOKEN&rdquo;
                </div>
                <div className="p-3 rounded bg-muted/30 text-muted-foreground">
                  &ldquo;Show me trading bundles for TOKEN&rdquo;
                </div>
                <div className="p-3 rounded bg-muted/30 text-muted-foreground">
                  &ldquo;What&apos;s the current price of TOKEN?&rdquo;
                </div>
                <div className="p-3 rounded bg-muted/30 text-muted-foreground">
                  &ldquo;Launch a new token with 0.1 SOL liquidity&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Link href="/">
              <Button
                variant="outline"
                className="text-muted-foreground hover:text-foreground"
              >
                [back to chat]
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
