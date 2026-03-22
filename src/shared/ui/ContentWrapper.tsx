"use client";

import type { ReactNode } from "react";

export const ContentWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-1 flex-col min-w-0">
    {children}
  </div>
);
