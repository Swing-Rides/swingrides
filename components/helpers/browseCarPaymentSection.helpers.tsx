import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";

// ─── Shared constants ──────────────────────────────────────────────────────────

//TODO: This value has to be changed by fetching it from the server
export const DEFAULT_TAX_RATE = 0.08;

// ─── Shared presentational bits ────────────────────────────────────────────────
// Same job as MainForm's `FormField` wrapper, just with a plainer (label, htmlFor,
// error, children) API — this form builds its own layout (grids, address rows,
// price breakdown) around each field rather than iterating a `fields` array.

type FormRowProps = {
        label: string;
        htmlFor: string;
        error?: string;
        children: React.ReactNode;
};

export const FormRow = ({ label, htmlFor, error, children }: FormRowProps) => (
        <div className= "flex flex-col gap-1.5" >
                <Label
                        htmlFor={ htmlFor }
                        className = "text-[#1F2937] text-xs font-semibold font-text uppercase"
                >
                        { label }
                </Label>
                { children }
                { error && <FieldError message={ error } /> }
        </div>
);

export const FieldError = ({ message }: { message: string }) => (
        <span className= "text-red-500 text-xs font-normal font-text flex items-center gap-1" >
                <AlertTriangle className="size-3 shrink-0" />
                { message }
        </span>
);