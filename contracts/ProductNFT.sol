// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProductNFT is ERC721, Ownable {
    uint256 private _tokenIds;
    
    enum Status { Created, Verified, Finalized }
    
    struct Product {
        string batchId;
        string certification;
        string origin;
        uint256 timestamp;
        address owner;
        Status status;
    }
    
    mapping(uint256 => Product) private _products;
    
    event ProductMinted(uint256 indexed productId, address indexed owner);
    event ProductVerified(uint256 indexed productId);
    event ProductFinalized(uint256 indexed productId);
    
    constructor() ERC721("ProductNFT", "PNFT") Ownable(msg.sender) {}
    
    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    // Manufacturer role - Mint new product
    function mintNFT(
        string memory batchId,
        string memory certification,
        string memory origin,
        uint256 timestamp
    ) public returns (uint256) {
        _tokenIds++;
        uint256 newProductId = _tokenIds;
        
        _mint(msg.sender, newProductId);
        
        _products[newProductId] = Product({
            batchId: batchId,
            certification: certification,
            origin: origin,
            timestamp: timestamp,
            owner: msg.sender,
            status: Status.Created
        });
        
        emit ProductMinted(newProductId, msg.sender);
        
        return newProductId;
    }
    
    // Distributor role - Verify product
    function verifyProduct(uint256 productId) public {
        require(exists(productId), "Product does not exist");
        require(_products[productId].status == Status.Created, "Product must be in Created state");
        
        _products[productId].status = Status.Verified;
        
        emit ProductVerified(productId);
    }
    
    // Retailer role - Finalize product
    function finalizeProduct(uint256 productId) public {
        require(exists(productId), "Product does not exist");
        require(_products[productId].status == Status.Verified, "Product must be in Verified state");
        
        _products[productId].status = Status.Finalized;
        
        emit ProductFinalized(productId);
    }
    
    function getProductById(uint256 productId) public view returns (
        string memory batchId,
        string memory certification,
        string memory origin,
        uint256 timestamp,
        address owner,
        Status status
    ) {
        require(exists(productId), "Product does not exist");
        Product memory product = _products[productId];
        return (
            product.batchId,
            product.certification,
            product.origin,
            product.timestamp,
            product.owner,
            product.status
        );
    }
}