"use client";

import { Mail, User, Building2, Phone } from "lucide-react";
import MainForm from "./MainForm";
import { validators } from "./form.validators";
import { FormFieldConfig } from "./types";
import { RegisterOptions } from "react-hook-form";
import { useHostRegisterMutation } from "@/app/store/services/hostApi";
import { CreateHostRequest } from "@/app/services/signIn";
import { useRouter } from "next/navigation";
import { useState } from "react";

const fields: FormFieldConfig[] = [
  {
    name: "firstName",
    type: "text",
    label: "First Name",
    placeholder: "John",
    icon: <User className="w-4 h-4" />,
    validation: validators.name("First name") as RegisterOptions,
    className: "w-full",
  },
  {
    name: "lastName",
    type: "text",
    label: "Last Name",
    placeholder: "Smith",
    icon: <User className="w-4 h-4" />,
    validation: validators.name("Last name") as RegisterOptions,
    className: "w-full",
  },
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "john@company.com",
    icon: <Mail className="w-4 h-4" />,
    validation: validators.email() as RegisterOptions,
  },
  {
    name: "companyName",
    type: "text",
    label: "Company Name",
    placeholder: "Acme Rentals Ltd.",
    icon: <Building2 className="w-4 h-4" />,
    validation: validators.required("Company name") as RegisterOptions,
  },
  {
    name: "phoneNumber",
    type: "tel",
    label: "Phone Number",
    placeholder: "+1 555-123-4567",
    icon: <Phone className="w-4 h-4" />,
    autoComplete: "tel",
    description: "Include country code for international numbers.",
    validation: validators.phone() as RegisterOptions,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Create a strong password",
    validation: validators.password() as RegisterOptions,
  },
  {
    name: "terms",
    type: "checkbox",
    label: "I agree to the Terms of Service and Privacy Policy",
    validation: validators.checkbox(
      "Terms of Service and Privacy Policy",
    ) as RegisterOptions,
  },
];

export default function HostRegisterForm() {
  const [hostRegister, { isLoading }] = useHostRegisterMutation();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (values: Record<string, unknown>) => {
    const payload: CreateHostRequest = {
      email: values.email as string,
      password: values.password as string,
      firstName: values.firstName as string,
      lastName: values.lastName as string,
      plan: "starter",
      companyName: values.companyName as string,
      phoneNumber: values.phoneNumber as string,
      termsAgreement: values.terms as boolean,
    };

    const response = await hostRegister(payload).unwrap();
    if (response.success) {
      router.push("/us/host");
    } else {
      setErrorMessage(response.message || "Sign in failed. Please try again.");
      return;
    }
  };

  return (
    <MainForm
      fields={fields}
      onSubmit={onSubmit}
      submitLabel="Create Account"
      className="w-full"
      rowPairs={[["firstName", "lastName"]]}
    />
  );
}
