'use client'

import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import {
        Upload,
        X,
        AlertTriangle,
        Loader2,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_DESCRIPTION_CHARS = 200
const MAX_PHOTOS = 4
const MAX_PHOTO_SIZE_MB = 5

const ISSUE_TYPES = [
        { label: 'Guest Behaviour', value: 'guest-behaviour' },
        { label: 'Vehicle Damage', value: 'vehicle-damage' },
        { label: 'Billing & Payment', value: 'billing-payment' },
        { label: 'Booking / Reservation', value: 'booking-reservation' },
        { label: 'Late Return', value: 'late-return' },
        { label: 'Accident or Incident', value: 'accident-incident' },
        { label: 'Safety Concern', value: 'safety-concern' },
        { label: 'Platform / Technical', value: 'platform-technical' },
        { label: 'Other', value: 'other' },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type HostReportFormValues = {
        bookingReference: string
        issueType: string
        description: string
        photos?: FileList
        isUrgent: boolean
}

export type HostIssueReportSubmitPayload = {
        bookingReference: string
        issueType: string
        description: string
        isUrgent: boolean
        photoUrls: string[]
}

type HostReportAnIssueFormProps = {
        onSubmit?: (payload: HostIssueReportSubmitPayload) => void | Promise<void>
}

const submitReport = async (payload: HostIssueReportSubmitPayload) => {
        // TODO: replace with real API call
        // await fetch('/api/reports', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(values),
        // })
        console.log('submitting report:', payload)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HostReportAnIssueForm({ onSubmit: onSubmitProp }: HostReportAnIssueFormProps) {
        const [previews, setPreviews] = useState<{ name: string; url: string }[]>([])
        const [charCount, setCharCount] = useState(0)
        const photoInputRef = useRef<HTMLInputElement | null>(null)

        const {
                register,
                handleSubmit,
                control,
                formState: { errors, isSubmitting },
        } = useForm<HostReportFormValues>({
                mode: 'onTouched',
                defaultValues: { isUrgent: false },
        })

        const onSubmit = async (values: HostReportFormValues) => {
                const photoUrls = values.photos ? Array.from(values.photos).map((file) => file.name) : []
                const payload: HostIssueReportSubmitPayload = {
                        bookingReference: values.bookingReference,
                        issueType: values.issueType,
                        description: values.description,
                        isUrgent: values.isUrgent,
                        photoUrls,
                }

                if (onSubmitProp) {
                        await onSubmitProp(payload)
                        return
                }

                await submitReport(payload)
        }

        // Photo register
        const { ref: photoRef, ...photoRest } = register('photos', {
                validate: {
                        maxFiles: (files: FileList | undefined) => {
                                if (!files?.length) return true
                                return files.length <= MAX_PHOTOS
                                        || `Maximum ${MAX_PHOTOS} photos allowed`
                        },
                        maxSize: (files: FileList | undefined) => {
                                if (!files?.length) return true
                                const oversized = Array.from(files).filter(
                                        f => f.size / (1024 * 1024) > MAX_PHOTO_SIZE_MB
                                )
                                return oversized.length === 0
                                        || `Each photo must be under ${MAX_PHOTO_SIZE_MB}MB`
                        },
                        fileType: (files: FileList | undefined) => {
                                if (!files?.length) return true
                                const invalid = Array.from(files).filter(
                                        f => !['image/jpeg', 'image/png'].includes(f.type)
                                )
                                return invalid.length === 0
                                        || 'Only JPG and PNG files are allowed'
                        },
                },
        })

        const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                photoRest.onChange(e)
                const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS)
                setPreviews(files.map(file => ({
                        name: file.name,
                        url: URL.createObjectURL(file),
                })))
        }

        const removePreview = (index: number) => {
                setPreviews(prev => prev.filter((_, i) => i !== index))
        }

        return (
                <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-6 w-full'
                        noValidate
                >
                        {/* 1. Booking Reference */}
                        <FormRow
                                label='Booking Reference'
                                htmlFor='bookingReference'
                                required
                                description='Find your booking reference in your confirmation email or profile page.'
                                error={errors.bookingReference?.message}
                        >
                                <div className='relative flex items-center'>
                                        <span className='absolute left-3 text-[#6B7280] text-sm font-semibold pointer-events-none select-none'>
                                                #
                                        </span>
                                        <Input
                                                id='bookingReference'
                                                type='text'
                                                placeholder='e.g. SR-2026-0042'
                                                className={cn(
                                                        inputCn(!!errors.bookingReference),
                                                        'pl-7 rounded-xs'
                                                )}
                                                {...register('bookingReference', {
                                                        required: 'Booking reference is required',
                                                        pattern: {
                                                                value: /^SR-\d{4}-\d{4}$/,
                                                                message: 'Enter a valid booking reference (e.g. SR-2026-0042)',
                                                        },
                                                })}
                                        />
                                </div>
                        </FormRow>

                        {/* 2. Issue Type */}
                        <FormRow
                                label='Issue Type'
                                htmlFor='issueType'
                                required
                                error={errors.issueType?.message}
                        >
                                <Controller
                                        name='issueType'
                                        control={control}
                                        defaultValue=''
                                        rules={{ required: 'Please select an issue type' }}
                                        render={({ field }) => (
                                                <Select 
                                                        onValueChange={field.onChange} 
                                                        value={field.value}
                                                >
                                                        <SelectTrigger
                                                                id='issueType'
                                                                className={cn(
                                                                        'w-full font-text text-sm',
                                                                        errors.issueType
                                                                                ? 'border-[#EF4444] focus:ring-[#EF4444]'
                                                                                : 'border-[#E5E7EB] focus:ring-[#1A56DB]'
                                                                )}
                                                        >
                                                                <SelectValue placeholder='Select an issue type' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                {ISSUE_TYPES.map(type => (
                                                                        <SelectItem
                                                                                key={type.value}
                                                                                value={type.value}
                                                                                className='font-text text-sm'
                                                                        >
                                                                                {type.label}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                        )}
                                />
                        </FormRow>

                        {/* 3. Describe the Issue */}
                        <FormRow
                                label='Describe the Issue'
                                htmlFor='description'
                                required
                                error={errors.description?.message}
                        >
                                <div className='flex flex-col gap-1'>
                                        <Textarea
                                                id='description'
                                                placeholder='Please describe the issue in as much detail as possible. Include dates, times, and any relevant information.'
                                                rows={8}
                                                maxLength={MAX_DESCRIPTION_CHARS}
                                                className={cn(
                                                        'resize-none h-40 font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] rounded-xs',
                                                        errors.description
                                                                ? 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                                : 'border-[#E5E7EB] focus-visible:ring-[#1A56DB]'
                                                )}
                                                {...register('description', {
                                                        required: 'Please describe the issue',
                                                        minLength: {
                                                                value: 20,
                                                                message: 'Description must be at least 20 characters',
                                                        },
                                                        maxLength: {
                                                                value: MAX_DESCRIPTION_CHARS,
                                                                message: `Description cannot exceed ${MAX_DESCRIPTION_CHARS} characters`,
                                                        },
                                                        onChange: (e) => setCharCount(e.target.value.length),
                                                })}
                                        />
                                        {/* Char counter */}
                                        <span className={cn(
                                                'text-xs font-normal font-text self-end',
                                                charCount >= MAX_DESCRIPTION_CHARS
                                                        ? 'text-[#EF4444]'
                                                        : 'text-[#9CA3AF]'
                                        )}>
                                                {charCount} / {MAX_DESCRIPTION_CHARS}
                                        </span>
                                </div>
                        </FormRow>

                        {/* 4. Upload Photos (Optional) */}
                        <FormRow
                                label='Upload Photos'
                                htmlFor='photos'
                                optional
                                description='Attach up to 4 photos that support your report. JPG, PNG · Max 5MB each.'
                                error={errors.photos?.message as string}
                        >
                                <div className='flex flex-col gap-3'>
                                        <label
                                                htmlFor='photos'
                                                className={cn(
                                                        'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xs p-5 cursor-pointer transition-colors duration-200 group',
                                                        errors.photos
                                                                ? 'border-[#EF4444] bg-[#FFF5F5]'
                                                                : 'border-[#E5E7EB] hover:border-[#1A56DB]'
                                                )}
                                        >
                                                <Upload className={cn('w-6 h-6', errors.photos ? 'text-[#EF4444]' : 'text-[#9CA3AF]')} />
                                                <div className='text-center'>
                                                        <span className={cn(
                                                                'text-sm font-medium font-text',
                                                                errors.photos
                                                                        ? 'text-[#EF4444]'
                                                                        : 'text-[#1A56DB] group-hover:underline'
                                                        )}>
                                                                Click to upload
                                                        </span>
                                                        <span className='text-[#6B7280] text-sm font-text'>
                                                                {' '}or drag and drop
                                                        </span>
                                                </div>
                                                <input
                                                        id='photos'
                                                        type='file'
                                                        accept='image/jpeg, image/png'
                                                        multiple
                                                        className='hidden'
                                                        {...photoRest}
                                                        ref={(e) => {
                                                                photoRef(e)
                                                                photoInputRef.current = e
                                                        }}
                                                        onChange={handlePhotoChange}
                                                />
                                        </label>

                                        {/* Photo previews */}
                                        {previews.length > 0 && (
                                                <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                                                        {previews.map((preview, index) => (
                                                                <div
                                                                        key={index}
                                                                        className='relative rounded-md overflow-clip border border-[#E5E7EB]'
                                                                >
                                                                        <Image
                                                                                src={preview.url}
                                                                                alt={preview.name}
                                                                                width={250}
                                                                                height={250}
                                                                                className='object-cover object-center aspect-square rounded-sm'
                                                                        />
                                                                        <button
                                                                                type='button'
                                                                                onClick={() => removePreview(index)}
                                                                                aria-label={`Remove ${preview.name}`}
                                                                                className='absolute top-1 right-1 bg-black/60 hover:bg-[#EF4444] text-white rounded-full p-0.5 transition-colors duration-300 cursor-pointer'
                                                                        >
                                                                                <X className='size-3'/>
                                                                        </button>
                                                                </div>
                                                        ))}
                                                </div>
                                        )}
                                </div>
                        </FormRow>

                        <Separator />

                        {/* 5. Mark as Urgent */}
                        <div className='flex items-center justify-between gap-6'>
                                <div className='flex flex-col gap-0.5'>
                                        <span className='text-[#1F2937] text-sm font-semibold font-text'>
                                                Mark as Urgent
                                        </span>
                                        <span className='text-[#6B7280] text-xs font-normal font-text leading-4'>
                                                Select if this is a safety concern or requires immediate attention.
                                        </span>
                                </div>
                                <Controller
                                        name='isUrgent'
                                        control={control}
                                        render={({ field }) => (
                                                <div className='flex items-center gap-2.5 shrink-0'>
                                                        <span className={cn(
                                                                'text-sm font-medium font-text transition-colors duration-200',
                                                                !field.value ? 'text-[#1F2937]' : 'text-[#9CA3AF]'
                                                        )}>
                                                                No
                                                        </span>
                                                        <Switch
                                                                id='isUrgent'
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                className='border border-[#D1D5DC] bg-[#D1D5DC] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]'
                                                        />
                                                        <span className={cn(
                                                                'text-sm font-medium font-text transition-colors duration-200',
                                                                field.value ? 'text-[#EF4444]' : 'text-[#9CA3AF]'
                                                        )}>
                                                                Yes
                                                        </span>
                                                </div>
                                        )}
                                />
                        </div>

                        <Separator />

                        {/* Submit */}
                        <Button
                                type='submit'
                                disabled={isSubmitting}
                                className='w-full bg-[#1A56DB] hover:bg-[#1E429F] text-white font-medium font-text rounded-xs cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none'
                        >
                                {isSubmitting ? (
                                        <span className='flex items-center gap-2'>
                                                <Loader2 className='animate-spin w-4 h-4' />
                                                Submitting...
                                        </span>
                                ) : 'Submit Report'}
                        </Button>
                        <div>
                                <span className='text-center text-gray-500 font-normal text-sm max-w-152.5 mx-auto block'>
                                        Our support team will review your report and respond within 24 hours. For urgent safety concerns please also call our support line directly.
                                </span>
                        </div>
                </form>
        )
}

// ─── Form row ─────────────────────────────────────────────────────────────────

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
                <Label htmlFor={htmlFor} className='text-[#6B7280] text-xs uppercase font-medium font-text'>
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
                                <AlertTriangle className='w-3 h-3 shrink-0' />
                                {error}
                        </span>
                )}
        </div>
)

// ─── Input class helper ───────────────────────────────────────────────────────

const inputCn = (hasError: boolean) => cn(
        'border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] w-full',
        hasError && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
)