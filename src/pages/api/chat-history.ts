// pages/api/chat-history.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "userId es requerido" });

    const client = await clientPromise;
    const db = client.db("myGptDB");

    const messages = await db.collection("chats")
      .find({ userId })
      .sort({ timestamp: 1 })
      .toArray();

    res.status(200).json({ messages });
  } catch (err) {
    console.error("Error cargando historial:", err);
    res.status(500).json({ error: "Error cargando historial" });
  }
}
