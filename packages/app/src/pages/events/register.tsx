import { useState } from "react";
import { Layout } from "@/components/Layout";

import VerifiedAnonymousJson from "../../../../contracts/build/contracts/contracts/VerifiedAnonymous.sol/VerifiedAnonymous.json";
import { useSigner } from "wagmi";
import { useIsConnected } from "@/hooks/useIsConnected";
import { useDeployments } from "@/hooks/useDeployments";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const RegisterEventPage = () => {
  const router = useRouter();

  const { data: signer } = useSigner();
  const { openConnectModal } = useConnectModal();

  const { isConnected } = useIsConnected();
  const { deployments } = useDeployments();

  const [groupId, setGroupId] = useState("");

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Register a New Event</h1>
        <form className="py-8 grid grid-cols-1 gap-4 sm:min-w-[30rem]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">POAP ID Associated with the Event</label>
            <input
              type="text"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 block w-full sm:text-sm border rounded-md py-3 px-2"
              placeholder="123790"
              onChange={(e) => setGroupId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 block w-full sm:text-sm border rounded-md py-3 px-2"
              placeholder="ETHTaipei"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <input
              type="text"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 block w-full sm:text-sm border rounded-md py-3 px-2"
              placeholder="Dive into the world of Ethereum in Taipei."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
            <textarea
              rows={5}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 block w-full sm:text-sm border rounded-md py-3 px-2"
              placeholder="ETHTaipei is an immersive hackathon that brings together Ethereum enthusiasts, developers, and industry leaders. Participants will work together to build cutting-edge decentralized applications while learning from experienced mentors. Don't miss this opportunity to be a part of the growing Ethereum community in Taipei!"
            />
          </div>
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail
            </label>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              accept="image/*"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 block w-full sm:text-sm border rounded-md py-3 px-2"
            />
          </div>
          <div>
            <label htmlFor="banner" className="block text-sm font-medium text-gray-700 mb-2">
              Banner
            </label>
            <input
              type="file"
              name="banner"
              id="banner"
              accept="image/*"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 block w-full sm:text-sm border rounded-md py-3 px-2"
            />
          </div>
          <div className="mt-4">
            {!isConnected && (
              <button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl"
                onClick={() => {
                  if (!openConnectModal) {
                    return;
                  }
                  openConnectModal();
                }}
              >
                Connect Wallet
              </button>
            )}
            {isConnected && deployments && signer && (
              <button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl"
                onClick={async () => {
                  const contract = new ethers.Contract(
                    deployments.verifiedAnonymous,
                    VerifiedAnonymousJson.abi,
                    signer
                  );
                  console.log("create event for poap id", groupId);
                  const tx = await contract.createEvent(groupId, "");
                  console.log("createEvent sent", tx.hash);
                  await tx.wait();
                  router.push(`/events/${groupId}`);
                }}
              >
                Create Project
              </button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default RegisterEventPage;
