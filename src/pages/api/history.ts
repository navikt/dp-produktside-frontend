import type { NextApiRequest, NextApiResponse } from "next";
import { historyFetcher } from "sanity/groq/historyFetcher";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { requestId, revisionId },
  } = req;

  const response = await historyFetcher(requestId, revisionId);

  res.status(200).send(response);
}
