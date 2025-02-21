"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { WelcomePage } from "./WelcomePage";

type AuthGuardProps = {
  children: ReactNode | ((props: { isAuthenticated: boolean }) => ReactNode);
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { ready, authenticated, login } = usePrivy();

  if (!ready) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
        <div className="w-full max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="relative flex items-center justify-center"
          >
            <motion.div
              animate={{
                opacity: [1, 0.5, 1],
                scale: [1, 0.97, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-2xl font-bold">Pump AI</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <WelcomePage onLogin={login} />;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full mx-auto">
        {typeof children === "function"
          ? children({ isAuthenticated: authenticated })
          : children}
      </div>
    </div>
  );
}
