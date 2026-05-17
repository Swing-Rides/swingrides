"use client";

import { useState } from "react";
import MainForm from "./MainForm";
import { validators } from "./form.validators";
import { FormFieldConfig } from "./types";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminLoginMutation } from "@/app/store/services/adminApi";

const fields: FormFieldConfig[] = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "admin@swingrides.com",
    icon: <Mail className="w-4 h-4" />,
    validation: validators.email(),
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Admin123!@",
    validation: validators.password(),
  },
];

export default function SuperAdminLoginForm() {
  const router = useRouter();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: Record<string, unknown>) {
    setErrorMessage(null);

    try {
      const payload = {
        email: values.email as string,
        password: values.password as string,
      };

      const response = await adminLogin(payload).unwrap();

      if (!response.success) {
        setErrorMessage(
          response.message || "Sign in failed. Please try again.",
        );
        return;
      }

      router.push("/admin");
    } catch (error) {
      console.error("Admin login failed:", error);
      const apiError = error as { data?: { message?: string } };
      setErrorMessage(
        apiError?.data?.message ||
          "Sign in failed. Please check your email and password.",
      );
    }
  }

  return (
    <div className="w-full">
      <MainForm
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel="Sign In"
        isLoading={isLoading}
        className="w-full"
      />
      {errorMessage ? (
        <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
