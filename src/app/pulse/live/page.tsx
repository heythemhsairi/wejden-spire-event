import type { Metadata } from "next";
import { getActiveSessionId } from "@/lib/session";
import { LiveWall } from "./live-wall";

export const metadata: Metadata = {
  title: "Live Workforce Pulse — WejdenSpire",
};

export default async function LiveWallPage() {
  const sessionId = await getActiveSessionId();
  return <LiveWall sessionId={sessionId} />;
}
