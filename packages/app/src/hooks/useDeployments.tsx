import { useState, useEffect } from "react";
import { useNetwork } from "./useNetwork";
import deploymentsJson from "../../../contracts/deployments.json";
import { Deployments } from "@/types";

export const useDeployments = () => {
  const [deployments, setDeployments] = useState<Deployments>();
  const { network } = useNetwork();

  useEffect(() => {
    if (!network) {
      return;
    }
    setDeployments(deploymentsJson[network]);
  }, [network]);

  return { deployments };
};
