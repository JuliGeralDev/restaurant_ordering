"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export const ContentWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className={`flex flex-1 flex-col ${pathname === "/cart" ? "" : "xl:pr-44"}`}>
      {children}
    </div>
  );
};
