"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatInterface from "./components/ChatInterface";
import { AuthGuard } from "./components/AuthGuard";
import AppLayout from "./components/AppLayout";

function HomeContent({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean;
}) {
  const searchParams = useSearchParams();
  const cid = searchParams.get("cid");

  return (
    <AppLayout threadId={cid} isAuthenticated={isAuthenticated}>
      <ChatInterface threadId={cid} />
    </AppLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthGuard>
        {({ isAuthenticated }) => (
          <HomeContent isAuthenticated={isAuthenticated} />
        )}
      </AuthGuard>
    </Suspense>
  );
}
