"use client";
import { useAuth } from "@/hooks/api/use-auth";



export function SideBar() {
  const { user, logout } = useAuth();
  return (
    <div className="gap-3">
      <div className="col-span-1 bg-black rounded-3xl text-white">
        <div className="p-5">
          <h2>Hey {user?.firstName},</h2>
          <h3 className="text-sm opacity-70">Good afternoon</h3>
        </div>

        <hr />
      </div>
      <div className="col-span-1 bg-black rounded-3xl text-white">
        <div className="p-5">
          <h2>Hey {user?.firstName},</h2>
          <h3 className="text-sm opacity-70">Good afternoon</h3>
        </div>

        <hr />
      </div>
    </div>
  );
}
