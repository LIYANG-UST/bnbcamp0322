// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyPunks is ERC721 {
    // ************* //
    // * Variables * //
    // ************* //

    address public owner;
    uint256 public counter;

    mapping(address => bool) public isWhitelisted;
    mapping(address => uint256) public userTokenId;

    // ********** //
    // * Events * //
    // ********** //

    event NewWhitelistAdded(address user);
    event NewPunkMinted(address user, uint256 tokenId);
    event PunkBurned(address user, uint256 tokenId);

    // *************** //
    // * Constructor * //
    // *************** //

    constructor() ERC721("MyPunks", "PUNK") {
        owner = msg.sender;
    }

    // ************* //
    // * Modifiers * //
    // ************* //

    /// @notice Only owner can call some functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /// @notice Only whitelisted users can call some functions
    modifier onlyWhitelisted() {
        require(isWhitelisted[msg.sender], "Not whitelisted");
        _;
    }

    /// @notice Add a new user to the whitelist
    function addWhitelist(address _user) external onlyOwner {
        isWhitelisted[_user] = true;
        emit NewWhitelistAdded(_user);
    }

    // ************* //
    // * Functions * //
    // ************* //

    /// @notice Mint a punk
    function mint() external onlyWhitelisted {
        require(userTokenId[msg.sender] == 0, "Already minted");

        uint256 tokenId = ++counter;
        _safeMint(msg.sender, tokenId);

        userTokenId[msg.sender] = tokenId;

        emit NewPunkMinted(msg.sender, tokenId);
    }

    /// @notice Burn a punk
    function burn(address _user) external onlyOwner {
        uint256 tokenId = userTokenId[_user];
        _burn(tokenId);

        delete userTokenId[_user];

        emit PunkBurned(_user, tokenId);
    }

    /// @notice Some restrictions for the transfer
    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256,
        uint256
    ) internal pure override {
        // 要求接受者或发送者是0地址 => 不能转移
        require(
            _from == address(0) || _to == address(0),
            "Transfer not allowed"
        );
    }
}
