"use client";

import { useAuth } from "@/hooks/api/use-auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading, isError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if ((!isLoading && !user)) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user</div>;

  return children;
}
