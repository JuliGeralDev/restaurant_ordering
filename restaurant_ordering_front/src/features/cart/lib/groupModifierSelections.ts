import type { FlatModifier } from "@/features/menu/hooks/useModifiersModal";

export interface GroupedModifierSelection {
  quantity: number;
  modifiers: FlatModifier[];
}

const buildSelectionKey = (selection: FlatModifier[]) =>
  selection
    .map((modifier) => `${modifier.groupId}:${modifier.optionId}`)
    .sort()
    .join("|");

export const groupModifierSelections = (selections: FlatModifier[][]) =>
  selections.reduce<Map<string, GroupedModifierSelection>>(
    (accumulator, currentSelection) => {
      const key = buildSelectionKey(currentSelection);
      const existing = accumulator.get(key);

      if (existing) {
        existing.quantity += 1;
        return accumulator;
      }

      accumulator.set(key, {
        quantity: 1,
        modifiers: currentSelection,
      });
      return accumulator;
    },
    new Map(),
  );
