import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              How It Works
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn how to interact with PumpAI and make the most of its
              features
            </p>
          </div>

          {/* Steps Section */}
          <div className="grid gap-8 mb-16">
            <div className="p-8 rounded-lg border border-border bg-background/50">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary">01</div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Login with Privy
                  </h3>
                  <p className="text-muted-foreground">
                    Get started instantly with Privy&apos;s embedded wallet - no
                    external wallet needed. Your wallet is created and secured
                    automatically.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary">02</div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Chat Naturally
                  </h3>
                  <p className="text-muted-foreground">
                    Simply type your questions or commands in natural language.
                    PumpAI understands context and can handle complex requests.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary">03</div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Execute Actions
                  </h3>
                  <p className="text-muted-foreground">
                    Review and confirm the suggested actions. PumpAI will
                    execute them securely through verified smart contracts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interaction Examples */}
          <div className="grid gap-8">
            <div className="p-8 rounded-lg border border-border bg-background/50">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Example Interactions
              </h2>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-foreground">
                    Token Analysis
                  </h3>
                  <div className="grid gap-3">
                    <div className="p-3 rounded bg-muted/30 text-muted-foreground">
                      You: &ldquo;How is the bonding curve doing for token
                      address:
                      GjSn1XHncttWZtx9u6JB9BNM3QYqiumXfGbtkm4ypump?&rdquo;
                    </div>
                    <div className="p-3 rounded bg-muted/30 text-muted-foreground">
                      PumpAI: &ldquo;The bonding curve for token GjSn1X...pump
                      is 75% complete with a current price of 0.001 SOL&rdquo;
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-foreground">
                    Trading
                  </h3>
                  <div className="grid gap-3">
                    <div className="p-3 rounded bg-muted/30 text-muted-foreground">
                      You: &ldquo;Check trading bundles for contract:
                      5BwXbPNGbfd2UuE8rkvASmJYXWXSiqmrhqJ1FX6rQnKd&rdquo;
                    </div>
                    <div className="p-3 rounded bg-muted/30 text-muted-foreground">
                      PumpAI: &ldquo;I found 3 trading bundles for token
                      5BwXb...nKd with a total of 150 trades. Would you like to
                      see the detailed analysis?&rdquo;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="p-8 rounded-lg border border-border bg-background/50">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Pro Tips
              </h2>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                  <p className="text-muted-foreground">
                    Use natural language - PumpAI understands context and can
                    handle complex requests
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                  <p className="text-muted-foreground">
                    Ask for analysis before making trades - PumpAI can provide
                    valuable insights
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                  <p className="text-muted-foreground">
                    Review transaction details carefully before confirming any
                    actions
                  </p>
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
