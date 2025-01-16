/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { ButtonDefault } from "@/components/common/button";
import { CheckboxDefault } from "@/components/common/checkbox";
import { useRegister } from "@/hooks/api/use-register";
import { registerUserSchema } from "@/utils/request-schemas";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { toFormikValidationSchema } from "zod-formik-adapter";

export function SignUpForm() {
  const { mutateAsync } = useRegister();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      passwordConfirmation: string;
    },
    {
      setSubmitting,
      setErrors
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setErrors: (errors: { apiError?: string }) => void;
    }
  ) => {
    if (values.password !== values.passwordConfirmation) {
      return setErrors({ apiError: "Confirm password mismatch" });
    }
    try {
      await mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
      });

      toast("Sign up successful!");

      router.push("/");
    } catch (error: any) {
      setErrors({ apiError: error.response?.data?.msg || "Signup failed" });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="w-full  rounded ">
      <div className="pb-10">
        <h1 className="text-3xl font-bold text-left">Create an Account</h1>
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/" className="underline">
            Login
          </Link>
          .
        </p>
      </div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          passwordConfirmation: ""
        }}
        validationSchema={toFormikValidationSchema(registerUserSchema)}
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          errors
        }: {
          isSubmitting: boolean;
          errors: {
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
            passwordConfirmation?: string;
            apiError?: string;
          };
        }) => (
          <Form className="space-y-4">
            <div className="flex gap-3">
              <div>
                <Field
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="First Name"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>
              <div>
                <Field
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Last Name"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>
            </div>
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
            <div>
              <Field
                id="passwordConfirmation"
                name="passwordConfirmation"
                type={!showPassword ? "password" : "text"}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="Confirm Password"
              />
              <ErrorMessage
                name="passwordConfirmation"
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
            <div className="pb-5 flex gap-0.5 items-center -translate-x-2.5 ">
              <CheckboxDefault
                label={
                  <p className="text-sm !font-[500]">
                    Agree to our{" "}
                    <Link href="#" className="underline">
                      Terms of service
                    </Link>
                  </p>
                }
              />
            </div>

            <ButtonDefault
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Sign Up
            </ButtonDefault>
          </Form>
        )}
      </Formik>
    </div>
  );
}
