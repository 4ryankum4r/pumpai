import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function WelcomePage({ onLogin }: { onLogin: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen w-screen relative overflow-hidden bg-background">
      {/* Decorative Elements */}
      <div className="fixed top-[20%] -left-8 w-16 h-16 border border-border rotate-45 opacity-30 pointer-events-none" />
      <div className="fixed top-[40%] -right-10 w-20 h-20 border border-border rounded-full opacity-30 pointer-events-none" />
      <div className="fixed bottom-[30%] -left-6 w-12 h-12 border border-border transform rotate-12 opacity-30 pointer-events-none" />
      <div className="fixed bottom-[20%] -right-8 w-16 h-16 border border-border transform -rotate-12 opacity-30 pointer-events-none" />
      <div className="fixed top-[60%] -left-12 w-24 h-24 border border-border rounded-full opacity-30 pointer-events-none" />
      <div className="fixed top-[80%] -right-10 w-20 h-20 border border-border rotate-45 opacity-30 pointer-events-none" />

      {/* Side Borders */}
      {/* Removing the outer border container div */}
      {/* Full Width Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <div className="border-b border-border">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto border-x border-border">
              <nav className="flex items-center justify-center h-12">
                <div className="w-full h-full flex items-center justify-between px-4">
                  <div className="flex items-center gap-8">
                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                      <Link
                        href="#how"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        [how it works]
                      </Link>
                      <Link
                        href="#features"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        [features]
                      </Link>
                      <Link
                        href="#x"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        [x]
                      </Link>
                      <Link
                        href="#telegram"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        [telegram]
                      </Link>
                    </div>
                  </div>

                  {/* Desktop Right Side */}
                  <div className="hidden md:flex items-center gap-4">
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none"
                    >
                      [buy on Ray]
                    </Link>
                    <button
                      onClick={onLogin}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      [login with privy]
                    </button>
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={toggleMenu}
                    className="md:hidden text-foreground hover:text-foreground/80 transition-colors"
                  >
                    {isMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          fixed inset-0 bg-background/95 backdrop-blur-sm md:hidden transition-transform duration-300 ease-in-out z-50
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col items-center justify-center gap-6
        `}
      >
        <Link
          href="#how"
          className="text-lg text-muted-foreground hover:text-foreground transition-colors"
          onClick={toggleMenu}
        >
          [how it works]
        </Link>
        <Link
          href="#features"
          className="text-lg text-muted-foreground hover:text-foreground transition-colors"
          onClick={toggleMenu}
        >
          [features]
        </Link>
        <Link
          href="#x"
          className="text-lg text-muted-foreground hover:text-foreground transition-colors"
          onClick={toggleMenu}
        >
          [x]
        </Link>
        <Link
          href="#telegram"
          className="text-lg text-muted-foreground hover:text-foreground transition-colors"
          onClick={toggleMenu}
        >
          [telegram]
        </Link>
        <Link
          href="#buy"
          className="text-lg text-muted-foreground hover:text-foreground transition-colors"
          onClick={toggleMenu}
        >
          [buy on Ray]
        </Link>
        <Button
          onClick={() => {
            setIsMenuOpen(false);
            onLogin();
          }}
          variant="outline"
          className="border-border hover:bg-background/40 text-foreground"
        >
          [login with privy]
        </Button>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-0 pt-12">
        <div className="max-w-5xl mx-auto border-x border-border">
          {/* Hero Section */}
          <div className="w-full border-b border-border">
            <div className="px-6 py-16">
              <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">
                {/* Left Column - Text and Buttons */}
                <div className="flex flex-col items-center lg:items-start gap-8 lg:max-w-2xl">
                  {/* Subtitle */}
                  <div className="text-muted-foreground text-sm flex items-center gap-3">
                    <span className="w-16 h-[2px] bg-[#50CD8C]" />
                    <span>The AI Chatbot For Pump.fun</span>
                  </div>

                  {/* Main Heading */}
                  <div className="relative">
                    <h1 className="text-5xl md:text-6xl text-foreground lg:text-left text-center leading-tight">
                      <span className="relative inline-block">
                        Buy, sell, or check
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                          }}
                          className="absolute -bottom-1 left-0 right-0 h-[4px] bg-[#50CD8C] origin-left rounded-full"
                        />
                      </span>
                      <br />
                      on Pump using
                      <br />
                      natural language
                    </h1>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 w-full lg:w-auto">
                    <span
                      className="text-foreground hover:text-foreground/80 cursor-pointer"
                      onClick={onLogin}
                    >
                      [login to start]
                    </span>
                  </div>
                </div>

                {/* Right Column - Chat SVG */}
                <div className="lg:flex-1 w-full lg:w-auto flex justify-center lg:justify-end">
                  <Image
                    src="/landing/chat.svg"
                    alt="Chat Interface"
                    width={500}
                    height={319}
                    className="w-full max-w-[500px] h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features Section - Item 1 */}
          <div className="w-full border-b border-border">
            <div className="px-6 py-16" id="features">
              <h2 className="text-3xl font-semibold mb-12 text-center">
                Features
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="p-6 rounded-lg border border-border bg-background/50">
                  <h3 className="text-xl font-medium text-foreground mb-4">
                    Token Analysis
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Check bonding curve progress and status
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Analyze trading bundles and patterns
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Get real-time token prices and data
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg border border-border bg-background/50">
                  <h3 className="text-xl font-medium text-foreground mb-4">
                    Trading Actions
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Launch new tokens on Pump.fun
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Swap tokens via Jupiter Exchange
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Manage token balances and accounts
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* How it Works Section */}
          <div className="w-full border-b border-border">
            <div className="px-6 py-16" id="how">
              <h2 className="text-3xl font-semibold mb-12 text-center">
                How It Works
              </h2>
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-lg border border-border bg-background/50">
                    <div className="text-2xl font-semibold text-primary mb-4">
                      01
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Login with Privy
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get started instantly with embedded wallet - no external
                      wallet needed
                    </p>
                  </div>
                  <div className="p-6 rounded-lg border border-border bg-background/50">
                    <div className="text-2xl font-semibold text-primary mb-4">
                      02
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Chat Naturally
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ask questions or give commands in natural language -
                      PumpAI understands you
                    </p>
                  </div>
                  <div className="p-6 rounded-lg border border-border bg-background/50">
                    <div className="text-2xl font-semibold text-primary mb-4">
                      03
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Execute Actions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Review and confirm actions - PumpAI handles everything
                      securely
                    </p>
                  </div>
                </div>

                <div className="mt-12 p-6 rounded-lg border border-border bg-background/50">
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    Example Commands
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div className="p-2 rounded bg-muted/30">
                      &ldquo;Check the bonding curve progress for [token]&rdquo;
                    </div>
                    <div className="p-2 rounded bg-muted/30">
                      &ldquo;What&apos;s the current price of [token]?&rdquo;
                    </div>
                    <div className="p-2 rounded bg-muted/30">
                      &ldquo;Analyze trading bundles for [token]&rdquo;
                    </div>
                    <div className="p-2 rounded bg-muted/30">
                      &ldquo;Swap 1 SOL to USDC&rdquo;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid - Item 2 */}
          <div className="w-full">
            <div className="px-6 py-8">
              <div className="grid md:grid-cols-2 gap-4 w-full">
                {/* Speed Feature */}
                <div className="p-6 rounded-lg border border-border bg-background/50">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/landing/meter.svg"
                        alt="Speed Meter"
                        width={24}
                        height={24}
                        className="text-primary"
                      />
                      <h3 className="font-semibold">
                        Pump AI is fast, like{" "}
                        <span className="text-primary">really</span> fast
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pump AI talks to Pump.fun through private API and own
                      smart contracts which makes it way faster than Pump.fun
                      interface.
                    </p>
                  </div>
                </div>

                {/* Ease Feature */}
                <div className="p-6 rounded-lg border border-border bg-background/50">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/landing/tick-filled.svg"
                        alt="Tick"
                        width={24}
                        height={24}
                        className="text-primary"
                      />
                      <h3 className="font-semibold">
                        Pump AI as easy to use as ChatGPT
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pump AI doesn&apos;t need specific keywords or template
                      based prompts to be able to understand user intent. Talk
                      to it like you would talk to ChatGPT.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example Queries - Item 3 */}
          <div className="w-full">
            <div className="px-6 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-base text-foreground w-full">
                <div className="flex justify-start">
                  [how much SOL do I have left?]
                </div>
                <div className="flex justify-center">
                  [did fartcoin hit raydium yet?]
                </div>
                <div className="flex justify-end">
                  [what&apos;s fartcoin mc atm?]
                </div>
                <div className="flex justify-start">
                  [buy 1 sol worth of pnut coin]
                </div>
                <div className="flex justify-center">
                  [sell half of my pnut bag]
                </div>
                <div className="flex justify-end">
                  [how many holders pnut have?]
                </div>
                <div className="flex justify-start">
                  [where else is pnut traded besides raydium?]
                </div>
                <div className="flex justify-center">
                  [give me fartcoin website link]
                </div>
                <div className="flex justify-end">
                  [hot coins launched in the last hour]
                </div>
                <div className="flex justify-start">
                  [how fast did maga coin fill their bonding curve?]
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="w-full border-t border-border">
            <div className="px-6 py-12 flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-6">
                <Link
                  href="#telegram"
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.227-.535.227l.19-2.955 5.385-4.875c.235-.235-.052-.348-.364-.152l-6.648 4.175-2.803-.874c-.606-.204-.615-.615.126-.91l10.935-4.226c.505-.204.95.123.784.9z" />
                  </svg>
                </Link>
                <Link
                  href="#x"
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
                <Link
                  href="#discord"
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                © 2025 Pump AI. Chatbot that can make or lose you money.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
