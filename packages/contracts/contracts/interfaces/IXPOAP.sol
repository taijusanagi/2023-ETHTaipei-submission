// Copied from https://gnosisscan.io/address/0xa178b166bea52449d56895231bb1194f20c2f102#code
// Only minimum code was prepared.

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IXPOAP {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function tokenEvent(uint256 tokenId) external view returns (uint256);
}