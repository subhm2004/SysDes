import type { ReactNode } from "react";

export default function StudioLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="studio-app h-dvh overflow-hidden">{children}</div>;
}
