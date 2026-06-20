import type { Metadata } from "next";
import { PulseInput } from "./pulse-input";

export const metadata: Metadata = {
  title: "Live Human Signal — WejdenSpire",
  description: "30 seconds. 5 signals. Feed the live workforce pulse of the room.",
};

export default function PulsePage() {
  return <PulseInput />;
}
