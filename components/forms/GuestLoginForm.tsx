"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

import MainForm from "./MainForm";

import { useRenterLoginMutation } from "@/app/store/services/renterApi";
import { validators } from "./form.validators";
import { FormFieldConfig } from "./types";

const fields: FormFieldConfig[] = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "john@email.com",
    icon: <Mail className="w-4 h-4" />,
    validation: validators.email(),
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Create a password",
    validation: validators.password(),
  },
];

export default function GuestLoginForm() {
  const router = useRouter();
  const [RenterLogin, { isLoading }] = useRenterLoginMutation();

  const handleSubmit = async (values: { email: string; password: string }) => {
    const response = await RenterLogin(
      values as {
        email: string;
        password: string;
      },
    ).unwrap();

    if (response.success) {
      router.refresh();
    }
  };

  return (
    <MainForm
      fields={fields}
      onSubmit={async (values) =>
        handleSubmit(values as { email: string; password: string })
      }
      isLoading={isLoading}
      submitLabel="Sign In"
      className="w-full"
    />
  );
}
