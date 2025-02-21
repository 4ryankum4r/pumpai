import { Cluster } from "@repo/pumpai-agent";
import { create } from "zustand";

interface ClusterState {
  selectedCluster: Cluster;
  setSelectedCluster: (cluster: Cluster) => void;
  getRpcUrl: () => string;
}

export const useClusterStore = create<ClusterState>((set) => ({
  selectedCluster: "mainnet-beta" as Cluster,
  setSelectedCluster: (cluster) => set({ selectedCluster: cluster }),
  getRpcUrl: () => {
    // Always return mainnet RPC URL regardless of selected cluster
    return (
      process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL ||
      "https://api.mainnet-beta.solana.com"
    );
  },
}));
