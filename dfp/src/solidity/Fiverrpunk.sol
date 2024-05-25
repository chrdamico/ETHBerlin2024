// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./Ownable.sol";
import "./IFiverrpunk.sol";
import "./TrustComputer.sol";

error ZeroAddress();

contract Fiverrpunk is Ownable, IFiverrpunk {
    // =============================================================
    //                           CONSTANTS
    // =============================================================

    IERC20 public immutable override DAI;

    uint256 public override feeDisputant = 750; // 100 = 1%

    uint256 public override lastRequestId;

    TrustComputer public override trustAlgorithm;

    // =============================================================
    //                            VARIABLES
    // =============================================================

    mapping(uint256 => Request) private _requestMap;

    mapping(address => bool) public override isDisputer;

    // =============================================================
    //                      PROPOSER VARIABLES
    // =============================================================

    mapping(address => Reputation) private _proposerTrustMeter;

    /**
     * @inheritdoc IFiverrpunk
     */
    mapping(address => mapping(uint256 => uint256))
        public
        override proposerIdMap;

    /**
     * @inheritdoc IFiverrpunk
     */
    mapping(address => uint256) public override pendingReqMap;

    /**
     * @inheritdoc IFiverrpunk
     */
    mapping(uint256 => uint256) public override idProposerMap;

    // =============================================================
    //                        DEV VARIABLES
    // =============================================================

    mapping(address => Reputation) private _devTrustMeter;

    /**
     * @inheritdoc IFiverrpunk
     */
    mapping(address => mapping(uint256 => uint256)) public override devIdMap;

    /**
     * @inheritdoc IFiverrpunk
     */
    mapping(address => uint256) public override acceptedReqMap;

    /**
     * @inheritdoc IFiverrpunk
     */
    mapping(uint256 => uint256) public override idDevMap;

    // =============================================================
    //                        CONSTRUCTOR
    // =============================================================

    constructor(TrustComputer _trustAlgorithm) Ownable(msg.sender) {
        if (address(_trustAlgorithm) == address(0)) revert ZeroAddress();
        trustAlgorithm = _trustAlgorithm;
        DAI = IERC20(0x68194a729C2450ad26072b3D33ADaCbcef39D574);
    }

    // =============================================================
    //                        MODIFIERS
    // =============================================================

    modifier onlyDisputant() {
        require(
            isDisputer[msg.sender],
            "Only disputant can call this function"
        );
        _;
    }

    // =============================================================
    //                        PUBLIC WRITE FUNCTIONS
    // =============================================================

    function createRequest(
        uint256 value,
        uint256 requestTiming,
        uint256 laudableTiming,
        uint256 prize,
        uint256 requiredTrust
    ) public override {
        require(value > 0, "missing values");
        require(
            requestTiming > block.timestamp,
            "cannot create request in the past"
        );
        if (laudableTiming > 0) {
            require(requestTiming > laudableTiming, "invalid laudable timing");
            require(prize > 0, "missing prize");
        }
        require(requiredTrust < 100, "trust too high");

        DAI.transferFrom(msg.sender, address(this), value + prize);
        _requestMap[lastRequestId] = Request({
            proposer: msg.sender,
            dev: address(0),
            value: value,
            requestTiming: requestTiming,
            laudableTiming: laudableTiming,
            prize: prize,
            startTime: 0,
            status: 0,
            requiredTrust: requiredTrust
        });
        uint256 count = pendingReqMap[msg.sender];
        idProposerMap[lastRequestId] = count;
        proposerIdMap[msg.sender][count] = lastRequestId;
        pendingReqMap[msg.sender]++;
        emit RequestCreated(lastRequestId++);
    }

    function acceptRequest(uint256 id) external override {
        Request storage req = _requestMap[id];
        require(req.dev == address(0), "request already accepted");
        require(req.status == 0, "request must be active");
        require(
            trustAlgorithm.computeTrust(msg.sender) >= req.requiredTrust,
            "trust too low"
        );
        req.dev = msg.sender;
        req.startTime = block.timestamp;
        req.status = 1;

        uint256 count = acceptedReqMap[msg.sender];
        idDevMap[id] = count;
        devIdMap[msg.sender][count] = id;
        acceptedReqMap[msg.sender]++;

        emit RequestAssigned(id);
    }

    // =============================================================
    //                        ONLY OWNER (DAO)
    // =============================================================

    function setDisputant(
        address disputant,
        bool value
    ) external override onlyOwner {
        isDisputer[disputant] = value;
    }

    function setDisputantFee(uint256 new_fee) external override onlyOwner {
        require(new_fee < 2000, "Fee must be less than 20%");
        feeDisputant = new_fee;
    }

    // we delegate the trust algorithm to a contract so we can easly upgrade it.
    function setTrustComputer(
        address implementation
    ) external override onlyOwner {
        trustAlgorithm = TrustComputer(implementation);
    }

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
    ) external override {
        Request storage req = _requestMap[id];
        require(req.status == 0, "request must be pending");
        require(req.proposer == msg.sender, "only proposer can call this");
        require(
            newRequestTiming > block.timestamp,
            "cannot create request in the past"
        );
        require(newValue > 0, "missing values");
        if (newLaudableTiming > 0) {
            require(
                newRequestTiming > newLaudableTiming,
                "invalid laudable timing"
            );
            require(newPrize > 0, "missing prize");
        }

        int256 deltaValue = int256(newValue - req.value) +
            int256(newPrize - req.prize);
        if (deltaValue > 0) {
            DAI.transferFrom(msg.sender, address(this), uint256(deltaValue));
        } else {
            DAI.transfer(msg.sender, uint256(-deltaValue));
        }

        req.value = newValue;
        req.requestTiming = newRequestTiming;
        req.laudableTiming = newLaudableTiming;
        req.prize = newPrize;
        req.requiredTrust = newRequiredTrust;
        emit ParameterChanged(id);
    }

    function cancelRequest(uint256 id) external override {
        Request storage req = _requestMap[id];
        require(req.proposer == msg.sender, "only proposer can call this");
        require(req.startTime == 0, "request must be pending");
        req.status = 3;
        DAI.transfer(msg.sender, req.value + req.prize);
        _decreaseRequestCount(id, msg.sender);
        emit RequestCancelled(id);
    }

    function finalizeRequest(uint256 id) external override {
        Request storage req = _requestMap[id];
        require(req.proposer == msg.sender, "only proposer can call this");
        require(req.startTime > 0, "request not started");
        require(req.status == 1, "request must be active");
        req.status = 2;
        Reputation storage proposerRep = _proposerTrustMeter[req.proposer];
        Reputation storage devRep = _devTrustMeter[req.proposer];

        uint256 totalValue = req.value;
        if (block.timestamp < req.laudableTiming) {
            totalValue += req.prize;
            proposerRep.totalPrize += req.prize;
            devRep.totalPrize += req.prize;
        }
        proposerRep.totalValue += totalValue;
        devRep.totalValue += totalValue;
        DAI.transfer(req.dev, totalValue);
        _decreaseRequestCount(id, req.proposer);
        _decreaseAcceptedCount(id, req.dev);
        emit RequestFinalized(id);
    }

    function withdrawPrize(uint256 id) external override {
        Request storage req = _requestMap[id];
        require(req.proposer == msg.sender, "only proposer can call this");
        require(
            block.timestamp > req.laudableTiming,
            "laudable time is in the future"
        );
        DAI.transfer(msg.sender, req.prize);
        emit PrizeWithdrawn(id);
    }

    // =============================================================
    //                        ONLY DEV OR PROPOSER
    // =============================================================

    function openDispute(uint256 id) external override {
        Request storage req = _requestMap[id];
        require(req.status == 1, "request not accepted");
        require(
            req.proposer == msg.sender || req.dev == msg.sender,
            "only proposer or dev can call this"
        );
        require(block.timestamp > req.requestTiming, "wait for deadline");
        req.status = 2;

        Reputation storage proposerRep = _proposerTrustMeter[msg.sender];
        proposerRep.disputed++;
        Reputation storage devRep = _devTrustMeter[msg.sender];
        devRep.disputed++;
        emit RequestDisputed(id);
    }

    // =============================================================
    //                        ONLY DISPUTER
    // =============================================================

    /**
     * @notice function to solve a dispute.
     * @param id of the proposal.
     * @param result: 0: proposer wins, else: proposer loses (could be added a % refound).
     // what if result is the % to give to the disputer? so non binary.
     **/
    function solveDispute(
        uint256 id,
        uint256 result
    ) external override onlyDisputant {
        Request storage req = _requestMap[id];
        require(req.status == 2, "request not disputed");
        require(result == 0 || result == 1, "invalid result");
        req.status = 3;

        Reputation storage proposerRep = _proposerTrustMeter[req.proposer];
        Reputation storage devRep = _devTrustMeter[req.dev];

        if (result == 0) {
            DAI.transfer(req.dev, req.value);
            proposerRep.won++;
            devRep.lost++;
            proposerRep.totalValue += req.value;
        } else {
            DAI.transfer(req.proposer, req.value + req.prize);
            proposerRep.lost++;
            devRep.won++;
            devRep.totalValue += req.value;
        }

        _decreaseRequestCount(id, req.proposer);
        _decreaseAcceptedCount(id, req.dev);

        emit RequestFinalized(id);
    }

    // =============================================================
    //                        INTERNAL FUNCTIONS
    // =============================================================

    function _decreaseRequestCount(uint256 id, address proposer) internal {
        uint256 count = pendingReqMap[proposer];
        if (count > 1) {
            proposerIdMap[proposer][idProposerMap[id]] = proposerIdMap[
                proposer
            ][count - 1];
        }
        idProposerMap[id] = 0;
        proposerIdMap[proposer][count - 1] = 0;
        pendingReqMap[proposer]--;
    }

    function _decreaseAcceptedCount(uint256 id, address dev) internal {
        uint256 count = acceptedReqMap[dev];
        if (count > 1) {
            devIdMap[dev][idDevMap[id]] = devIdMap[dev][count - 1];
        }
        idDevMap[id] = 0;
        devIdMap[dev][count - 1] = 0;
        acceptedReqMap[dev]--;
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    function getRequest(
        uint256 id
    )
        external
        view
        override
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
        )
    {
        Request storage req = _requestMap[id];
        return (
            req.proposer,
            req.dev,
            req.value,
            req.requestTiming,
            req.laudableTiming,
            req.prize,
            req.startTime,
            req.status,
            req.requiredTrust
        );
    }

    function getProposerReputation(
        address proposer
    )
        external
        view
        override
        returns (
            uint256 requestsCount,
            uint256 disputed,
            uint256 won,
            uint256 lost,
            uint256 totalPrize,
            uint256 totalValue
        )
    {
        Reputation storage rep = _proposerTrustMeter[proposer];
        return (
            rep.requestsCount,
            rep.disputed,
            rep.won,
            rep.lost,
            rep.totalPrize,
            rep.totalValue
        );
    }

    function getDevReputation(
        address dev
    )
        external
        view
        override
        returns (
            uint256 requestsCount,
            uint256 disputed,
            uint256 won,
            uint256 lost,
            uint256 totalPrize,
            uint256 totalValue
        )
    {
        Reputation storage rep = _devTrustMeter[dev];
        return (
            rep.requestsCount,
            rep.disputed,
            rep.won,
            rep.lost,
            rep.totalPrize,
            rep.totalValue
        );
    }
}
