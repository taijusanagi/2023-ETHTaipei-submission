//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "./interfaces/IXPOAP.sol";

contract VerifiableAnonymous {
    ISemaphore public semaphore;
    IXPOAP public xpoap;

    mapping (uint256 => bool) public isGroupCreated;

    constructor(address semaphoreAddress, address xpoapAddress) {
        semaphore = ISemaphore(semaphoreAddress);
        xpoap = IXPOAP(xpoapAddress);
    }

    function createEvent(uint256 groupId) external {
        require(groupId > 0, "VerifiableAnonymous: group id is invalid");
        semaphore.createGroup(groupId, 20, address(this));
        isGroupCreated[groupId] = true;
    }

    function verifyAndJoinEvent(uint256 identityCommitment, uint256 tokenId) external {
        require(xpoap.ownerOf(tokenId) == msg.sender, "VerifiableAnonymous: msg sender is invalid");
        uint256 groupId = xpoap.tokenEvent(tokenId);
        require(isGroupCreated[groupId], "VerifiableAnonymous: event id is invalid");
        semaphore.addMember(groupId, identityCommitment);
    }

    function sendReview(
        uint256 groupId,
        uint256 review,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        semaphore.verifyProof(groupId, merkleTreeRoot, review, nullifierHash, groupId, proof);
    }
}
