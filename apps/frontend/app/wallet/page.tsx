"use client";

import { usePrivy, type WalletWithMetadata } from "@privy-io/react-auth";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useState, useMemo, useCallback } from "react";
import { useWallet, useTransactionHistory } from "../hooks/wallet";
import { Button } from "@/components/ui/button";
import { Cluster } from "@repo/pumpai-agent";
import { AuthGuard } from "../components/AuthGuard";
import { useWalletModal } from "../providers/WalletProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction } from "../types/api/wallet";
import { useInfiniteQuery } from "@tanstack/react-query";
import { walletClient } from "../clients/wallet";
import { Asset } from "../types/api/wallet";
import { AssetTransferModal } from "../components/AssetTransferModal";
import { useClusterStore } from "../store/clusterStore";
import AppLayout from "../components/AppLayout";
import Image from "next/image";

function TransactionList({
  transactions,
  onLoadMore,
  hasMore,
  isLoadingMore,
  error,
}: {
  transactions: Transaction[];
  walletAddress: string | undefined;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  error?: Error | null;
}) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-sm text-red-500/80">[{error.message}]</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          [try again]
        </Button>
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">[no transactions found]</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.signature}
            className="group flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors border border-border"
          >
            <span className="text-sm text-muted-foreground font-mono">
              [{tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}]
            </span>
            <a
              href={`https://solscan.io/tx/${tx.signature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              [view]
            </a>
          </div>
        ))}
      </div>

      {hasMore && transactions.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            {isLoadingMore ? "[loading...]" : "[load more]"}
          </Button>
        </div>
      )}
    </div>
  );
}

function TokenCard({ token }: { token: Asset }) {
  const { token_info, content } = token;
  const name = token_info?.name || content?.metadata?.name || "Unknown Token";
  const symbol = token_info?.symbol || content?.metadata?.symbol;
  const balance = token_info?.balance;
  const decimals = token_info?.decimals || 0;
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyTokenId = async () => {
    await navigator.clipboard.writeText(token.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  //@ts-expect-error - price_info and total_price may be undefined
  const tokenValue = token_info?.price_info?.total_price;
  //@ts-expect-error - links and image may be undefined
  const tokenImage = content?.links?.image;

  return (
    <>
      <div className="flex items-center gap-4 p-4 hover:bg-muted/30 rounded-lg transition-colors border border-border">
        {tokenImage && (
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={tokenImage}
              alt={name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">[{name}]</h3>
              <button
                onClick={copyTokenId}
                className="p-1 hover:text-primary transition-colors"
              >
                {copied ? "[copied!]" : "[copy]"}
              </button>
            </div>
            <div className="text-right">
              {balance && (
                <p className="text-sm font-medium">
                  [{(Number(balance) / Math.pow(10, decimals)).toLocaleString()}
                  ]
                </p>
              )}
              {tokenValue && (
                <p className="text-xs text-muted-foreground">
                  [$
                  {tokenValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  ]
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            {symbol && (
              <p className="text-sm text-muted-foreground">[{symbol}]</p>
            )}
            <div
              onClick={() => setShowTransferModal(true)}
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
            >
              [transfer]
            </div>
          </div>
        </div>
      </div>

      <AssetTransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        asset={token}
        onSuccess={() => setShowTransferModal(false)}
      />
    </>
  );
}

function TokenList({
  walletAddress,
  cluster,
}: {
  walletAddress: string;
  cluster: Cluster;
}) {
  const pageSize = 50;

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["tokens", walletAddress, cluster],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return walletClient.getAssets(walletAddress, {
        page: pageParam,
        limit: pageSize,
        displayOptions: {
          showFungible: true,
          showNativeBalance: true,
        },
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.result) return undefined;
      const { total, limit, page } = lastPage.result;
      const hasMore = total > page * limit;
      return hasMore ? page + 1 : undefined;
    },
    enabled: Boolean(walletAddress),
  });

  const allTokens = useMemo(() => {
    return (
      data?.pages.flatMap(
        (page) => page.result.items.filter((item) => item.token_info) || []
      ) || []
    );
  }, [data?.pages]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (error) {
    return (
      <div className="flex flex-col items-center py-4">
        <p className="text-red-500 mb-2">
          [{error instanceof Error ? error.message : "Failed to load tokens"}]
        </p>
        <Button onClick={handleRefresh}>[try again]</Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-4">[loading tokens...]</div>;
  }

  if (!allTokens?.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        [no tokens found]
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          [{allTokens.length} {allTokens.length === 1 ? "token" : "tokens"}]
        </div>
        <div
          onClick={handleRefresh}
          className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
        >
          {isRefetching ? "[refreshing...]" : "[refresh]"}
        </div>
      </div>

      <div className="space-y-2">
        {allTokens.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "[loading...]" : "[load more]"}
          </Button>
        </div>
      )}
    </div>
  );
}

function WalletContent() {
  const { user, ready } = usePrivy();
  const { exportWallet } = useSolanaWallets();
  const { selectedCluster } = useClusterStore();
  const {
    wallet,
    walletAddress,
    balance,
    isLoadingBalance,
    isRefetchingBalance,
    refreshBalance,
  } = useWallet();

  const {
    data: historyData,
    fetchNextPage,
    hasNextPage,
    error: historyError,
    isFetchingNextPage,
  } = useTransactionHistory(walletAddress);

  const allTransactions =
    historyData?.pages.flatMap((page) => page.transactions) || [];

  const [copied, setCopied] = useState(false);
  const { openWalletModal } = useWalletModal();

  const hasEmbeddedWallet = !!user?.linkedAccounts?.find(
    (account): account is WalletWithMetadata =>
      account.type === "wallet" &&
      account.walletClientType === "privy" &&
      account.chainType === "solana"
  );

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!ready) return null;

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">[no wallet created]</h1>
          <p className="text-muted-foreground">
            [please create a wallet through the chat interface]
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Wallet Overview Section */}
        <section className="space-y-6">
          <h1 className="text-3xl">[wallet overview]</h1>

          {/* Address and Balance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address Card */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  [address]
                </label>
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <code className="text-sm truncate flex-1">
                    [{walletAddress}]
                  </code>
                  <Button
                    onClick={copyAddress}
                    variant="ghost"
                    size="sm"
                    className="h-9"
                  >
                    {copied ? "[copied!]" : "[copy]"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  [balance]
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-muted/30 rounded-lg h-[36px] flex items-center">
                    <span className="font-medium">
                      {isLoadingBalance
                        ? "[loading...]"
                        : `[${balance?.toFixed(4) || "0"} SOL]`}
                    </span>
                  </div>
                  <div
                    onClick={refreshBalance}
                    className="h-[36px] border-border cursor-pointer"
                  >
                    {isLoadingBalance || isRefetchingBalance
                      ? "[refreshing...]"
                      : "[refresh]"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">
                [quick actions]
              </label>
              <div className="flex gap-4">
                <Button
                  onClick={() =>
                    walletAddress
                      ? exportWallet({ address: walletAddress })
                      : null
                  }
                  variant="ghost"
                  className="flex-1 border-border"
                  disabled={!walletAddress || !hasEmbeddedWallet}
                >
                  [export wallet]
                </Button>
                <Button onClick={openWalletModal} className="flex-1">
                  send SOL
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tokens Section */}
        <section className="space-y-4">
          <div className="p-6 rounded-xl border border-border bg-card">
            <h2 className="text-xl font-semibold mb-6">[token holdings]</h2>
            <TokenList
              walletAddress={walletAddress}
              cluster={selectedCluster}
            />
          </div>
        </section>

        {/* Transaction History Section */}
        <section className="space-y-4">
          <div className="p-6 rounded-xl border border-border bg-card">
            <h2 className="text-xl font-semibold mb-6">[txn history]</h2>
            <ScrollArea className="h-[400px] pr-4">
              <div className="pb-4">
                <TransactionList
                  transactions={allTransactions}
                  walletAddress={walletAddress}
                  onLoadMore={handleLoadMore}
                  hasMore={!!hasNextPage}
                  isLoadingMore={isFetchingNextPage}
                  error={historyError instanceof Error ? historyError : null}
                />
              </div>
            </ScrollArea>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <AuthGuard>
      {({ isAuthenticated }) => (
        <AppLayout threadId={null} isAuthenticated={isAuthenticated}>
          <WalletContent />
        </AppLayout>
      )}
    </AuthGuard>
  );
}
