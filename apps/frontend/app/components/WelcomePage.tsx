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
                      href="#buy"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      [buy on Ray]
                    </Link>
                    <button
                      onClick={onLogin}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      [login to chat]
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
          [connect wallet]
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
                      [go to chat]
                    </span>
                    <a
                      href="https://github.com/your-repo"
                      className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
                    >
                      [
                      <Image
                        src="/landing/github.svg"
                        alt="GitHub"
                        width={20}
                        height={20}
                        className="h-5 w-5 text-foreground"
                      />
                      Open on GitHub ]
                    </a>
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
          <div className="w-full">
            <div className="px-6 py-8">
              <h2 className="text-3xl max-w-[50%]">
                Interact with Pump <span className="text-primary">faster</span>{" "}
                and <span className="text-primary">easier</span> than ever
                before
              </h2>
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
                  href="https://github.com/aryan877"
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="h-6 w-6"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.00745 0C4.02656 0 0 4.05625 0 9.07437C0 13.0856 2.57996 16.4811 6.15904 17.6828C6.60652 17.7732 6.77043 17.4876 6.77043 17.2473C6.77043 17.037 6.75568 16.3159 6.75568 15.5646C4.25002 16.1055 3.72824 14.4828 3.72824 14.4828C3.32557 13.4312 2.72893 13.1609 2.72893 13.1609C1.90883 12.605 2.78867 12.605 2.78867 12.605C3.69837 12.6651 4.17572 13.5364 4.17572 13.5364C4.98089 14.9185 6.27833 14.528 6.8003 14.2876C6.87478 13.7016 7.11355 13.296 7.36706 13.0707C5.36863 12.8603 3.26602 12.0791 3.26602 8.59353C3.26602 7.60196 3.6237 6.79071 4.19047 6.15978C4.10105 5.93447 3.7878 5.00283 4.28008 3.7559C4.28008 3.7559 5.04062 3.51547 6.75549 4.68736C7.48969 4.48873 8.24686 4.38768 9.00745 4.38683C9.76799 4.38683 10.5433 4.49211 11.2592 4.68736C12.9743 3.51547 13.7348 3.7559 13.7348 3.7559C14.2271 5.00283 13.9137 5.93447 13.8242 6.15978C14.4059 6.79071 14.7489 7.60196 14.7489 8.59353C14.7489 12.0791 12.6463 12.8452 10.6329 13.0707C10.9611 13.3561 11.2443 13.8969 11.2443 14.7533C11.2443 15.9702 11.2295 16.9468 11.2295 17.2472C11.2295 17.4876 11.3936 17.7732 11.8409 17.683C15.42 16.4809 18 13.0856 18 9.07437C18.0147 4.05625 13.9734 0 9.00745 0Z"
                      fill="currentColor"
                    />
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
