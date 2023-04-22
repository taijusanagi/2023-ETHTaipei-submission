import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof } from "@semaphore-protocol/proof";
import { expect } from "chai";
import { formatBytes32String } from "ethers/lib/utils";
import { run, ethers } from "hardhat";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: typechain folder will be generated after contracts compilation
import { VerifiableAnonymous, MockXPOAP } from "../build/typechain";
import { config } from "../package.json";
import { Signer } from "ethers";

describe("VerifiableAnonymous", () => {
  let xpoapContract: MockXPOAP;
  let vaContract: VerifiableAnonymous;
  let semaphoreContract: string;
  let withXPOAPSigner: Signer;
  let withoutXPOAPSigner: Signer;

  const validTokenId = "1";
  const invalidTokenId = "9";
  const groupId = "42";
  const group = new Group(groupId);

  let registeredUser: Identity;
  let notRegisteredUser: Identity;

  before(async () => {
    const { semaphore } = await run("deploy:semaphore", {
      logs: false,
    });

    semaphoreContract = semaphore;

    const MockXPOAP = await ethers.getContractFactory("MockXPOAP");
    xpoapContract = await MockXPOAP.deploy();

    const VerifiableAnonymous = await ethers.getContractFactory("VerifiableAnonymous");
    vaContract = await VerifiableAnonymous.deploy(semaphore.address, xpoapContract.address);

    await vaContract.createEvent(groupId);

    registeredUser = new Identity();
    notRegisteredUser = new Identity();

    [, withXPOAPSigner, withoutXPOAPSigner] = await ethers.getSigners();

    await xpoapContract.setOwnerOf(validTokenId, await withXPOAPSigner.getAddress());
    await xpoapContract.setTokenEvent(validTokenId, groupId);
  });

  describe("# verifyAndJoinEvent", () => {
    it("Should allow users to join the group when user has POAP", async () => {
      const transaction = vaContract
        .connect(withXPOAPSigner)
        .verifyAndJoinEvent(registeredUser.commitment, validTokenId);
      group.addMember(registeredUser.commitment);
      await expect(transaction)
        .to.emit(semaphoreContract, "MemberAdded")
        .withArgs(groupId, 0, registeredUser.commitment, group.root);
    });

    it("Should not allow users to join the group when user does not have POAP", async () => {
      const transaction = vaContract
        .connect(withoutXPOAPSigner)
        .verifyAndJoinEvent(notRegisteredUser.commitment, validTokenId);
      await expect(transaction).to.revertedWith("VerifiableAnonymous: msg sender is invalid");
    });
  });

  describe("# sendReview", () => {
    const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`;
    const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`;

    it("Should allow users to send feedback anonymously", async () => {
      const review = formatBytes32String("Good");
      const fullProof = await generateProof(registeredUser, group, groupId, review, {
        wasmFilePath,
        zkeyFilePath,
      });
      const transaction = vaContract.sendReview(
        groupId,
        review,
        fullProof.merkleTreeRoot,
        fullProof.nullifierHash,
        fullProof.proof
      );
      await expect(transaction)
        .to.emit(semaphoreContract, "ProofVerified")
        .withArgs(groupId, fullProof.merkleTreeRoot, fullProof.nullifierHash, groupId, fullProof.signal);
    });
  });
});
