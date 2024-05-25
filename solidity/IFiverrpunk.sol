// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./TrustComputer.sol";

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
}

interface IFiverrpunk {
    // note: proposer || dev. same struct for both.
    struct Reputation {
        uint256 requestsCount; // how many accepted requests he has
        uint256 disputed; // how many disputes have been opened
        uint256 won; // how many disputes he won
        uint256 lost; // how many disputes he lost
        uint256 totalPrize; // how much money he paid/reiceve in total in prizes
        uint256 totalValue; // how much money he paid/reiceve in total
    }

    struct Request {
        address proposer; // who create the request
        address dev; // who accepted the request
        uint256 value; // how much money in escrow
        uint256 requestTiming; // time limit for fulfilling the request since apcepted
        uint256 laudableTiming; // time within which one acceptor is entitled to a prize
        uint256 prize; // prize in escrow
        uint256 startTime; // 0 is not accepted, else the time of acceptance
        uint256 status; // 0 = pending, 1= accepted, 2 = disputed, 3 = closed
        uint256 requiredTrust; // trust required to accept the request
    }

    // =============================================================
    //                           CONSTANTS
    // =============================================================
    /**
     * @return DAI token interface (IERC20).
     */
    function DAI() external view returns (IERC20);

    /**
     * @return percentage_fee that the resolutor of a dispute will riceve (100=1%).
     */
    function feeDisputant() external view returns (uint256);

    /**
     * @return id: last (global) requests id.
     */
    function lastRequestId() external view returns (uint256);

    /**
     * @return implementation: TrustComputer implementation.
     */
    function trustAlgorithm() external view returns (TrustComputer);

    // =============================================================
    //                            STORAGE
    // =============================================================

    function getRequest(
        uint256 id
    )
        external
        view
        returns (
            address proposer,
            address dev,
            uint256 value,
            uint256 requestTiming,
            uint256 laudableTiming,
            uint256 prize,
            uint256 startTime,
            uint256 status,
            uint256 requiredTrust
        );

    /**
     * @notice Getter function to access isDisputer mapping values.
     * @param key The address key used to look up the bool value in the mapping.
     * @return The bool value associated with the provided key.
     */
    function isDisputer(address key) external view returns (bool);

    // =============================================================
    //                        PROPOSER STORAGE
    // =============================================================

    function getProposerReputation(
        address proposer
    )
        external
        view
        returns (
            uint256 requestsCount,
            uint256 disputed,
            uint256 won,
            uint256 lost,
            uint256 totalPrize,
            uint256 totalValue
        );

    /**
     * @notice Getter function to access proposerIdMap mapping values.
     * @param proposer address.
     * @param position of a request in the proposal requests count.
     * @return id of the proposal.
     */
    function proposerIdMap(
        address proposer,
        uint256 position
    ) external view returns (uint256);

    /**
     * @notice Getter function to access pendingReqMap mapping values.
     * @param proposer address.
     * @return number of pending requests of proposer.
     */
    function pendingReqMap(address proposer) external view returns (uint256);

    /**
     * @notice Getter function to access idProposerMap mapping values.
     * @param id of a request.
     * @return position in proposer requestsCount.
     */
    function idProposerMap(uint256 id) external view returns (uint256);

    // =============================================================
    //                        DEV STORAGE
    // =============================================================

    function getDevReputation(
        address dev
    )
        external
        view
        returns (
            uint256 requestsCount,
            uint256 disputed,
            uint256 won,
            uint256 lost,
            uint256 totalPrize,
            uint256 totalValue
        );

    // /**
    //  * @notice Getter function to access devIdMap mapping values.
    //  * @param key1 The address key used in the first level of the mapping.
    //  * @param key2 The uint256 key used in the second level of the mapping.
    //  * @return The uint256 value associated with the provided keys.
    //  */
    // function devIdMap(
    //     address key1,
    //     uint256 key2
    // ) external view returns (uint256);

    // /**
    //  * @notice Getter function to access acceptedReqMap mapping values.
    //  * @param key The address key used to look up the uint256 value in the mapping.
    //  * @return The uint256 value associated with the provided key.
    //  */
    // function acceptedReqMap(address key) external view returns (uint256);

    // /**
    //  * @notice Getter function to access idDevMap mapping values.
    //  * @param key The uint256 key used to look up the uint256 value in the mapping.
    //  * @return The uint256 value associated with the provided key.
    //  */
    // function idDevMap(uint256 key) external view returns (uint256);

    // =============================================================
    //                            EVENTS
    // =============================================================

    event RequestCreated(uint256 id);
    event RequestCancelled(uint256 id);

    event ParameterChanged(uint256 id);

    event RequestAssigned(uint256 id);
    event RequestDisputed(uint256 id);
    event RequestFinalized(uint256 id);
    event PrizeWithdrawn(uint256 id);

    // event DisputeSolved(uint256 id, uint256 result);

    // =============================================================
    //                        PUBLIC WRITE
    // =============================================================

    function createRequest(
        uint256 value,
        uint256 requestTiming,
        uint256 laudableTiming,
        uint256 prize,
        uint256 requiredTrust
    ) external;

    function acceptRequest(uint256 id) external;

    // =============================================================
    //                        ONLY OWNER (DAO)
    // =============================================================

    // note: disputers can be a DAO. governance vote needed to call this function.
    function setDisputant(address disputant, bool value) external;

    function setDisputantFee(uint256 new_fee) external;

    // we delegate the trust algorithm to a contract so we can easly upgrade it.
    function setTrustComputer(address implementation) external;

    // =============================================================
    //                        ONLY PROPOSER
    // =============================================================

    function changeRequestParameter(
        uint256 id,
        uint256 newValue,
        uint256 newRequestTiming,
        uint256 newLaudableTiming,
        uint256 newPrize,
        uint256 newRequiredTrust
    ) external;

    function cancelRequest(uint256 id) external;

    function finalizeRequest(uint256 id) external;

    function withdrawPrize(uint256 id) external;

    // =============================================================
    //                        ONLY DEV OR PROPOSER
    // =============================================================

    function openDispute(uint256 id) external;

    // =============================================================
    //                        ONLY DISPUTER
    // =============================================================

    /**
     * @notice function to solve a dispute.
     * @param id of the proposal.
     * @param result: 0: proposer wins, else: proposer loses (could be added a % refound).
     // what if result is the % to give to the disputer? so non binary.
     **/
    function solveDispute(uint256 id, uint256 result) external;
}
