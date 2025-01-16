"use client";
import { useAuth } from "@/hooks/api/use-auth";
import { dashboardPages } from "@/utils/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";
import { MdLogout } from "react-icons/md";
import { ButtonDefault } from "../common/button";

export function SideBar() {
  const { user, logout } = useAuth();
  const { push } = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-2 h-full bg-blue-gray-50 ">
      <div className="col-span-1 h-[70px]  pt-5 text-black flex items-center pl-5">
        <div className=" h-full aspect-square bg-black rounded-full flex items-center justify-center">
          <span className="text-3xl text-white font-bold">
            {user?.company?.name?.[0]}
          </span>
        </div>
        <div className="p-5 text-sm">
          <h2>Welcome {user?.firstName},</h2>
          <h3 className="text-xs opacity-70">Good afternoon</h3>
        </div>

        <hr />
      </div>
      <div className="col-span-1 h-full  text-black  flex flex-col">
        <div className="flex flex-col justify-end gap-3 pt-5 px-5">
          {dashboardPages.map((dashboardPage, index) => (
            <Fragment key={index}>
              <Link
                href={dashboardPage.route}
                className={` p-3 flex gap-3 items-center pl-5 border-b-2 text-sm rounded-xl ${
                  pathname === dashboardPage.route
                    ? "bg-accent text-white "
                    : "hover:bg-white/20 border-transparent"
                }`}
              >
                <div>{dashboardPage.icon}</div>
                <b>{dashboardPage.label}</b>
              </Link>
            </Fragment>
          ))}
        </div>

        <div className="mt-auto  p-3">
          <ButtonDefault
            icon={<MdLogout />}
            onClick={() => {
              logout(() => {
                push("/");
              });
            }}
            className="bg-white w-full text-black "
          >
            Logout
          </ButtonDefault>
        </div>
      </div>
    </div>
  );
}
