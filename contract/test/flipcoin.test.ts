import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { parseUnits } from "ethers";
import { ethers } from "hardhat";
import { FlipCoin } from "typechain";

function parseEther(amount: number) {
  return parseUnits(amount.toString(), 18);
}

describe("Flipcoin Contract", () => {
  let owner: HardhatEthersSigner,
    alice: HardhatEthersSigner,
    bob: HardhatEthersSigner,
    carol: HardhatEthersSigner;
  let flipcoin: FlipCoin;
  let flipcoinAddress: string;

  async function setup() {
    const [owner, alice, bob, carol] = await ethers.getSigners();

    const VRFCoordinatorV2Mock = await ethers.getContractFactory(
      "VRFCoordinatorV2Mock",
      owner,
    );
    const coordinator = await VRFCoordinatorV2Mock.deploy(
      1_000_000_000_000_000n,
      1_000_000_000n,
    );
    const coordinatorAddress = await coordinator.getAddress();
    const id = await coordinator.createSubscription();
    console.log({ id });
    const a = await coordinator.fundSubscription(1, "1000000000000000000");
    console.log(a);

    const RandomNumberConsumerV2 = await ethers.getContractFactory(
      "RandomNumberConsumerV2",
      owner,
    );
    const consumerV2 = await RandomNumberConsumerV2.deploy(
      1,
      coordinatorAddress,
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    );
    const consumerV2Address = await consumerV2.getAddress();
    await coordinator.addConsumer(1, consumerV2Address);
  }

  beforeEach(async () => {
    await setup();
    await ethers.provider.send("hardhat_reset", []);
    const FlipCoin = await ethers.getContractFactory("FlipCoin", owner);
    flipcoin = await FlipCoin.deploy(
      1685,
      "0x6a2aad07396b36fe02a22b33cf443582f682c82f",
    );
    flipcoinAddress = await flipcoin.getAddress();
    console.log(flipcoinAddress);
  });

  it("Should flip", async () => {
    await alice.sendTransaction({
      to: flipcoinAddress,
      value: parseEther(5),
    });

    ethers.provider.getBalance(flipcoinAddress).then(console.log);

    let res = await flipcoin.connect(alice).flip(0, { value: parseEther(0.5) });

    console.log(res);
  });
});
