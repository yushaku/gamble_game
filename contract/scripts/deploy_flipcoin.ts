import { ethers } from "hardhat";
import { getAddress, sleep, verifyContract, writeDownAddress } from "../utils";

/**
 * @dev: where to get data
 * get vrf_coordinator: https://docs.chain.link/vrf/v2/subscription/supported-networks
 * created subscription and get its id: https://vrf.chain.link/bnb-chain-testnet
 * */

const config = {
  sepolia: {
    subscriptionId: 1685,
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    vrf_coordinator: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    hash: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
  },
  bnb_testnet: {
    subscriptionId: 3254,
    linkToken: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
    vrf_coordinator: "0x6A2AAd07396B36Fe02a22b33cf443582f682c82f",
    hash: "0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314",
  },
};

const name = "flipCoin";
async function main() {
  const network = await ethers.provider.getNetwork();
  const [deployer] = await ethers.getSigners();
  console.log(
    "deploy from address: ",
    deployer.address,
    "in network: ",
    network.name,
  );
  const { vrf_coordinator, subscriptionId, hash } =
    config[network.name as "sepolia" | "bnb_testnet"];

  const FlipCoin = await ethers.getContractFactory("FlipCoin");
  const flipCoin = await FlipCoin.deploy(subscriptionId, vrf_coordinator, hash);
  const address = await flipCoin.getAddress();
  writeDownAddress(name, address, network.name);
}

export async function verify() {
  const network = await ethers.provider.getNetwork();
  console.log(`${network.name}: FlipCoin`);
  console.log(`Network chain id= ${network.chainId}`);

  await new Promise((resolve) => setTimeout(resolve, 5_000));
  const address = getAddress(name, network.name);

  const { vrf_coordinator, subscriptionId, hash } =
    config[network.name as "sepolia" | "bnb_testnet"];

  await verifyContract(address, [subscriptionId, vrf_coordinator, hash]);
}

main()
  .then(async () => await sleep(5000))
  .then(async () => await verify())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
