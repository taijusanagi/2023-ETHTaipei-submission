import { task, types } from "hardhat/config";

import fs from "fs";
import path from "path";

import deployments from "../deployments.json";

task("deploy", "Deploy a Feedback contract")
  .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
  .addOptionalParam("xpoap", "XPOAP contract address", undefined, types.string)
  .addOptionalParam("logs", "Print the logs", true, types.boolean)
  .setAction(async ({ logs, semaphore: semaphoreAddress, xpoap: xpoapAddress }, { ethers, run, network }) => {
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

      // #1 of hardhat node default accounts
      const testXPOAPHolderAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      const testGroupId = "1";
      const testTokenId = "1";

      await xpoapContract.setOwnerOf(testGroupId, testXPOAPHolderAddress);
      await xpoapContract.setTokenEvent(testTokenId, testGroupId);
    }

    const VerifiedAnonymous = await ethers.getContractFactory("VerifiedAnonymous");
    const verifiedAnonymous = await VerifiedAnonymous.deploy(semaphoreAddress, xpoapAddress);
    await verifiedAnonymous.deployed();
    const verifiedAnonymousAddress = verifiedAnonymous.address;

    if (logs) {
      console.info(`VerifiedAnonymous contract has been deployed to: ${verifiedAnonymousAddress}`);
    }

    const result = {
      ...deployments,
      [network.name]: {
        semaphore: semaphoreAddress,
        xpoap: xpoapAddress,
        verifiedAnonymous: verifiedAnonymousAddress,
      },
    };

    fs.writeFileSync(path.join(__dirname, `../deployments.json`), JSON.stringify(result));

    return;
  });
