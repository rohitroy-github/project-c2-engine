// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title GameNFT - Soulbound NFT contract for game achievements (minted by GameEngine)
contract GameNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Level => metadata URI (e.g. ipfs://Qm.../beginner.json)
    mapping(uint8 => string) public levelMetadataURIs;

    // tokenId => level
    mapping(uint256 => uint8) private _tokenLevels;

    // tokenId => URI
    mapping(uint256 => string) private _tokenURIs;

    event NFTMinted(address indexed to, uint256 indexed tokenId, uint8 level);

    constructor() ERC721("Clash NFT", "CLASHNFT") {}

    /// @notice Set metadata URI for a given level
    function setLevelMetadataURI(uint8 level, string calldata uri) external onlyOwner {
        levelMetadataURIs[level] = uri;
    }

    /// @notice Mint an NFT for a user with a specific level (only callable by GameEngine/owner)
    function mintWithLevel(address to, uint8 level) external onlyOwner {
        require(bytes(levelMetadataURIs[level]).length > 0, "Metadata not set for level");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _tokenLevels[tokenId] = level;
        _tokenURIs[tokenId] = levelMetadataURIs[level];

        emit NFTMinted(to, tokenId, level);
    }

    /// @notice Get the level of a given token
    function tokenLevel(uint256 tokenId) external view returns (uint8) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenLevels[tokenId];
    }

    /// @notice Get the URI of a given token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    /// @notice Prevent all transfers (soulbound logic)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        // Allow minting and burning, disallow transfers
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: Transfers not allowed");
        }
    }

    /// @notice Prevent approvals
    function approve(address, uint256) public pure override {
        revert("Soulbound: Approvals disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound: Approvals disabled");
    }
}




// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

// contract GameNFT is ERC721, Ownable {
//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIdCounter;

//     string private _baseTokenURI;

//     event NFTMinted(address indexed to, uint256 indexed tokenId);

//     constructor(string memory baseURI) ERC721("Clash NFT", "CLASHNFT") {
//         _baseTokenURI = baseURI;
//     }

//     function mint(address to) external onlyOwner {
//         uint256 tokenId = _tokenIdCounter.current();
//         _tokenIdCounter.increment();
//         _mint(to, tokenId);

//         emit NFTMinted(to, tokenId);
//     }

//     function nextTokenId() external view returns (uint256) {
//         return _tokenIdCounter.current();
//     }

//     // Override tokenURI to use base URI + tokenId pattern
//     function _baseURI() internal view override returns (string memory) {
//         return _baseTokenURI;
//     }
// }
