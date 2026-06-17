import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard — SysDes",
  description: "Your system design practice progress, scores, and history.",
  robots: { index: false },
};

export default function Page() {
  return <DashboardPage />;
}
