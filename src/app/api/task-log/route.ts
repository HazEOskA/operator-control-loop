import { NextResponse } from "next/server";
import { readTaskLog } from "@/core/executor";

export async function GET() {
  try {
    const log = readTaskLog();
    return NextResponse.json(log);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Failed to read log";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
