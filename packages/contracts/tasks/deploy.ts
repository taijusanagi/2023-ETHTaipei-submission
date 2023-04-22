import { task, types } from "hardhat/config";

task("deploy", "Deploy a Feedback contract")
  .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
  .addOptionalParam("xpoap", "XPOAP contract address", undefined, types.string)
  .addOptionalParam("logs", "Print the logs", true, types.boolean)
  .setAction(async ({ logs, semaphore: semaphoreAddress, xpoap: xpoapAddress }, { ethers, run }) => {
    if (!semaphoreAddress) {
      const { semaphore } = await run("deploy:semaphore", {
        logs,
      });
      semaphoreAddress = semaphore.address;
    }

    if (!xpoapAddress) {
      const MockXPOAP = await ethers.getContractFactory("MockXPOAP");
      const xpoapContract = await MockXPOAP.deploy();
      xpoapAddress = xpoapContract.address;
      if (logs) {
        console.log("XPOAP has been deployed to:", xpoapAddress);
      }
    }

    const VerifiableAnonymous = await ethers.getContractFactory("VerifiableAnonymous");
    const feedbackContract = await VerifiableAnonymous.deploy(semaphoreAddress, xpoapAddress);

    await feedbackContract.deployed();

    if (logs) {
      console.info(`Feedback contract has been deployed to: ${feedbackContract.address}`);
    }

    return feedbackContract;
  });
