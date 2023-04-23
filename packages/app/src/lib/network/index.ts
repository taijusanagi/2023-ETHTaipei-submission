import { Network, ChainId } from "@/types";

export const getNetwork = (chainId: ChainId): Network => {
  if (chainId === 1337) {
    return "localhost";
  } else {
    return "gnosis";
  }
};

export const getRPC = (network: Network): string => {
  if (network === "localhost") {
    return "http://localhost:8545";
  } else {
    return "https://rpc.gnosischain.com";
  }
};
