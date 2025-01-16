"use client";

import { BrandShowcase } from "@/components/portal/brand-showcase";
import { SignUpForm } from "@/components/portal/sign-up-form";

export default function Home() {
  return (
    <div className="grid grid-cols-2 w-full h-dvh">
      <div className="col-span-1 p-3">
        <BrandShowcase />
      </div>

      <div className="col-span-1 h-full p-10 flex items-center">
        <SignUpForm />
      </div>
    </div>
  );
}
