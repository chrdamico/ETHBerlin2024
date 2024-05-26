import * as React from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import fpAbi from "../solidity/data/Fiverrpunk/ABI";

const { data: hash, error, isPending, writeContract } = useWriteContract();

async function createRequest({
    value,
    requestTiming,
    laudableTiming,
    prize,
    requiredTrust  
}) {
  writeContract({
    address: contractAddress,
    abi: fpAbi,
    functionName: "createRequest",
    args: [
        BigInt(value),
        BigInt(requestTiming),
        BigInt(laudableTiming),
        BigInt(prize),
        BigInt(requiredTrust),
    ],
  });
}

// const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({hash});