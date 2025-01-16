"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { BreadcrumbsDefault } from "@/components/common/breadcrumns";
import { ConfirmAccount } from "@/components/dashboard/confirm-account";
import { RegisterCompany } from "@/components/dashboard/register-company";
import { SideBar } from "@/components/dashboard/sidebar";
import { useAuth } from "@/hooks/api/use-auth";
import { ReactNode } from "react";
import { MdNotifications } from "react-icons/md";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {!user?.isConfirmed ? (
        <ConfirmAccount />
      ) : user?.companyId ? (
        <div className="grid grid-cols-5  h-dvh w-full">
          <div className="col-span-1">
            <SideBar />
          </div>
          <div className="col-span-4   px-5 ">
            <div className="w-full py-3 items-center justify-between flex h-[70px]">
              <BreadcrumbsDefault />
              <div className="bg-blue-gray-50  p-3 rounded-full">
                <MdNotifications />
              </div>
            </div>

            <div className="mt-7">{children}</div>
          </div>
        </div>
      ) : (
        <RegisterCompany />
      )}
    </ProtectedRoute>
  );
}
