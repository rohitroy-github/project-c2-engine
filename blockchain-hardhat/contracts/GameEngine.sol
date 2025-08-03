// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GameToken.sol";
import "./GameNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title GameEngine - Manages tournament logic, token rewards, and NFT minting for a blockchain game.
contract GameEngine is Ownable {
    // ERC20 Game Token contract
    GameToken public gameToken;
    // ERC721 NFT contract
    GameNFT public gameNFT;
    // Constants
    uint256 public constant TOURNAMENT_ENTRY_FEE = 25 * 10 ** 18; // Entry fee in FUEL
    uint256 public constant INITIAL_MINT = 75 * 10 ** 18; // Initial tokens minted on registration
    uint256 public constant MAX_ALLOWED_TOKENS = 500 * 10 ** 18; // Max (500) tokens allowed per wallet
    uint256 public ethToTokenRate = 5000;

    // Keeps track of the total tokens collected as tournament entry fees
    uint256 public currentTournamentFeePool;

    // Events for transparency and logging
    event RegistrationBalanceTransferred(address user);
    event TournamentFeeDeducted(address user);
    event WinnerRewarded(address winner);
    event TokensPurchased(address buyer, uint256 ethAmount, uint256 tokens);
    event NFTClaimed(address indexed to, uint8 level);

    event TournamentRewardsDistributed(
        uint256 indexed tournamentId,
        address indexed first,
        address indexed second,
        address third,
        uint256 firstReward,
        uint256 secondReward,
        uint256 thirdReward
    );

    /// @notice Constructor to initialize the contract with token and NFT contract addresses.
    /// @param _tokenAddress Address of the deployed GameToken contract.
    /// @param _nftAddress Address of the deployed GameNFT contract.
    constructor(address _tokenAddress, address _nftAddress) {
        gameToken = GameToken(_tokenAddress);
        gameNFT = GameNFT(_nftAddress);
    }

    /// @notice Register a new user by minting 75 tokens to their wallet.
    function registerUser() external {
        gameToken.mint(msg.sender, INITIAL_MINT);
        emit RegistrationBalanceTransferred(msg.sender);
    }

    /// @notice Allows a user to enter a tournament by paying the entry fee.
    /// The fee is transferred from the user to the contract and added to the prize pool.
    function enterTournament() external {
        require(
            gameToken.balanceOf(msg.sender) >= TOURNAMENT_ENTRY_FEE,
            "Not enough tokens"
        );
        gameToken.transferFrom(msg.sender, address(this), TOURNAMENT_ENTRY_FEE);
        currentTournamentFeePool += TOURNAMENT_ENTRY_FEE;
        emit TournamentFeeDeducted(msg.sender);
    }

    /// @notice Allows a user to claim an NFT of a specific level.
    /// @param level The level of the NFT to mint.
    /// @dev Anyone can call this function; NFT will be minted to caller's address.
    function claimNFT(uint8 level) external {
        gameNFT.mintWithLevel(msg.sender, level);
        emit NFTClaimed(msg.sender, level);
    }

    /// @dev Only callable by the owner (off-chain automation needed for scheduling).
    /// @param tournamentId ID of the tournament.
    /// @param firstPlace Address of the 1st place winner.
    /// @param secondPlace Address of the 2nd place winner.
    /// @param thirdPlace Address of the 3rd place winner.
    function distributeRewards(
        uint256 tournamentId,
        address firstPlace,
        address secondPlace,
        address thirdPlace
    ) external onlyOwner {
        require(currentTournamentFeePool > 0, "No tournament pool available");

        // 30% of the pool to first place
        uint256 firstReward = (currentTournamentFeePool * 30) / 100;

        // 75% and 25% refunds of the entry fee to second and third places respectively
        uint256 secondReward = (TOURNAMENT_ENTRY_FEE * 75) / 100;
        uint256 thirdReward = (TOURNAMENT_ENTRY_FEE * 25) / 100;

        // Transfer rewards
        gameToken.transfer(firstPlace, firstReward);
        gameToken.transfer(secondPlace, secondReward);
        gameToken.transfer(thirdPlace, thirdReward);

        // Mint NFT for the 1st place winner at level 0 via claimNFT function
        gameNFT.mintWithLevel(firstPlace, 1);

        // Reset the pool for next tournament
        currentTournamentFeePool = 0;

        // Emit the reward distribution event
        emit TournamentRewardsDistributed(
            tournamentId,
            firstPlace,
            secondPlace,
            thirdPlace,
            firstReward,
            secondReward,
            thirdReward
        );
    }

    /// @notice Allows users to buy GameTokens using ETH.
    /// Tokens are minted at a fixed conversion rate.
    function buyTokens() external payable {
        require(msg.value > 0, "Send ETH to buy tokens");

        uint256 tokens = msg.value * ethToTokenRate;
        uint256 currentBalance = gameToken.balanceOf(msg.sender);

        // Only one require to check if purchase will push balance over max allowed
        require(
            currentBalance + tokens <= MAX_ALLOWED_TOKENS,
            "Purchase exceeds maximum token limit of 500"
        );

        gameToken.mint(msg.sender, tokens);
        emit TokensPurchased(msg.sender, msg.value, tokens);
    }

    /// @notice Withdraw accumulated ETH from the contract.
    /// @dev Only the owner can call this.
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
