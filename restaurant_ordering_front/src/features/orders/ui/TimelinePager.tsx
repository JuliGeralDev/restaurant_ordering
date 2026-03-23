"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/shared/ui/button";

interface TimelinePagerProps {
  pageIndex: number;
  pageSize: number;
  isBusy: boolean;
  canGoToPreviousPage: boolean;
  canGoToNextPage: boolean;
  onPageSizeChange: (pageSize: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const TimelinePager = ({
  pageIndex,
  pageSize,
  isBusy,
  canGoToPreviousPage,
  canGoToNextPage,
  onPageSizeChange,
  onPreviousPage,
  onNextPage,
}: TimelinePagerProps) => (
  <div className="flex flex-col gap-3 border-t border-zinc-700 pt-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-2">
      <label
        htmlFor="timeline-page-size"
        className="text-[10px] uppercase tracking-widest text-zinc-500"
      >
        Rows
      </label>
      <select
        id="timeline-page-size"
        aria-label="Rows"
        value={pageSize}
        onChange={(event) => onPageSizeChange(Number(event.target.value))}
        className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-[10px] uppercase tracking-widest text-zinc-300 outline-none transition-colors focus:border-green-500"
      >
        {PAGE_SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">
        Page {pageIndex + 1}
      </span>
    </div>

    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-green-400"
        onClick={onPreviousPage}
        disabled={!canGoToPreviousPage || isBusy}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Previous
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-green-400"
        onClick={onNextPage}
        disabled={!canGoToNextPage || isBusy}
      >
        Next
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
);
