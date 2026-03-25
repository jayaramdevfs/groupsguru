/**
 * Shared animation presets — Claude Code philosophy: restrained, minimal.
 * Only used for modals, dropdowns, sidebar collapse. Pages render instantly.
 */

export const transition = {
  /** Modals, dropdowns — quick and clean */
  subtle: { duration: 0.15, ease: "easeOut" as const },
  /** Sidebar collapse — the only layout animation */
  layout: { duration: 0.2, ease: "easeOut" as const },
};

export const variants = {
  /** Modal enter/exit */
  modal: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  },
  /** Dropdown enter/exit */
  dropdown: {
    hidden: { opacity: 0, y: -4 },
    visible: { opacity: 1, y: 0 },
  },
};
