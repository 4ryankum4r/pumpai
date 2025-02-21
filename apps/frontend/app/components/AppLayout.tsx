import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import Navbar from "./Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChatSidebarContainer from "./ChatSidebarContainer";
import Link from "next/link";

interface AppLayoutProps {
  children: React.ReactNode;
  threadId?: string | null;
  isAuthenticated?: boolean;
}

export default function AppLayout({
  children,
  threadId,
  isAuthenticated = false,
}: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const { logout } = usePrivy();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle drag to open/close sidebar
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setStartX(touch.clientX);
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const diff = touch.clientX - startX;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && !isSidebarOpen) {
          setIsSidebarOpen(true);
        } else if (diff < 0 && isSidebarOpen) {
          setIsSidebarOpen(false);
        }
        setIsDragging(false);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (window.innerWidth < 768) {
      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, isSidebarOpen, startX]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [threadId]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-screen relative overflow-hidden bg-background">
        {/* Full Width Navbar for non-authenticated state */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background">
          <div className="border-b border-border">
            <div className="container mx-auto">
              <div className="max-w-5xl mx-auto">
                <nav className="flex items-center justify-center h-12">
                  <div className="w-full h-full flex items-center justify-between px-4">
                    <div className="flex items-center gap-8">
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

                    <div className="hidden md:flex items-center gap-4">
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none"
                      >
                        [buy on Ray]
                      </Link>
                    </div>

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
            href="#"
            className="text-lg text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none"
            onClick={(e) => e.preventDefault()}
          >
            [buy on Ray]
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={`fixed md:relative h-screen z-[60] ${isSidebarOpen ? "w-[260px]" : "w-0"}`}
      >
        <div
          className={`absolute inset-y-0 transition-transform duration-200 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ChatSidebarContainer
            threadId={threadId || null}
            isCollapsed={!isSidebarOpen}
            onToggleCollapse={toggleSidebar}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen relative">
        {/* Navbar */}
        <div className="flex-shrink-0 h-12 border-b border-border bg-background z-50">
          <Navbar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
            onLogoutClick={() => setShowLogoutConfirm(true)}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto relative">{children}</div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-[425px] border-border bg-background fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-medium text-foreground">
              confirm logout
            </DialogTitle>
            <div className="pt-2 sm:pt-3 text-sm sm:text-base text-muted-foreground">
              are you sure you want to logout?
            </div>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-3 sm:pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowLogoutConfirm(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              [cancel]
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isLoggingOut ? "[logging out...]" : "[confirm logout]"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
