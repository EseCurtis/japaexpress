/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ButtonDefault } from "@/components/common/button";
import { CheckboxDefault } from "@/components/common/checkbox";
import { useAuth } from "@/hooks/api/use-auth";
import { loginSchema } from "@/utils/request-schemas";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: { email: string; password: string },
    {
      setSubmitting,
      setErrors
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setErrors: (errors: { apiError?: string }) => void;
    }
  ) => {
    try {
      await login(values.email, values.password);
      router.push("/dashboard");
    } catch (error: any) {
      setErrors({ apiError: error.response?.data?.msg || "Login failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full  rounded ">
      <div className="pb-10">
        <h1 className="text-3xl font-bold text-left">Welcome Back!</h1>
        <p className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href={"/sign-up"} className="underline">
            signup
          </Link>
          .
        </p>
      </div>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={toFormikValidationSchema(loginSchema)}
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          errors
        }: {
          isSubmitting: boolean;
          errors: {
            email?: string;
            password?: string;
            apiError?: string;
          };
        }) => (
          <Form className="space-y-4">
            <div>
              <Field
                id="email"
                name="email"
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="Email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-red-500"
              />
            </div>
            <div>
              <Field
                id="password"
                name="password"
                type={!showPassword ? "password" : "text"}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="Password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-red-500"
              />
            </div>
            {errors.apiError && (
              <div className="text-sm text-red-500 text-center">
                {errors.apiError}
              </div>
            )}

            <div className="pb flex  gap-0.5 items-center -translate-x-2.5 ">
              <CheckboxDefault
                label={<p className="text-sm !font-[500]">Show password</p>}
                checked={showPassword}
                onChange={(e) => {
                  setShowPassword(e.currentTarget.checked);
                }}
              />
            </div>

            <ButtonDefault
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Login
            </ButtonDefault>
          </Form>
        )}
      </Formik>
    </div>
  );
}
