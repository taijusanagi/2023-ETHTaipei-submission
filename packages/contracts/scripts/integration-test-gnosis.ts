import { ethers, network } from "hardhat";
import { Identity } from "@semaphore-protocol/identity";
import deploymentsJson from "../deployments.json";
import { Group } from "@semaphore-protocol/group";
import { config } from "../package.json";
import { generateProof } from "@semaphore-protocol/proof";

async function main() {
  const [signer] = await ethers.getSigners();
  const signerAddress = "signer.address";
  console.log("signer.address", signer.address);
  const VerifiedAnonymous = await ethers.getContractFactory("VerifiedAnonymous");
  const vaContract = await VerifiedAnonymous.attach(deploymentsJson.gnosis.verifiedAnonymous);
  const eventId = "123790";
  const tokenId = "6578629";
  const user = new Identity();
  const commitment = user.commitment.toString();
  const group = new Group(eventId);
  const createEventTx = await vaContract.createEvent(eventId, "");
  await createEventTx.wait();
  console.log("createEventTx", createEventTx.hash);
  const verifyAndJoinEventTx = await vaContract.verifyAndJoinEvent(commitment, tokenId);
  await verifyAndJoinEventTx.wait();
  console.log("verifyAndJoinEventTx", verifyAndJoinEventTx.hash);
  const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`;
  const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`;

  group.addMember(commitment);

  const review = ethers.utils.formatBytes32String("Good");
  const fullProof = await generateProof(user, group, eventId, review, {
    wasmFilePath,
    zkeyFilePath,
  });

  const sendReviewTx = await vaContract.sendReview(
    eventId,
    review,
    fullProof.merkleTreeRoot,
    fullProof.nullifierHash,
    fullProof.proof
  );
  await sendReviewTx.wait();
  console.log("sendReviewTx", sendReviewTx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
