// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@redstone-finance/evm-connector/contracts/consumers/MainDemoConsumerBase.sol";

/**
 * @title PriceFeed
 * @notice Fetches live asset prices using RedStone Oracles
 * @dev This contract inherits from MainDemoConsumerBase to get oracle functionality
 */
contract PriceFeed is MainDemoConsumerBase {
    /**
     * @notice Get the latest price of ETH in USD
     * @return price The price of ETH in USD with 8 decimals
     */
    function getEthPrice() external view returns (uint256) {
        // Get the price of ETH from the oracle
        return getOracleNumericValueFromTxMsg("ETH");
    }

    /**
     * @notice Get the latest price of BTC in USD
     * @return price The price of BTC in USD with 8 decimals
     */
    function getBtcPrice() external view returns (uint256) {
        // Get the price of BTC from the oracle
        return getOracleNumericValueFromTxMsg("BTC");
    }

    /**
     * @notice Get the latest prices of multiple assets in USD
     * @return prices An array of prices in USD with 8 decimals
     */
    function getMultiplePrices() external view returns (uint256[] memory) {
        // Define which assets you want to fetch
        string[] memory assetNames = new string[](2);
        assetNames[0] = "ETH";
        assetNames[1] = "BTC";

        // Get the prices from the oracle
        return getOracleNumericValuesFromTxMsg(assetNames);
    }

    /**
     * @notice Override the default timestamp validation for development
     * @dev This allows for a 15-minute tolerance in block timestamps
     */
    function validateTimestamp(uint256 receivedTimestamp) internal view override {
        // Allow for a 15-minute tolerance in block timestamps
        // solhint-disable-next-line not-rely-on-time
        require(
            receivedTimestamp < block.timestamp + 900 && receivedTimestamp > block.timestamp - 900,
            "Timestamp is too far from the block timestamp"
        );
    }
}