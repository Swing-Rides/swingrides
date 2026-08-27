"use client"

import { useState } from 'react'
import { useForm, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { validators } from '@/components/forms/form.validators'
import {
	Copy,
	Check,
	FileText,
	CalendarDays,
	Car,
	Mail,
	MessageSquare,
	Loader2,
} from 'lucide-react'
import Link from "next/link";

import {
	TextareaInput,
	SelectInput,
	FileInput,
	ErrorIcon,
	inputClass,
} from '@/components/forms/MainForm'
import type { FormFieldConfig, SelectOption } from '@/components/forms/types'
import { AgreementType } from '../pages/settingsPageComponents/settingsTabs'
import { toast } from 'sonner'

// ─── Booking option (for the "which renter" selector) ─────────────────────────
// Send/upload flows are always tied to a real booking - the recipient and the
// filled-in agreement fields both come from it, rather than a free-typed email.

export type AgreementBookingOption = {
	id: string
	referenceCode: string
	renterName: string
	renterEmail: string
	vehicleName: string
	pickupDate: string
	returnDate: string
}

const formatBookingDateRange = (pickupDate: string, returnDate: string) => {
	const format = (value: string) =>
		new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	return `${format(pickupDate)} – ${format(returnDate)}`
}

const bookingToOption = (booking: AgreementBookingOption): SelectOption => ({
	label: `${booking.renterName} · ${booking.referenceCode}`,
	value: booking.id,
})

// ─── Upload Document Form ─────────────────────────────────────────────────────

const MAX_DOC_SIZE_MB = 5

// ─── Types ────────────────────────────────────────────────────────────────────

type SendAgreementFormValues = {
	bookingId: string
	message: string
}

type UploadDocumentFormValues = {
	bookingId: string
	document: FileList
}

type DocumentCardProps = {
	agreementType: AgreementType
	previewLink?: string
}

type SendAgreementFormProps = {
	agreementType: AgreementType
	shareLink: string
	previewLink?: string
	bookings: AgreementBookingOption[]
	onClose: () => void
	onSubmit?: (values: SendAgreementFormValues) => void | Promise<void>
}

type UploadDocumentFormProps = {
	agreementType: AgreementType
	bookings: AgreementBookingOption[]
	onClose: () => void
	onSubmit?: (values: UploadDocumentFormValues) => void | Promise<void>
}

// ─── Agreement label map ──────────────────────────────────────────────────────

const AGREEMENT_LABELS: Record<AgreementType, string> = {
	'long-term': 'Long-Term Rental Agreement',
	'short-term': 'Short-Term Rental Agreement',
	'custom': 'Custom Rental Agreement',
	'commercial-fleet': 'Commercial Fleet Rental Agreement',
}

// ─── Field configs ────────────────────────────────────────────────────────────

const bookingFieldConfig = (bookings: AgreementBookingOption[]): FormFieldConfig => ({
	name: 'bookingId',
	type: 'select',
	placeholder: bookings.length ? 'Select a booking' : 'No bookings available',
	options: bookings.map(bookingToOption),
	disabled: bookings.length === 0,
	validation: { required: 'Please select a booking' },
})

const messageFieldConfig: FormFieldConfig = {
	name: 'message',
	type: 'textarea',
	placeholder: 'Add a personal note to the renter...',
	rows: 5,
	icon: <MessageSquare className='w-4 h-4' />,
}

const documentFieldConfig: FormFieldConfig = {
	name: 'document',
	type: 'file',
	accept: '.pdf,image/jpeg,image/png',
	maxSizeMB: MAX_DOC_SIZE_MB,
	description: `PDF, JPG, PNG · Max ${MAX_DOC_SIZE_MB}MB`,
	validation: validators.file({
		required: true,
		maxSizeMB: MAX_DOC_SIZE_MB,
		accept: ['application/pdf', 'image/jpeg', 'image/png'],
	}),
}

// ─── SendAgreementForm ────────────────────────────────────────────────────────

export const SendAgreementForm = ({
	agreementType,
	shareLink,
	previewLink,
	bookings,
	onClose,
	onSubmit: onSubmitProp,
}: SendAgreementFormProps) => {
	const [copied, setCopied] = useState(false)

	const {
		register,
		control,
		watch,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SendAgreementFormValues>({ mode: 'onTouched' })

	const selectedBooking = bookings.find((b) => b.id === watch('bookingId'))

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(shareLink)
                        toast.success("Link copied to clipboard")
			setCopied(true)
			setTimeout(() => setCopied(false), 3000)
		} catch {
			toast.error('Failed to copy link')
		}
	}

	const onSubmit = async (values: SendAgreementFormValues) => {
		if (onSubmitProp) {
			await onSubmitProp(values)
                        toast.success("Agreement sent successfully")
                        onClose()
		} else {
			// TODO: replace with real API call
			console.log('sending agreement:', { ...values, agreementType, shareLink })
			toast.error("Failed to send agreement")
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-col gap-4'
			noValidate
		>
			{/* 1. Booking */}
			<FormRow
				label='Booking'
				htmlFor='bookingId'
				required
				error={errors.bookingId?.message}
				description={bookings.length === 0 ? 'This renter has no bookings yet — an agreement can only be sent for an existing booking.' : undefined}
			>
				<SelectInput
					field={bookingFieldConfig(bookings)}
					control={control}
					error={errors.bookingId?.message}
				/>
			</FormRow>

			{selectedBooking && <BookingSummaryCard booking={selectedBooking} />}

			{/* 2. Share Via Link */}
			<FormRow
				label='Share Via Link'
				htmlFor='shareLink'
				description='Copy and send this link via WhatsApp, SMS, or any messaging app.'
			>
				<div className='flex items-center gap-2'>
					<Input
						id='shareLink'
						type='text'
						value={shareLink}
						readOnly
						disabled
						className={cn(inputClass(), 'bg-[#F9FAFB] cursor-not-allowed opacity-80')}
					/>
					<button
						type='button'
						onClick={handleCopy}
						className={cn(
							'flex items-center gap-1.5 px-3 py-2 rounded-xs text-white text-xs font-medium font-text text-nowrap transition-colors duration-200 cursor-pointer shrink-0',
							copied
								? 'bg-emerald-600 hover:bg-emerald-700'
								: 'bg-blue-700 hover:bg-blue-900'
						)}
					>
						{copied
							? <><Check className='w-3.5 h-3.5' /> Copied</>
							: <><Copy className='w-3.5 h-3.5' /> Copy</>
						}
					</button>
				</div>
			</FormRow>

			{/* 3. Message (Optional) */}
			<FormRow
				label='Message'
				htmlFor='message'
				optional
				error={errors.message?.message}
			>
				<TextareaInput
					field={messageFieldConfig}
					register={register as unknown as UseFormRegister<Record<string, unknown>>}
					error={errors.message?.message}
				/>
			</FormRow>

			{/* 4. Document preview card */}
			<DocumentCard
				agreementType={agreementType}
				previewLink={previewLink}
			/>

			<Separator />

			{/* 5. Actions */}
			<div className='flex gap-3 justify-end'>
				<Button
					type='button'
					variant='outline'
					onClick={onClose}
					className='border-[#E5E7EB] text-[#6B7280] rounded-xs hover:bg-[#F3F4F6] font-medium font-text cursor-pointer transition-colors duration-300'
				>
					Cancel
				</Button>
				<Button
					type='submit'
					disabled={isSubmitting}
					className='bg-blue-700 hover:bg-blue-900 rounded-xs text-white font-medium font-text cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none'
				>
					{isSubmitting
						? <span className='flex items-center gap-2'><Loader2 className='animate-spin w-4 h-4' />Sending...</span>
						: 'Send Agreement'
					}
				</Button>
			</div>
		</form>
	)
}

// ─── UploadDocumentForm ───────────────────────────────────────────────────────

export const UploadDocumentForm = ({
	agreementType,
	bookings,
	onClose,
	onSubmit: onSubmitProp,
}: UploadDocumentFormProps) => {
	const {
		register,
		control,
		watch,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<UploadDocumentFormValues>({ mode: 'onTouched' })

	const selectedBooking = bookings.find((b) => b.id === watch('bookingId'))

	const onSubmit = async (values: UploadDocumentFormValues) => {
		if (onSubmitProp) {
			await onSubmitProp(values)
		} else {
			// TODO: replace with real API call
			console.log('uploading document:', { ...values, agreementType })
		}
		onClose()
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-col gap-4'
			noValidate
		>
			{/* 1. Booking */}
			<FormRow
				label='Booking'
				htmlFor='bookingId'
				required
				error={errors.bookingId?.message}
				description={bookings.length === 0 ? 'This renter has no bookings yet — an agreement can only be sent for an existing booking.' : undefined}
			>
				<SelectInput
					field={bookingFieldConfig(bookings)}
					control={control}
					error={errors.bookingId?.message}
				/>
			</FormRow>

			{selectedBooking && <BookingSummaryCard booking={selectedBooking} />}

			{/* 2. File upload zone — uses shared FileInput from MainForm */}
			<FormRow
				label='Upload Document'
				htmlFor='document'
				required
				error={errors.document?.message as string | undefined}
			>
				<FileInput
					field={documentFieldConfig}
					register={register as unknown as UseFormRegister<Record<string, unknown>>}
					error={errors.document?.message as string | undefined}
					getValues={getValues as unknown as () => Record<string, unknown>}
				/>
			</FormRow>

			<Separator />

			{/* Actions */}
			<div className='flex gap-3 justify-end'>
				<Button
					type='button'
					variant='outline'
					onClick={onClose}
					className='border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] rounded-xs font-medium font-text cursor-pointer transition-colors duration-300'
				>
					Cancel
				</Button>
				<Button
					type='submit'
					disabled={isSubmitting}
					className='bg-blue-700 hover:bg-blue-900 rounded-xs text-white font-medium font-text cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none'
				>
					{isSubmitting
						? <span className='flex items-center gap-2'><Loader2 className='animate-spin w-4 h-4' />Uploading...</span>
						: 'Upload Document'
					}
				</Button>
			</div>
		</form>
	)
}

// ─── Document preview card (shared) ──────────────────────────────────────────

const DocumentCard = ({ agreementType, previewLink }: DocumentCardProps) => (
	<div className='flex items-center gap-3 p-3 border border-blue-50 bg-blue-50 rounded-xs'>
		<div className='flex items-center justify-center bg-blue-100 rounded-xs size-12 p-3 shrink-0'>
			<FileText className='w-full h-full text-blue-700' />
		</div>
		<span className='text-[#1F2937] text-sm font-semibold font-text flex-1 leading-5'>
			{AGREEMENT_LABELS[agreementType]}
		</span>
		{previewLink && (
			<Link
				href = { previewLink }
				target='_blank'
				rel='noopener noreferrer'
				className='shrink-0 px-2.5 py-1.5 bg-transparent border border-[#E5E7EB] rounded-xs text-[11px] font-medium font-text uppercase text-[#6B7280] hover:bg-[#F3F4F6] transition-colors duration-150 text-nowrap'
					>
				Preview PDF
			</Link>
		)}
	</div >
)

// ─── Booking summary card (shared) ───────────────────────────────────────────
// Confirms which booking's details will fill in the agreement before sending.

const BookingSummaryCard = ({ booking }: { booking: AgreementBookingOption }) => (
	<div className='flex flex-col gap-2 p-3 border border-[#E5E7EB] bg-[#F9FAFB] rounded-xs text-sm font-text'>
		<div className='flex items-center gap-2 text-[#1F2937] font-semibold'>
			<Mail className='size-3.5 text-[#6B7280]' />
			{booking.renterName} · {booking.renterEmail}
		</div>
		<div className='flex items-center gap-2 text-[#6B7280]'>
			<Car className='size-3.5' />
			{booking.vehicleName}
		</div>
		<div className='flex items-center gap-2 text-[#6B7280]'>
			<CalendarDays className='size-3.5' />
			{formatBookingDateRange(booking.pickupDate, booking.returnDate)}
		</div>
	</div>
)

// ─── Shared form row ──────────────────────────────────────────────────────────

type FormRowProps = {
	label: string
	htmlFor: string
	required?: boolean
	optional?: boolean
	description?: string
	error?: string
	children: React.ReactNode
}

const FormRow = ({
	label,
	htmlFor,
	required,
	optional,
	description,
	error,
	children,
}: FormRowProps) => (
	<div className='flex flex-col gap-1.5'>
		<Label htmlFor={htmlFor} className='text-[#1F2937] text-sm font-semibold font-text'>
			{label}
			{required && <span className='text-[#EF4444] ml-1'>*</span>}
			{optional && <span className='text-[#9CA3AF] font-normal ml-1'>(Optional)</span>}
		</Label>
		{children}
		{description && !error && (
			<span className='text-[#9CA3AF] text-xs font-normal font-text'>
				{description}
			</span>
		)}
		{error && (
			<span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
				<ErrorIcon />
				{error}
			</span>
		)}
	</div>
)