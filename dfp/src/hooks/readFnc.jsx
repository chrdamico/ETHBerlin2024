import { useReadContract } from "wagmi";
// import configs from "../configs.json";
import abiDAI from "../solidity/data/DAI/ABI";
import abiWETH from "../solidity/data/WETH/ABI";

const WETHAddress = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
const DAIAddress = "0x68194a729C2450ad26072b3D33ADaCbcef39D574";
const fiverrpunkAddress = "0x07E577C64ddA84B130a6F813b1bF73fe51EC503D";
// configs.isTest
//   ? configs.address.testnet
//   : configs.address.mainnet;

const WETHContract = {
  address: WETHAddress,
  abi: abiWETH,
};

export function readAllowance(address) {
  const { data, error, isLoading } = useReadContract({
    ...WETHContract,
    functionName: "allowance",
    args: [address, fiverrpunkAddress],
  });
  return { data, error, isLoading };
}
