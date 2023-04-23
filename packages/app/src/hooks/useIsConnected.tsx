import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

// this is to avoid hydration error
export const useIsConnected = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { isConnected: _isConnected } = useAccount();

  useEffect(() => {
    setIsConnected(_isConnected);
  }, [_isConnected]);

  return { isConnected };
};
