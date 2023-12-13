//SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.19;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

import "./struct/Index.sol";

contract FlipCoin is VRFConsumerBaseV2, Ownable {
  using SafeERC20 for IERC20;
  VRFCoordinatorV2Interface COORDINATOR;

  /**
   * @dev INIT CHAINLINK INTERGRATION
   * https://docs.chain.link/vrf/v2/getting-started
   * For sepolia network
   */
  uint64 s_subscriptionId;
  address vrfCoordinator;
  bytes32 keyHash;
  uint32 callbackGasLimit = 300_000;
  uint16 requestConfirmations = 3;
  uint32 numWords = 1;

  // random number is { 0 => head, 1 => tail }
  uint256 public taxFee = 35; // 3,5 %
  uint256 public taxFeeMax = 50; // 10 %
  uint256 public totalRequest = 0;
  uint256 public totalWinCount = 0;
  uint256 public totalRemainBalance = 0;

  mapping(uint256 => requestInfor) public requestInfors;
  mapping(address => playerInfor) public playerInfors; // user address => Infor
  mapping(address => uint256[]) public players; // list request id

  event SetCoordinator(address setter, address newCoordinator);
  event SetTaxFee(address setter, uint256 newFee);
  event Flip(address player, uint256 bet, uint256 betAmount, uint256 requestId);
  event Result(
    address player,
    uint256 requestid,
    uint256 result,
    uint256 randomResult
  );
  event Claim(address player, uint256 amount);

  constructor(
    uint64 _subscriptionId,
    address _coordinator,
    bytes32 _keyHash
  ) VRFConsumerBaseV2(_coordinator) {
    COORDINATOR = VRFCoordinatorV2Interface(_coordinator);
    vrfCoordinator = _coordinator;
    s_subscriptionId = _subscriptionId;
    keyHash = _keyHash;
  }

  function setCoordinator(address newCoordinator) public onlyOwner {
    vrfCoordinator = newCoordinator;
    emit SetCoordinator(msg.sender, newCoordinator);
  }

  function setTaxFee(uint256 newFee) public onlyOwner {
    require(newFee <= taxFeeMax, "Fee out of range");
    taxFee = newFee;
    emit SetTaxFee(msg.sender, newFee);
  }

  function setKeyHash(bytes32 newHash) public onlyOwner {
    keyHash = newHash;
  }

  function setGasLimit(uint32 newGas) public onlyOwner {
    callbackGasLimit = newGas;
  }

  function flip(uint256 bet) public payable {
    uint256 amount = msg.value;
    require(msg.sender.balance >= amount, "Insufficient account balance");

    // value/(1000 + taxfee)*1000 = amount bet
    uint256 betAmount = (msg.value / (1000 + taxFee)) * 1000;
    uint256 fee = betAmount * (taxFee / 1000);
    uint256 neededBalance = betAmount * 2 + fee + totalRemainBalance; // balance need to pay for player
    require(
      address(this).balance >= neededBalance,
      "FlipCoin: Insufficient account balance"
    );

    uint256 up_or_down = random();

    //uint256 requestid =1;
    players[msg.sender].push(up_or_down);
    requestInfors[up_or_down].player = msg.sender;
    requestInfors[up_or_down].bet = bet;
    requestInfors[up_or_down].betAmount = betAmount;

    totalRequest += 1;
    playerInfors[msg.sender].total += 1;

    emit Flip(msg.sender, bet, betAmount, up_or_down);
  }

  // Will revert if subscription is not set and funded.
  function random() internal returns (uint256) {
    return
      COORDINATOR.requestRandomWords(
        keyHash,
        s_subscriptionId,
        requestConfirmations,
        callbackGasLimit,
        numWords
      );
  }

  function fulfillRandomWords(
    uint256 _requestId,
    uint256[] memory _randomWords
  ) internal override {
    uint result = _randomWords[0] % 2;
    requestInfors[_requestId].result = result;
    requestInfors[_requestId].hasResult = true;
    uint bet = requestInfors[_requestId].bet;
    uint256 betAmount = requestInfors[_requestId].betAmount;
    address player = requestInfors[_requestId].player;

    if (bet == result) {
      playerInfors[player].winCount += 1;
      playerInfors[player].balance += betAmount * 2;
      totalWinCount += 1;
      totalRemainBalance += betAmount * 2;
    }
    emit Result(player, _requestId, result, _randomWords[0]);
  }

  function claim() public {
    playerInfor storage playerinfor = playerInfors[msg.sender];
    uint256 amount = playerinfor.balance;
    require(amount > 0, "Insufficient account balance");
    require(
      address(this).balance >= amount,
      "FlipCoin: Insufficient account balance"
    );
    playerinfor.balance = 0;
    totalRemainBalance -= amount;
    payable(msg.sender).transfer(amount);
    emit Claim(msg.sender, amount);
  }

  function withdraw(uint256 amount) public onlyOwner {
    uint256 availableBalance = address(this).balance - totalRemainBalance;
    require(
      availableBalance >= amount,
      "FlipCoin: Insufficient account balance"
    );
    payable(msg.sender).transfer(amount);
  }

  receive() external payable {}
}
