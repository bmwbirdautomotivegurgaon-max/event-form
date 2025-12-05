// pages/api/submit-form.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/app/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const { name, email, message } = req.body;

    const result = await db.collection("form_submissions").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    return res.status(200).json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }
}
