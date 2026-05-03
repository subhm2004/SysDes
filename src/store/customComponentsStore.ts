import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SystemComponent, ComponentCategory } from "@/types/component";

export interface CustomComponent extends SystemComponent {
  custom: true;
  createdAt: string;
}

interface CustomComponentsState {
  components: CustomComponent[];
  addComponent: (
    component: Omit<SystemComponent, "id"> & { id?: string },
  ) => string;
  updateComponent: (id: string, updates: Partial<SystemComponent>) => void;
  deleteComponent: (id: string) => void;
  getComponent: (id: string) => CustomComponent | undefined;
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32) || "component";
}

export const useCustomComponentsStore = create<CustomComponentsState>()(
  persist(
    (set, get) => ({
      components: [],

      addComponent: (component) => {
        const baseId = component.id ?? `custom-${slugify(component.label)}`;
        const existing = new Set(get().components.map((c) => c.id));
        let id = baseId;
        let i = 2;
        while (existing.has(id)) {
          id = `${baseId}-${i++}`;
        }
        const next: CustomComponent = {
          ...component,
          id,
          custom: true,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ components: [next, ...s.components] }));
        return id;
      },

      updateComponent: (id, updates) => {
        set((s) => ({
          components: s.components.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        }));
      },

      deleteComponent: (id) => {
        set((s) => ({
          components: s.components.filter((c) => c.id !== id),
        }));
      },

      getComponent: (id) => get().components.find((c) => c.id === id),
    }),
    { name: "sysdes-custom-components" },
  ),
);

export type { ComponentCategory };
