"use client";

import type { ReactNode } from "react";

export const ContentWrapper = ({ children }: { children: ReactNode }) => (
  <div className="relative z-10 flex flex-1 flex-col min-w-0">
    {children}
  </div>
);
