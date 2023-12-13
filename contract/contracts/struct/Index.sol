//SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.19;

struct playerInfor {
  uint256 winCount;
  uint256 total;
  uint256 balance;
}

struct requestInfor {
  address player;
  uint256 bet;
  uint256 betAmount;
  uint result;
  bool hasResult;
}
