"use client";

import { PortalLayout } from "@/components/layouts/portal-layout";
import { BrandShowcase } from "@/components/portal/brand-showcase";
import { LoginForm } from "@/components/portal/login-form";

export default function Home() {
  return (
    <PortalLayout
      leftContainer={<BrandShowcase />}
      rightContainer={<LoginForm />}
    />
  );
}
