import { useEffect, useState } from "react";

import type { ModifierGroup, Modifiers } from "../menu.types";

export type FlatModifier = {
  groupId: string;
  optionId: string;
  name: string;
  price: number;
};

const getModifierGroups = (modifiers: Modifiers): [string, ModifierGroup][] =>
  (Object.entries(modifiers) as [string, ModifierGroup | undefined][]).filter(
    (entry): entry is [string, ModifierGroup] => Boolean(entry[1]),
  );

interface UseModifiersModalParams {
  isOpen: boolean;
  modifiers: Modifiers;
  basePrice: number;
  quantity: number;
  onAddItem: (modifiers: FlatModifier[]) => void;
  onClose: () => void;
}

export const useModifiersModal = ({
  isOpen,
  modifiers,
  basePrice,
  quantity,
  onAddItem,
  onClose,
}: UseModifiersModalParams) => {
  const [currentSelected, setCurrentSelected] = useState<Record<string, Set<string>>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentSelected({});
      setCurrentStep(0);
      setConfirmedTotal(0);
    }
  }, [isOpen]);

  const groups = getModifierGroups(modifiers);

  const getExtraPrice = (selection: Record<string, Set<string>>) =>
    groups.reduce((total, [key, group]) => {
      const sel = selection[key];
      if (!sel) return total;
      return (
        total +
        group.options
          .filter((opt) => sel.has(opt.id))
          .reduce((sum, opt) => sum + opt.price, 0)
      );
    }, 0);

  const additionalPriceCurrent = getExtraPrice(currentSelected);
  const runningTotal = confirmedTotal + basePrice + additionalPriceCurrent;

  const isCurrentStepValid = groups.every(([key, group]) => {
    if (!group.required) return true;
    return (currentSelected[key]?.size ?? 0) > 0;
  });

  const isLastStep = currentStep === quantity - 1;

  const toggle = (groupKey: string, optionId: string, max?: number) => {
    setCurrentSelected((prev) => {
      const current = new Set(prev[groupKey] ?? []);
      if (current.has(optionId)) {
        current.delete(optionId);
      } else {
        if (max === 1) current.clear();
        if (!max || current.size < max) current.add(optionId);
      }
      return { ...prev, [groupKey]: current };
    });
  };

  const buildFlat = (): FlatModifier[] => {
    const flat: FlatModifier[] = [];
    for (const [groupId, set] of Object.entries(currentSelected)) {
      const group = modifiers[groupId as keyof typeof modifiers];
      for (const optionId of set) {
        const option = group?.options.find((o) => o.id === optionId);
        flat.push({
          groupId,
          optionId,
          name: option?.name ?? optionId,
          price: option?.price ?? 0,
        });
      }
    }
    return flat;
  };

  const handleNext = () => {
    if (!isCurrentStepValid) return;
    onAddItem(buildFlat());
    setConfirmedTotal((t) => t + basePrice + additionalPriceCurrent);
    setCurrentSelected({});
    setCurrentStep((s) => s + 1);
  };

  const handleConfirm = () => {
    if (!isCurrentStepValid) return;
    onAddItem(buildFlat());
    onClose();
  };

  return {
    groups,
    currentSelected,
    currentStep,
    runningTotal,
    additionalPriceCurrent,
    isCurrentStepValid,
    isLastStep,
    toggle,
    handleNext,
    handleConfirm,
  };
};
