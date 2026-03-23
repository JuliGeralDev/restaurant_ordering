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

const toSelectionMap = (modifiers: FlatModifier[]) =>
  modifiers.reduce<Record<string, Set<string>>>((accumulator, modifier) => {
    const current = accumulator[modifier.groupId] ?? new Set<string>();
    current.add(modifier.optionId);
    accumulator[modifier.groupId] = current;
    return accumulator;
  }, {});

const cloneSelectionMap = (selection: Record<string, Set<string>>) =>
  Object.fromEntries(
    Object.entries(selection).map(([groupId, optionIds]) => [
      groupId,
      new Set(optionIds),
    ]),
  );

interface UseModifiersModalParams {
  isOpen: boolean;
  modifiers: Modifiers;
  basePrice: number;
  quantity: number;
  initialSelections?: FlatModifier[][];
  onSubmit: (selections: FlatModifier[][]) => void | Promise<void>;
  onClose: () => void;
}

export const useModifiersModal = ({
  isOpen,
  modifiers,
  basePrice,
  quantity,
  initialSelections,
  onSubmit,
  onClose,
}: UseModifiersModalParams) => {
  const [stepSelections, setStepSelections] = useState<Record<string, Set<string>>[]>([]);
  const [currentSelected, setCurrentSelected] = useState<Record<string, Set<string>>>({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const nextSelections = Array.from({ length: quantity }, (_, index) =>
        toSelectionMap(initialSelections?.[index] ?? []),
      );
      setStepSelections(nextSelections);
      setCurrentSelected(cloneSelectionMap(nextSelections[0] ?? {}));
      setCurrentStep(0);
    }
  }, [initialSelections, isOpen, quantity]);

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
  const runningTotal = stepSelections.reduce((total, selection, index) => {
    const selectionToUse = index === currentStep ? currentSelected : selection;
    return total + basePrice + getExtraPrice(selectionToUse);
  }, 0);

  const isCurrentStepValid = groups.every(([key, group]) => {
    if (!group.required) return true;
    return (currentSelected[key]?.size ?? 0) > 0;
  });

  const isLastStep = currentStep === quantity - 1;

  const persistCurrentStep = () => {
    setStepSelections((previous) => {
      const next = [...previous];
      next[currentStep] = cloneSelectionMap(currentSelected);
      return next;
    });
  };

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

  const handleNext = () => {
    if (!isCurrentStepValid) return;
    const nextStep = currentStep + 1;
    const nextSelection = stepSelections[nextStep] ?? {};
    persistCurrentStep();
    setCurrentStep(nextStep);
    setCurrentSelected(cloneSelectionMap(nextSelection));
  };

  const handlePrevious = () => {
    if (currentStep === 0) return;
    const previousStep = currentStep - 1;
    const previousSelection = stepSelections[previousStep] ?? {};
    persistCurrentStep();
    setCurrentStep(previousStep);
    setCurrentSelected(cloneSelectionMap(previousSelection));
  };

  const handleSubmit = async () => {
    if (!isCurrentStepValid) return;
    const nextSelections = [...stepSelections];
    nextSelections[currentStep] = cloneSelectionMap(currentSelected);
    await onSubmit(nextSelections.map((selection) => toFlatModifiers(selection, modifiers)));
    onClose();
  };

  const toFlatModifiers = (
    selection: Record<string, Set<string>>,
    sourceModifiers: Modifiers,
  ): FlatModifier[] => {
    const flat: FlatModifier[] = [];
    for (const [groupId, set] of Object.entries(selection)) {
      const group = sourceModifiers[groupId as keyof typeof sourceModifiers];
      for (const optionId of set) {
        const option = group?.options.find((currentOption) => currentOption.id === optionId);
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

  return {
    groups,
    currentSelected,
    currentStep,
    runningTotal,
    additionalPriceCurrent,
    isCurrentStepValid,
    isLastStep,
    toggle,
    handlePrevious,
    handleNext,
    handleSubmit,
  };
};
