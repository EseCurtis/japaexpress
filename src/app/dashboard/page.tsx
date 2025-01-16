"use client";
import { useAuth } from "@/hooks/api/use-auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="p-3">
      <h1 className="text-3xl">
       
      </h1>

      <button
        onClick={() => {
          logout(() => {
            router.push("/");
          });
        }}
      >
        logout
      </button>
    </div>
  );
}
