"use client";

import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const TokenBalance = () => {
  const { address: connectedAddress } = useAccount();

  const { data: balance } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "balanceOf",
    args: [connectedAddress as `0x${string}`],
  });

  const { data: symbol } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "symbol",
  });

  if (!connectedAddress) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Token Balance</h2>
          <p>Please connect your wallet to view your balance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Your Token Balance</h2>
        <div className="stat">
          <div className="stat-value text-primary">
            {balance ? (Number(balance) / 1e18).toFixed(2) : "0"} {symbol || ""}
          </div>
        </div>
      </div>
    </div>
  );
};
