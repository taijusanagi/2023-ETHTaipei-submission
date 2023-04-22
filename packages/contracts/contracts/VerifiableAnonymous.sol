//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "./interfaces/IXPOAP.sol";

contract VerifiableAnonymous {
    ISemaphore public semaphore;
    IXPOAP public xpoap;

    constructor(address semaphoreAddress, address xpoapAddress) {
        semaphore = ISemaphore(semaphoreAddress);
        xpoap = IXPOAP(xpoapAddress);
    }

    function createGroup(uint256 eventId) external {
        // I need to check what merkleTreeDepth is.
        semaphore.createGroup(eventId, 20, address(this));
    }

    function joinGroup(uint256 identityCommitment, uint256 tokenId) external {
        require(xpoap.ownerOf(tokenId) == msg.sender, "VerifiableAnonymous: msg sender is invalid");
        // This on-chain verification connects a commitment to a token ID.
        uint256 eventId = xpoap.tokenEvent(tokenId);   
        semaphore.addMember(eventId, identityCommitment);
    }

    function sendReview(
        uint256 eventId,
        uint256 review,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        // I need to check what externalNullifier is.
        semaphore.verifyProof(eventId, merkleTreeRoot, review, nullifierHash, eventId, proof);
    }
}
