// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;
import "./IFiverrpunk.sol";

contract TrustComputer {
    /*
        uint256 requestsCount,
        uint256 disputed,
        uint256 won,
        uint256 lost,
        uint256 totalPrize,
        uint256 totalValue
     */
    function computeTrust(address _user) external pure returns (uint256) {
        return 100;
    }
}
