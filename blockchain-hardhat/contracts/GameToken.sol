// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/// @title GameToken (CLASH) - An ERC20 token used in the Clash Game ecosystem
/// @notice This token is mintable by the owner and can be paused for emergency control
contract GameToken is ERC20, Ownable, Pausable {
    /// @notice Emitted when new tokens are minted
    event TokensMinted(address indexed to, uint256 amount);

    /// @notice Deploys the token contract
    /// @dev Sets token name to "Clash Token" and symbol to "CLASH"
    constructor() ERC20("Clash Token", "CLASH") {}

    /// @notice Mints new tokens to a specified address
    /// @dev Only callable by the owner (typically the GameEngine contract)
    /// @param to The address to receive the minted tokens
    /// @param amount The amount of tokens to mint (in wei)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /// @notice Pauses all token transfers
    /// @dev Useful during emergencies or maintenance
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Resumes token transfers after a pause
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Override of the ERC20 hook to block transfers when paused
    /// @dev Ensures no tokens can be transferred while paused, including minting and burning
    /// @param from Sender address
    /// @param to Recipient address
    /// @param amount Number of tokens being transferred
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
