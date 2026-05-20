"use client"

import { useState } from "react";
import { CircleAlert, Mail } from "lucide-react";
import PageWrapper from "../../dashboard/pageWrapper";
import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
        useGetRecentEmailSendsQuery,
        useSearchEmailRecipientsQuery,
        useSendSystemEmailMutation,
} from "@/app/store/services/adminApi";


export default function EmailActionSettingsPageComponent() {
        const [sendSystemEmail] = useSendSystemEmailMutation()
        const { data: recentSendsData } = useGetRecentEmailSendsQuery({ limit: 10 })

        const recentSendRows = recentSendsData?.data?.sends ?? []

        const handleSendEmail = async (emailType: string, recipientId: string) => {
                await sendSystemEmail({ emailType, recipientId })
        }

        return (
                <PageWrapper
                        pageTitle='Email Actions'
                        pageDescription='Manually trigger system emails to users and organisations'
                >
                        <div className="mt-4 md:mt-8 space-y-10">
                                <div className=" space-y-8">
                                        <SectionWrapper
                                                title="BOOKINGS"
                                        >
                                                <DataList 
                                                        title="Booking Confirmation"
                                                        label="Sends a booking confirmation with vehicle and pickup details to the renter"
                                                        type="Bookings"
                                                        emailType="booking_confirmation"
                                                        handleSendEmail={handleSendEmail}
                                                />
                                                <DataList 
                                                        title="Booking Cancellation"
                                                        label="Notifies the renter that their booking has been cancelled"
                                                        type="Bookings"
                                                        emailType="booking_cancellation"
                                                        handleSendEmail={handleSendEmail}
                                                />
                                                <DataList 
                                                        title="Booking Reminder"
                                                        label="Sends a 24-hour pickup reminder to the renter"
                                                        type="Bookings"
                                                        emailType="booking_reminder"
                                                        handleSendEmail={handleSendEmail}
                                                />
                                        </SectionWrapper>

                                        <SectionWrapper
                                                title="PAYMENTS"
                                        >
                                                <DataList 
                                                        title="Payment Receipt"
                                                        label="Sends a payment receipt after a successful transaction"
                                                        type="Payments"
                                                        emailType="payment_receipt"
                                                        handleSendEmail={handleSendEmail}
                                                />
                                                <DataList 
                                                        title="Payment Failed Alert"
                                                        label="Notifies the user that their payment attempt was unsuccessful"
                                                        type="Payments"
                                                        emailType="payment_failed"
                                                        handleSendEmail={handleSendEmail}
                                                />
                                                <DataList 
                                                        title="Subscription Renewal"
                                                        label="Sends a subscription renewal confirmation to a host organisation"
                                                        type="Payments"
                                                        emailType="subscription_renewal"
                                                        handleSendEmail={handleSendEmail}
                                                />
                                        </SectionWrapper>

                                        <SectionWrapper
                                                title="SYSTEM"
                                        >
                                                <DataList 
                                                        title="Welcome Email"
                                                        label="Sent to new host organisations upon account creation"
                                                        type="System"
                                                        emailType="welcome"
                                                        handleSendEmail={handleSendEmail}
                                                />
                                                <DataList 
                                                        title="Agreement Signing Request"
                                                        label="Sends a rental agreement to a renter for e-signature"
                                                        type="System"
                                                        emailType="agreement_signing"
                                                        handleSendEmail={handleSendEmail}
                                                />
                                                <DataList 
                                                        title="Password Reset"
                                                        label="Triggers a password reset link email to an admin or host user"
                                                        type="System"
                                                        emailType="password_reset"
                                                        handleSendEmail={handleSendEmail}
                                                />
                                        </SectionWrapper>
                                </div>
                                <div>
                                        <RecentSendsSection 
                                                recentSendRows={recentSendRows} 
                                        />
                                </div>
                        </div>
                </PageWrapper>
        )
}

type SectionWrapperProps = {
        title: string;
        children: ReactNode;
}

const SectionWrapper = ({ title, children }: SectionWrapperProps ) => {
        return (
                <div className="flex flex-col gap-3">
                        <div>
                                <h3 className="text-gray-500 text-xs font-semibold font-text uppercase leading-4 tracking-tight">
                                        {title}
                                </h3>
                        </div>
                        <div className="flex flex-col gap-3">
                                {children}
                        </div>
                </div>
        )
}

type DataListProps = {
        title: string;
        label: string;
        type: "Bookings" | "Payments" | "System";
        emailType: string;
        handleSendEmail: (emailType: string, recipientId: string) => void;
}

const DataList = ({ title, label, type, emailType, handleSendEmail }: DataListProps ) => {
        const typeStyle =
                type === "Bookings" ? "bg-blue-50 text-blue-700"
                        : type === "Payments" ? "bg-emerald-50 text-emerald-600"
                                : "bg-gray-100 text-gray-500";

        const [query, setQuery] = useState("");
        const [selectedRecipient, setSelectedRecipient] = useState<{ id: string; name: string; email: string } | null>(null);

        const { data: recipientsData } = useSearchEmailRecipientsQuery(query, { skip: query.trim().length < 2 });
        const suggestions = recipientsData?.data ?? [];

        const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setQuery(value);
                if (!value.trim()) setSelectedRecipient(null);
        };

        const handleSelect = (r: { id: string; name: string; email: string }) => {
                setSelectedRecipient(r);
                setQuery(r.name);
        };

        const handleSubmit = () => {
                if (selectedRecipient) {
                        handleSendEmail(emailType, selectedRecipient.id);
                }
        };

        return (
                <Dialog>
                        <div className="p-4 bg-white rounded-lg border border-gray-200 flex flex-col md:flex-row justify-start md:items-center gap-4">
                                <div className="flex items-center justify-center bg-blue-50 size-10 aspect-square rounded-full">
                                        <Mail className="text-blue-700 size-5" />
                                </div>
                                <div className="flex flex-col gap-1 basis-210 grow shrink">
                                        <span className="justify-start text-neutral-950 text-sm font-semibold font-text leading-5">
                                                {title}
                                        </span>
                                        <span className="justify-start text-gray-500 text-xs font-normal font-text leading-4">
                                                {label}
                                        </span>
                                </div>
                                <div>
                                        <span className={`px-3 py-1 rounded-full inline-flex justify-start items-center text-xs ${typeStyle}`}>
                                                {type}
                                        </span>
                                </div>
                                <div>
                                        <DialogTrigger asChild>
                                                <button className="px-4 py-2 bg-white rounded-md border border-blue-700 text-blue-700 text-sm font-medium font-text leading-5 hover:bg-blue-700 hover:text-white transition-color duration-300 cursor-pointer">
                                                        Send Email
                                                </button>
                                        </DialogTrigger>
                                </div>
                        </div>

                        <form>
                                <DialogContent className="sm:max-w-sm px-6">
                                        <DialogHeader>
                                                <DialogTitle className="text-neutral-950 text-lg font-semibold font-text leading-6">
                                                        Send {title}
                                                </DialogTitle>
                                                <DialogDescription>
                                                        <span className="text-gray-500 text-xs font-normal font-text leading-4">
                                                                This will send the predefined {title} email using the existing system template.
                                                        </span>
                                                </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-6 space-y-5 border-y">
                                                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 flex justify-start items-start gap-3">
                                                        <CircleAlert className="size-6" />
                                                        <span>
                                                                This will use the predefined system template. No content will be modified.
                                                        </span>
                                                </div>
                                                <FieldGroup>
                                                        <Field>
                                                                <Label htmlFor="recipient">Recipient</Label>
                                                                <div className="relative">
                                                                        <Input
                                                                                id="recipient"
                                                                                name="recipient"
                                                                                value={query}
                                                                                onChange={handleQueryChange}
                                                                                placeholder="Search by name, email, or organisation..."
                                                                                autoComplete="off"
                                                                        />
                                                                        {suggestions.length > 0 && (
                                                                                <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto">
                                                                                        {suggestions.map((r) => (
                                                                                                <li
                                                                                                        key={r.id}
                                                                                                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                                                                                                        onMouseDown={() => handleSelect(r)} // onMouseDown prevents input blur race
                                                                                                >
                                                                                                        <span className="block text-sm font-medium text-neutral-900">{r.name}</span>
                                                                                                        <span className="block text-xs text-gray-500">{r.email}</span>
                                                                                                </li>
                                                                                        ))}
                                                                                </ul>
                                                                        )}
                                                                </div>
                                                        </Field>
                                                        <Field>
                                                                <Label htmlFor="bookingReference">
                                                                        Booking Reference (optional)
                                                                </Label>
                                                                <Input id="bookingReference" name="bookingReference" placeholder="e.g. BKG-8472" />
                                                                <span className="text-gray-500 text-xs font-normal font-text leading-4">
                                                                        Required for booking-related emails
                                                                </span>
                                                        </Field>
                                                </FieldGroup>
                                        </div>
                                        <DialogFooter>
                                                <DialogClose asChild>
                                                        <button className="text-gray-700 text-sm font-medium font-text leading-5 px-5 py-2.5 bg-white rounded-xs border border-gray-300 hover:bg-gray-700 hover:text-white duration-300 transition-color cursor-pointer">
                                                                Cancel
                                                        </button>
                                                </DialogClose>
                                                <button
                                                        className="text-white text-sm font-medium font-text leading-5 px-5 py-2.5 bg-blue-700 rounded-xs hover:bg-blue-900 transition-color duration-300 cursor-pointer"
                                                        onClick={handleSubmit}
                                                >
                                                        Send Email
                                                </button>
                                        </DialogFooter>
                                </DialogContent>
                        </form>
                </Dialog>
        );
};

const RecentSendsSection = ({ recentSendRows }: RecentSendsSectionTableProps) => {
        return (
                <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                                <h3 className="text-neutral-950 text-lg font-semibold font-text leading-6">
                                        Recent Sends
                                </h3>
                                <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                        Last 10 emails triggered manually by admins
                                </span>
                        </div>
                        <div>
                                <RecentSendsSectionTable recentSendRows={recentSendRows}/>
                        </div>
                </div>
        )
}

type RecentSendsSectionTableProps = {
        recentSendRows: {
                id: string;
                emailType: string;
                name: string;
                email: string;
                triggeredBy: string;
                sentAt: string;
                status: "sent" | "failed";
        }[]
}

const RecentSendsSectionTable = ({ recentSendRows }: RecentSendsSectionTableProps ) => {
        return (
                <Table className="py-2.5 bg-white rounded-lg border border-gray-200">
                        <TableHeader className="bg-gray-100">
                                <TableRow>
                                        <TableHead className="pl-5 text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                Email Type
                                        </TableHead>
                                        <TableHead className="text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                Recipient
                                        </TableHead>
                                        <TableHead className="text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                Triggered By
                                        </TableHead>
                                        <TableHead className="text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                Sent At
                                        </TableHead>
                                        <TableHead className="pr-5 text-gray-500 text-xs font-bold font-text uppercase leading-4 tracking-tight">
                                                Status
                                        </TableHead>
                                </TableRow>
                        </TableHeader>
                        <TableBody>
                        {recentSendRows.length === 0 ? (
                                <TableRow>
                                        <TableCell
                                                colSpan={5}
                                                className="text-center py-16 text-gray-400 text-sm"
                                        >
                                                No payments match your filters.
                                        </TableCell>
                                </TableRow>
                        ) : (recentSendRows.map((item) => (
                        <TableRow key={item.id} className="px-5">
                                <TableCell className="pl-5">
                                        <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                                                {item.emailType}
                                        </span>
                                </TableCell>
                                <TableCell>
                                        <div className="flex flex-col">
                                                <span className="text-neutral-950 text-xs font-medium font-text leading-5">
                                                        {item.name}
                                                </span>
                                                <span className="text-gray-500 text-xs font-normal font-text leading-4">
                                                        {item.email}
                                                </span>
                                        </div>
                                </TableCell>
                                <TableCell>
                                        <span className="text-neutral-950 text-sm font-medium font-text leading-5">
                                                {item.triggeredBy}
                                        </span>
                                </TableCell>
                                <TableCell>
                                        <span className="text-gray-500 text-sm font-normal font-text leading-5">
                                                {item.sentAt}
                                        </span>
                                </TableCell>
                                <TableCell className="pr-5">
                                        {item.status}
                                </TableCell>
                        </TableRow>))
                        )}
                        </TableBody>
                </Table>
        )
}