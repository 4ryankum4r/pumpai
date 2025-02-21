import { Button } from "@/components/ui/button";
import { Menu, Wallet, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "../hooks/wallet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogoutClick: () => void;
}

function WalletButton() {
  const router = useRouter();
  const { wallet, walletAddress, balance, isLoadingBalance } = useWallet();

  if (!wallet || !walletAddress) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => router.push("/wallet")}
          variant="ghost"
          className="h-8 px-3 text-sm gap-2 text-muted-foreground hover:text-foreground group"
        >
          <Wallet className="h-4 w-4 opacity-70 group-hover:opacity-100" />
          <span className="hidden sm:inline">
            {isLoadingBalance ? "..." : `${balance?.toFixed(3) || "0"} SOL`}
          </span>
          <span className="hidden sm:inline text-muted-foreground/70">|</span>
          <span className="text-xs text-muted-foreground/70">
            {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Manage Wallet</TooltipContent>
    </Tooltip>
  );
}

export default function Navbar({
  onToggleSidebar,
  onLogoutClick,
}: NavbarProps) {
  return (
    <div className="h-12 border-b border-border bg-background">
      <nav className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onToggleSidebar}
            className="md:hidden text-muted-foreground hover:text-foreground h-8 w-8 p-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent/50"
            >
              [how it works]
            </Link>
            <Link
              href="/features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent/50"
            >
              [features]
            </Link>
            <Link
              href="#x"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent/50"
            >
              [x]
            </Link>
            <Link
              href="#telegram"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent/50"
            >
              [telegram]
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <WalletButton />
          <Button
            variant="ghost"
            onClick={onLogoutClick}
            className="h-8 px-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">[logout]</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
