"use client";

import { useEffect, useState } from "react";
import { ChevronRight, X } from "lucide-react";

import type { ModifierGroup, Modifiers } from "../menu.types";
import { CardConsola } from "@/shared/ui/CardConsola";
import { Button } from "@/shared/ui/button";

const MODIFIER_LABELS: Record<string, string> = {
  protein: "PROTEIN",
  toppings: "TOPPINGS",
  sauces: "SAUCES",
};

const formatPrice = (price: number) => `$${price.toLocaleString("es-CO")}`;

const getModifierGroups = (modifiers: Modifiers) =>
  (Object.entries(modifiers) as [string, ModifierGroup | undefined][])
    .filter((entry): entry is [string, ModifierGroup] => Boolean(entry[1]));

interface RetroModifiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  basePrice: number;
  quantity: number;
  modifiers: Modifiers;
  onAddItem: (modifiers: Array<{groupId: string; optionId: string; name: string; price: number}>) => void;
}

export const RetroModifiersModal = ({
  isOpen,
  onClose,
  productName,
  basePrice,
  quantity,
  modifiers,
  onAddItem,
}: RetroModifiersModalProps) => {
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

  if (!isOpen) return null;

  const groups = getModifierGroups(modifiers);

  const getExtraPrice = (selection: Record<string, Set<string>>) =>
    groups.reduce((total, [key, group]) => {
      const sel = selection[key];
      if (!sel) return total;
      return total + group.options
        .filter((opt) => sel.has(opt.id))
        .reduce((sum, opt) => sum + opt.price, 0);
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

  const buildFlat = () => {
    const flat: Array<{groupId: string; optionId: string; name: string; price: number}> = [];
    for (const [groupId, set] of Object.entries(currentSelected)) {
      const group = modifiers[groupId as keyof typeof modifiers];
      for (const optionId of set) {
        const option = group?.options.find((o) => o.id === optionId);
        flat.push({ groupId, optionId, name: option?.name ?? optionId, price: option?.price ?? 0 });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <CardConsola
        title={productName}
        className="w-full max-w-lg max-h-[calc(100vh-2rem)] flex flex-col"
        headerAction={
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border-2 border-red-900 bg-red-600 text-white transition-colors hover:bg-red-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        }
      >
        <div className="m-3 flex flex-1 flex-col min-h-0 overflow-hidden rounded-2xl border-6 border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/50">
          {/* Price header */}
          <div className="border-b-4 border-zinc-700 px-4 py-3 text-center">
            <p className="text-sm text-zinc-500">TOTAL</p>
            <p className="mt-1 text-xl font-bold text-green-400 shadow-[0_0_12px_rgba(74,222,128,0.4)]">
              {formatPrice(runningTotal)}
            </p>
            {quantity > 1 && (
              <p className="mt-1 text-[10px] text-yellow-500">
                item {currentStep + 1} of {quantity} &middot; {formatPrice(basePrice + additionalPriceCurrent)} each
              </p>
            )}
          </div>

          {/* Progress dots */}
          {quantity > 1 && (
            <div className="flex items-center justify-center gap-2 border-b-2 border-zinc-800 px-4 py-2">
              {Array.from({ length: quantity }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i < currentStep
                      ? "w-4 bg-green-500"
                      : i === currentStep
                        ? "w-6 bg-green-400"
                        : "w-2 bg-zinc-700"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Modifier groups */}
          <div className="flex-1 min-h-0 space-y-4 overflow-y-auto p-3">
            {groups.map(([groupKey, group]) => {
              const sel = currentSelected[groupKey];
              return (
                <div key={groupKey}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs text-green-400">
                      {MODIFIER_LABELS[groupKey] ?? groupKey.toUpperCase()}
                    </span>
                    {group.required && (
                      <span className="rounded bg-red-700 px-1.5 py-0.5 text-[8px] text-white">
                        REQUIRED
                      </span>
                    )}
                    {group.max && (
                      <span className="rounded bg-zinc-700 px-1.5 py-0.5 text-[8px] text-zinc-400">
                        MAX {group.max}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {group.options.map((option) => {
                      const isSelected = sel?.has(option.id) ?? false;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggle(groupKey, option.id, group.max)}
                          className={`flex w-full items-center justify-between rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                            isSelected
                              ? "border-green-400 bg-green-900/60 text-green-300"
                              : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-sm border-2 ${
                                isSelected
                                  ? "border-green-400 bg-green-400"
                                  : "border-zinc-600 bg-zinc-900"
                              }`}
                            >
                              {isSelected && (
                                <span className="text-[8px] font-bold leading-none text-zinc-900">x</span>
                              )}
                            </div>
                            <span className="text-xs leading-4">{option.name}</span>
                          </div>
                          {option.price > 0 && (
                            <span className="ml-2 flex-shrink-0 text-xs text-yellow-400">
                              +{formatPrice(option.price)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mx-3 mb-3 flex-shrink-0 rounded-2xl border-4 border-zinc-400 bg-zinc-300 p-3 shadow-inner">
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              className="flex-1 rounded-xl border-4 border-zinc-600 bg-zinc-500 py-2.5 text-[8px] text-white transition-colors hover:bg-zinc-600"
            >
              CANCEL
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleConfirm}
                disabled={!isCurrentStepValid}
                className={`flex-1 rounded-xl border-4 py-2.5 text-[8px] transition-all ${
                  isCurrentStepValid
                    ? "border-purple-900 bg-purple-600 text-white hover:bg-purple-700"
                    : "cursor-not-allowed border-zinc-600 bg-zinc-500 text-zinc-400 opacity-60"
                }`}
              >
                ADD TO CART
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isCurrentStepValid}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border-4 py-2.5 text-[8px] transition-all ${
                  isCurrentStepValid
                    ? "border-zinc-700 bg-zinc-600 text-white hover:bg-zinc-700"
                    : "cursor-not-allowed border-zinc-600 bg-zinc-500 text-zinc-400 opacity-60"
                }`}
              >
                ADD & NEXT <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardConsola>
    </div>
  );
};
