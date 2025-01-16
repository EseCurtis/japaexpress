"use client";

import { PortalLayout } from "@/components/layouts/portal-layout";
import { BrandShowcase } from "@/components/portal/brand-showcase";
import { SignUpForm } from "@/components/portal/sign-up-form";

export default function Home() {
  return (
    <PortalLayout
      leftContainer={<BrandShowcase />}
      rightContainer={<SignUpForm />}
    />
  );
}
