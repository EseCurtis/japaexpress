"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { SideBar } from "@/components/dashboard/sidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
 

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-5 p-3 h-dvh w-full">
        <div className="col-span-1">
          <SideBar />
        </div>
        <div className="col-span-4">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
