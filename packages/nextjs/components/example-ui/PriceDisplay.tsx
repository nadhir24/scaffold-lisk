"use client";

import { useCallback, useEffect, useState } from "react";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { getSignersForDataServiceId } from "@redstone-finance/sdk";
import { ethers } from "ethers";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface PriceDisplayProps {
  symbol: "ETH" | "BTC";
}

export const PriceDisplay = ({ symbol }: PriceDisplayProps) => {
  const [price, setPrice] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: priceFeedContract } = useDeployedContractInfo("PriceFeed");

  const fetchPrice = useCallback(async () => {
    if (!priceFeedContract) {
      setError("PriceFeed contract not deployed");
      setIsLoading(false);
      return;
    }

    if (typeof window === "undefined" || !window.ethereum) {
      setError("Please connect your wallet");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const contract = new ethers.Contract(priceFeedContract.address, priceFeedContract.abi, provider);

      const signers = getSignersForDataServiceId("redstone-main-demo");

      const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
        dataServiceId: "redstone-main-demo",
        dataPackagesIds: [symbol],
        authorizedSigners: signers,
      });

      const priceData = symbol === "ETH" ? await wrappedContract.getEthPrice() : await wrappedContract.getBtcPrice();

      const numericPrice = Number(priceData) / 1e8;

      // Format angka ribuan dan dua desimal
      const formattedPrice = new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericPrice);

      setPrice(formattedPrice);
      setLastUpdate(new Date());
      setIsLoading(false);
    } catch (err: any) {
      setError(`Failed to fetch ${symbol} price: ${err?.message || "Unknown error"}`);
      setIsLoading(false);
    }
  }, [priceFeedContract, symbol]);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">{symbol}/USD</h2>

        {error ? (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Current Price</div>
              <div className="stat-value text-primary">${price}</div>
              <div className="stat-desc">Last updated: {lastUpdate.toLocaleTimeString()}</div>
            </div>
          </div>
        )}

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm btn-outline" onClick={fetchPrice} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Refreshing...
              </>
            ) : (
              "Refresh"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
