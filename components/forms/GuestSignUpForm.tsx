"use client";

import { useRenterRegisterMutation } from "@/app/store/services/renterApi";
import MainForm from "./MainForm";
import { validators } from "./form.validators";
import { FormFieldConfig } from "./types";
import { Mail, User } from "lucide-react";

const fields: FormFieldConfig[] = [
  {
    name: "firstName",
    type: "text",
    label: "First Name",
    placeholder: "John",
    icon: <User className="size-4" />,
    validation: validators.name("First name"),
    className: "w-full",
  },
  {
    name: "lastName",
    type: "text",
    label: "Last Name",
    placeholder: "Doe",
    icon: <User className="size-4" />,
    validation: validators.name("Last name"),
    className: "w-full",
  },
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "john@email.com",
    icon: <Mail className="size-4" />,
    validation: validators.email(),
  },
  {
    name: "phoneNumber",
    type: "tel",
    label: "Phone Number",
    placeholder: "+1 555-123-4567",
    icon: <Mail className="size-4" />,
    validation: validators.phone(),
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Create a password",
    validation: validators.password(),
  },
  {
    name: "terms",
    type: "checkbox",
    label: "I agree to the Terms and Conditions",
    validation: validators.checkbox("Terms and Conditions"),
  },
];

export default function GuestSignUpForm({}) {
  const [RenterSignUp, { isLoading }] = useRenterRegisterMutation();
  return (
    <MainForm
      fields={fields}
      onSubmit={(values) => {
        RenterSignUp({
          email: String(values.email),
          firstName: String(values.firstName),
          lastName: String(values.lastName),
          password: String(values.password),
          phoneNumber: String(values.phoneNumber),
          termsAgreement: Boolean(values.terms),
        }).unwrap();
      }}
      submitLabel="Create Account"
      isLoading={isLoading}
      className="w-full"
      rowPairs={[["firstName", "lastName"]]}
    />
  );
}
