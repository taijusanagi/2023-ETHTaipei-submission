import { useState, useEffect } from "react";
import { useNetwork as _useNetwork } from "wagmi";

import { Network, isChainId } from "@/types";
import { getNetwork } from "@/lib/network";

export const useNetwork = () => {
  const [network, setNetwork] = useState<Network>();
  const { chain } = _useNetwork();

  useEffect(() => {
    if (!chain) {
      return;
    }
    const chainId = chain.id;
    if (!isChainId(chainId)) {
      return;
    }

    const network = getNetwork(chainId);
    setNetwork(network);
  }, [chain]);

  return { network };
};
