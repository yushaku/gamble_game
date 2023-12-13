import FlipCoinAbi from "../contracts/abis/flip_coin.json";
import getChainIdFromEnv from "./getEnv";

export const NUMBER_PATTERN = "/^[0-9]*.?[0-9]*$/";
export const IPT_PRICE = 0.2;

export const menus = [
  { name: "PLAY", url: "/" },
  { name: "REWARDS", url: "/rewards" },
];

export const CHOOSE_BEST = [0.05, 0.1, 0.25, 0.5, 0.75, 1, 2, 3];

export type AddressType = {
  97: string;
  56: string;
};

export const ChainId = {
  BNB: 56,
  tBNB: 97,
};

export const SMART_ADDRESS = {
  FLIP_COIN: {
    97: "0x9DbCb54A1732AcaA7aF9E253298083163cAe7dA3",
    56: "",
  },
};
const getAddress = (address: AddressType) => {
  const CHAIN_ID = getChainIdFromEnv() as keyof AddressType;
  return address[CHAIN_ID];
};

export const getFlipCoinAbi = () => FlipCoinAbi;
export const getFlipCoinAddress = () => getAddress(SMART_ADDRESS.FLIP_COIN);
