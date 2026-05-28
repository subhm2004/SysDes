"use client";

import type { ReactNode } from "react";
import { StudioGuard } from "@/components/auth/StudioGuard";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <StudioGuard>
      <div className="studio-app h-dvh overflow-hidden">{children}</div>
    </StudioGuard>
  );
}
