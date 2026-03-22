"use client";

import type { ReactNode } from "react";

export const ContentWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-1 flex-col xl:pr-52">
    {children}
  </div>
);
