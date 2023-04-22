//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../interfaces/IXPOAP.sol";

contract MockXPOAP is IXPOAP {
    mapping(uint256 => address) ownerOfs;
    mapping(uint256 => uint256) tokenEvents;

    function setOwnerOf(uint256 tokenId, address ownerAddress) external {
        ownerOfs[tokenId] = ownerAddress;
    }

    function setTokenEvent(uint256 tokenId, uint256 eventId) external {
        tokenEvents[tokenId] = eventId;
    }

    function ownerOf(uint256 tokenId) external override view returns (address ownerAddress) {
        return ownerOfs[tokenId];
    }

    function tokenEvent(uint256 tokenId) external override view returns (uint256 eventId) {
        return tokenEvents[tokenId];
    }
}