// pages/api/history.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Chat {
  _id: ObjectId;
  prompt: string;
  reply: string;
  source: string;
  createdAt: Date;
  __v?: number;
}

interface ResponseData {
  chats?: Chat[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const collection = db.collection<Chat>("chats");

    const { userId } = req.query;

    let query = {};
    // Si recibimos userId o sessionId, filtramos por eso
    if (userId) {
      query = { sessionId: userId }; // <- si agregas sessionId en tu colección
    }

    const chats = await collection.find(query).sort({ createdAt: -1 }).toArray();

    return res.status(200).json({ chats });
  } catch (err) {
    console.error("❌ Error fetching chat history:", err);
    return res.status(500).json({ error: "Error fetching chat history" });
  }
}
