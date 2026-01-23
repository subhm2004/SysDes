export type ComponentCategory =
  | "networking"
  | "compute"
  | "storage"
  | "messaging"
  | "infrastructure";

export interface SystemComponent {
  id: string;
  label: string;
  category: ComponentCategory;
  icon: string; // lucide icon name
  maxQPS: number;
  latencyMs: number;
  scalable: boolean;
  stateful: boolean;
  description: string;
}
