// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";
import { join } from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { identityString, groupId, members, bytes32StringReview } = req.body;
  console.log(req.headers.host);

  const identity = new Identity(identityString);
  const group = new Group(groupId);
  group.addMembers(members);

  const wasmFilePath = join(process.cwd(), "src", "pages", "api", "snark-artifacts", "semaphore.wasm");
  const zkeyFilePath = join(process.cwd(), "src", "pages", "api", "snark-artifacts", "semaphore.zkey");

  const fullProof = await generateProof(identity, group, groupId, bytes32StringReview, {
    wasmFilePath,
    zkeyFilePath,
  });
  res.status(200).json({ fullProof });
}
