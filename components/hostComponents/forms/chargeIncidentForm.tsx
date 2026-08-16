"use client";

import {
    Control,
    FieldErrors,
    UseFormGetValues,
    UseFormRegister,
    FieldArrayWithId,
} from "react-hook-form";
import { FormField, FileInput } from "@/components/forms/MainForm";
import { FileText, Trash2 } from "lucide-react";

export type IncidentChargeItem = {
    incidentType: string;
    amount: string | number;
    description: string;
    evidenceDocs?: FileList | File[];
    evidencePhotos?: FileList | File[];
};

export type ChargeIncidentFormValues = {
    incidents: IncidentChargeItem[];
    confirmed: boolean;
};

export const INCIDENT_TYPE_OPTIONS = [
    { label: "Additional Distance", value: "Additional Distance" },
    { label: "Refueling", value: "Refueling" },
    { label: "Tolls", value: "Tolls" },
    { label: "Tickets / Citations", value: "Tickets / Citations" },
    { label: "Cleaning Fee", value: "Cleaning Fee" },
    { label: "Late Return", value: "Late Return" },
    { label: "Vehicle Damage", value: "Vehicle Damage" },
    { label: "Other", value: "Other" },
];

export type ChargeIncidentFormProps = {
    register: UseFormRegister<ChargeIncidentFormValues>;
    control: Control<ChargeIncidentFormValues>;
    getValues: UseFormGetValues<ChargeIncidentFormValues>;
    errors: FieldErrors<ChargeIncidentFormValues>;
    fields: FieldArrayWithId<ChargeIncidentFormValues, "incidents", "id">[];
    onRemoveIncident?: (index: number) => void;
};

export default function ChargeIncidentForm({
  register,
  control,
  getValues,
  errors,
  fields,
  onRemoveIncident,
}: ChargeIncidentFormProps) {
    return (
        <div className="flex flex-col gap-5">
            {fields.map((fieldItem, index) => {
                return (
                    <div
                        key={fieldItem.id}
                        className="relative border border-gray-200 rounded-[10px] p-4 md:p-5 flex flex-col gap-4 bg-white shadow-xs"
                    >
                        {fields.length > 1 && (
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span className="text-xs font-semibold font-text text-gray-500 uppercase">
                                    Incident #{index + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onRemoveIncident?.(index)}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                                    title="Remove incident"
                                >
                                    <Trash2 className="size-4" />
                                    <span>Remove</span>
                                </button>
                            </div>
                        )}

                        {/* INCIDENT TYPE & AMOUNT Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                field={{
                                    name: `incidents.${index}.incidentType`,
                                    type: "select",
                                    label: "INCIDENT TYPE",
                                    placeholder: "Select incident type",
                                    options: INCIDENT_TYPE_OPTIONS,
                                    validation: { 
                                        required: "Please select an incident type" 
                                    },
                                }}
                                register={register}
                                control={control}
                                getValues={getValues}
                                errors={errors}
                            />

                            <FormField
                                field={{
                                    name: `incidents.${index}.amount`,
                                    type: "number-dollar",
                                    label: "AMOUNT",
                                    validation: {
                                        required: "Amount is required",
                                        min: { value: 0.01, message: "Amount must be greater than 0" },
                                        validate: (val: string | number) => {
                                            const num = typeof val === "number" ? val : parseFloat(val);
                                            if (isNaN(num) || num <= 0) {
                                                return "Please enter a valid amount greater than 0";
                                            }
                                            return true;
                                        },
                                    },
                                }}
                                register={register}
                                control={control}
                                getValues={getValues}
                                errors={errors}
                            />
                        </div>

                        {/* DESCRIPTION Row */}
                        <FormField
                            field={{
                                name: `incidents.${index}.description`,
                                type: "textarea",
                                label: "DESCRIPTION",
                                description: "Example: (Renter returned vehicle with half tank)",
                                height: 120,
                                validation: { 
                                    required: "Description is required",
                                    minLength: {
                                        value: 5,
                                        message: "Description must be at least 5 characters long",
                                    },
                                },
                            }}
                            register={register}
                            control={control}
                            getValues={getValues}
                            errors={errors}
                        />

                        {/* EVIDENCE Row */}
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-zinc-800 text-xs font-semibold font-text uppercase">
                                EVIDENCE <span className="text-[#EF4444] ml-1">*</span>
                            </label>
                            <div className="grid grid-cols-1">
                                <FileInput
                                    field={{
                                        name: `incidents.${index}.evidenceDocs`,
                                        type: "file",
                                        uploadIcon: (
                                            <div className="size-10 rounded-lg border border-blue-200 bg-blue-50 flex items-center justify-center">
                                                <FileText className="size-5 text-blue-600" />
                                            </div>
                                        ),
                                        accept: ".pdf,.doc,.docx,image/*",
                                        multiple: true,
                                        maxFiles: 5,
                                        description: "Upload receipts, photos, or documents",
                                        validation: {
                                            required: "Evidence proof is required",
                                            validate: (val: unknown) => {
                                                if (!val) {
                                                    return "Please upload at least one evidence document or image";
                                                }
                                                if (val instanceof FileList && val.length === 0) {
                                                    return "Please upload at least one evidence document or image";
                                                }
                                                if (Array.isArray(val) && val.length === 0) {
                                                    return "Please upload at least one evidence document or image";
                                                }
                                                return true;
                                            },
                                        },
                                    }}
                                    register={register}
                                    error={
                                        errors.incidents?.[index]?.evidenceDocs?.message as string
                                    }
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
