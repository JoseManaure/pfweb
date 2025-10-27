import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ messages: [] });

  const client = await clientPromise;
  const db = client.db("portfolio");
  const chat = await db.collection("chats").findOne({ userId });

  return NextResponse.json({ messages: chat?.messages || [] });
}
