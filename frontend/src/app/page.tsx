import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "SysDes — Interview-grade system design studio",
  description:
    "Visual system design and simulation — canvas, load & latency simulation, trade-off scoring, and interview mode. Free, open source, self-hosted.",
};

export default function Home() {
  return <LandingPage />;
}
