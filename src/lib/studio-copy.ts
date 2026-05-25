/**
 * Studio UI copy — edit strings here to change labels across the app.
 * Component-specific hints in data/*.ts and dialogs may still have local text.
 */
export const STUDIO_COPY = {
  brand: {
    /** Subtitle under the logo in the top bar */
    tagline: "System Designer",
  },
  leftSidebar: {
    tabs: {
      components: "Components",
      problems: "Problems",
      learn: "Learn",
    },
    palette: {
      searchPlaceholder: "Search components…",
      createCustom: "Create custom component",
      categories: {
        networking: "Networking",
        compute: "Compute",
        storage: "Storage",
        messaging: "Messaging",
        infrastructure: "Infrastructure",
      },
    },
  },
  rightPanel: {
    tabs: {
      properties: "Props",
      simulation: "Run",
      score: "Evaluate",
      capacity: "Capacity",
      tradeoffs: "Trade-offs",
    },
    requirementsTitle: (problemTitle: string) => `Requirements — ${problemTitle}`,
    sections: {
      constraints: "Constraints",
      hints: "Hints",
    },
  },
  toolbar: {
    run: "Run",
    runTitle: "Run load simulation (⌘↵)",
    evaluate: "Evaluate",
    evaluateTitle: "Evaluate design (⌘⇧S)",
    clearCanvas: "Clear canvas",
    loadReference: "Load reference solution",
    problemsLibrary: "Problems library",
  },
  canvas: {
    empty: {
      title: "Build an architecture that scales",
      subtitle:
        "Pick a problem, drop infrastructure components onto the canvas, and get scored the way an interviewer would evaluate you.",
    },
    quickStart: {
      pickProblem: { title: "Pick a problem", hint: "35 real interview questions" },
      loadReference: { title: "Load reference", hint: "Open a sample solution" },
      interview: { title: "Practice interview", hint: "Timed 6-phase mock" },
    },
    hints: {
      dragSidebar: "Drag from the sidebar",
      export: "export",
      simulate: "simulate",
    },
  },
  simulation: {
    run: "Run",
    running: "Running…",
    presets: {
      light: "Light",
      medium: "Medium",
      heavy: "Heavy",
      stress: "Stress",
    },
  },
  score: {
    emptyTitle: "Ready to evaluate",
    emptyBody: "Design your system on the canvas, then click",
    emptyCta: "Evaluate",
    emptySuffix: "in the toolbar to see how you did",
  },
  metrics: {
    emptyTitle: "No simulation data",
    emptyPrefix: "Configure load above and click",
    emptyCta: "Run",
    emptySuffix: "to see metrics",
  },
  shortcuts: {
    title: "Keyboard shortcuts",
    hint: "Press ? anytime in the studio to open this panel.",
    toolbarTitle: "Shortcuts",
    items: [
      {
        group: "Canvas",
        rows: [
          { label: "Delete selected node", keys: ["Delete"] },
          { label: "Pan canvas", keys: ["Middle drag"] },
        ],
      },
      {
        group: "Studio",
        rows: [
          { label: "Run simulation", keys: ["Mod", "Enter"] },
          { label: "Evaluate design", keys: ["Mod", "Shift", "S"] },
          { label: "Save design", keys: ["Mod", "S"] },
          { label: "Load design", keys: ["Mod", "O"] },
          { label: "Export PNG", keys: ["Mod", "E"] },
          { label: "Keyboard shortcuts", keys: ["?"] },
          { label: "Close panel / deselect", keys: ["Esc"] },
        ],
      },
    ],
  },
} as const;
