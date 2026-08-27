'use client'

import { useState } from 'react'
import {
        useForm,
        Controller,
        RegisterOptions,
} from 'react-hook-form'
import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FieldSeparator } from '@/components/ui/field'
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from '@/components/ui/select'
import { validators } from './form.validators'
import Image from 'next/image'
import { issueTypeOptions } from '@/types/issueReport.type'
import { useCreateRenterIssueReportMutation } from '@/app/store/services/reportApi'

const ISSUE_TYPES = issueTypeOptions

const MAX_PHOTOS = 4
const MAX_PHOTO_SIZE_MB = 5

type ReportFormValues = {
        bookingReference: string
        issueType: string
        description: string
        isUrgent: boolean
}

export default function ReportAnIssueForm() {
        const [photoUrls, setPhotoUrls] = useState<string[]>([])
        const [createRenterIssueReport] = useCreateRenterIssueReportMutation()

        const {
                register,
                handleSubmit,
                control,
                formState: { errors, isSubmitting },
        } = useForm<ReportFormValues>({
                mode: 'onTouched',
                defaultValues: { isUrgent: false },
        })

        const onSubmit = async (values: ReportFormValues) => {
                await createRenterIssueReport({
                        bookingReference: values.bookingReference,
                        issueType: values.issueType,
                        description: values.description,
                        isUrgent: values.isUrgent,
                        photoUrls,
                }).unwrap()
        }

        return (
                <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-5 w-full'
                        noValidate
                >
                        <FormRow
                                label='Booking Reference'
                                htmlFor='bookingReference'
                                description='Find your booking reference in your confirmation email or profile page.'
                                required
                                error={errors.bookingReference?.message}
                        >
                                <div className='relative flex items-center'>
                                        <span className='absolute left-3 text-[#9CA3AF] pointer-events-none text-sm font-medium font-text'>
                                                #
                                        </span>
                                        <Input
                                                id='bookingReference'
                                                type='text'
                                                placeholder='e.g. SR-2026-0042'
                                                className={cn(
                                                        'pl-7 border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] rounded-xs',
                                                        errors.bookingReference && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                )}
                                                {...register('bookingReference', {
                                                        ...validators.required('Booking reference'),
                                                        pattern: {
                                                                value: /^SR-\d{4}-\d{4}$/,
                                                                message: 'Enter a valid booking reference (e.g. SR-2026-0042)',
                                                        },
                                                } as RegisterOptions<ReportFormValues, 'bookingReference'>)}
                                        />
                                </div>
                        </FormRow>

                        {/* Issue Type */}
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
                                        rules={validators.required('Issue type') as RegisterOptions<ReportFormValues, 'issueType'>}
                                        render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger
                                                                id='issueType'
                                                                className={cn(
                                                                        'w-full border-[#E5E7EB] focus:ring-[#1A56DB] font-text text-sm text-[#1F2937] rounded-xs',
                                                                        errors.issueType && 'border-[#EF4444] focus:ring-[#EF4444]'
                                                                )}
                                                        >
                                                                <SelectValue placeholder='Select an issue type' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                {ISSUE_TYPES.map((type) => (
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

                        {/* Describe Issue */}
                        <FormRow
                                label='Describe the Issue'
                                htmlFor='description'
                                required
                                error={errors.description?.message}
                        >
                                <Textarea
                                        id='description'
                                        placeholder='Please describe the issue in as much detail as possible. Include dates, times, and any relevant information.'
                                        rows={8}
                                        className={cn(
                                                'resize-none h-34 border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] rounded-xs',
                                                errors.description && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                        )}
                                        {...register('description', {
                                                ...validators.required('Description'),
                                                ...validators.minLength(20, 'Description'),
                                        } as RegisterOptions<ReportFormValues, 'description'>)}
                                />
                        </FormRow>

                        {/* Upload Photos */}
                        <FormRow
                                label='Upload Photos'
                                htmlFor='photos'
                                description='Attach up to 4 photos that support your report. JPG, PNG · Max 5MB each.'
                                optional
                        >
                                <PhotoUpload onUpload={setPhotoUrls} />
                        </FormRow>

                        <FieldSeparator />

                        {/* Mark as Urgent */}
                        <FormRow
                                label='Mark as Urgent'
                                htmlFor='isUrgent'
                                description='Select if this is a safety concern or requires immediate attention.'
                        >
                                <Controller
                                        name='isUrgent'
                                        control={control}
                                        render={({ field }) => (
                                                <div className='flex items-center gap-3'>
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
                        </FormRow>

                        <FieldSeparator />

                        <Button
                                type='submit'
                                disabled={isSubmitting}
                                className='w-full py-4 px-6 h-fit bg-[#1A56DB] hover:bg-[#1E429F] text-white font-medium font-text cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none rounded-xs'
                        >
                                {isSubmitting ? (
                                        <span className='flex items-center gap-2'>
                                                <LoadingSpinner />
                                                Submitting...
                                        </span>
                                ) : 'Submit Report'}
                        </Button>
                </form>
        )
}

type PhotoUploadProps = {
        onUpload: (urls: string[]) => void
}

const PhotoUpload = ({ onUpload }: PhotoUploadProps) => {
        const [previews, setPreviews] = useState<{ name: string; url: string }[]>([])
        const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
        const [uploading, setUploading] = useState(false)
        const [error, setError] = useState<string | undefined>()

        const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
                const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS)
                if (!files.length) return

                const oversized = files.filter(f => f.size / (1024 * 1024) > MAX_PHOTO_SIZE_MB)
                if (oversized.length) { setError(`Each photo must be under ${MAX_PHOTO_SIZE_MB}MB`); return }
                const invalid = files.filter(f => !['image/jpeg', 'image/png'].includes(f.type))
                if (invalid.length) { setError('Only JPG and PNG files are allowed'); return }

                setError(undefined)
                setPreviews(files.map(file => ({ name: file.name, url: URL.createObjectURL(file) })))
                setUploading(true)

                try {
                        const urls = await Promise.all(files.map(async (file) => {
                                const fd = new FormData()
                                fd.append('file', file)
                                const res = await fetch('/api/upload', { method: 'POST', body: fd })
                                const data = await res.json()
                                return data.secure_url as string
                        }))
                        setUploadedUrls(urls)
                        onUpload(urls)
                } catch {
                        setError('Upload failed. Please try again.')
                } finally {
                        setUploading(false)
                }
        }

        const removePreview = (index: number) => {
                const nextUrls = uploadedUrls.filter((_, i) => i !== index)
                setPreviews(prev => prev.filter((_, i) => i !== index))
                setUploadedUrls(nextUrls)
                onUpload(nextUrls)
        }

        return (
                <div className='flex flex-col gap-3'>
                        <label
                                htmlFor='photos'
                                className={cn(
                                        'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-5 cursor-pointer transition-colors duration-200 group',
                                        error
                                                ? 'border-[#EF4444] bg-[#FFF5F5]'
                                                : 'border-[#E5E7EB] hover:border-[#1A56DB]'
                                )}
                        >
                                <UploadIcon />
                                <div className='text-center'>
                                        <span className={cn(
                                                'text-sm font-medium font-text',
                                                error ? 'text-[#EF4444]' : 'text-[#1A56DB] group-hover:underline'
                                        )}>
                                                {uploading ? 'Uploading...' : 'Click to upload'}
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
                                        onChange={handleChange}
                                        disabled={uploading}
                                />
                        </label>

                        {error && (
                                <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                                        <ErrorIcon />
                                        {error}
                                </span>
                        )}

                        {previews.length > 0 && (
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                                        {previews.map((preview, index) => (
                                                <div key={index} className='relative group rounded-md overflow-clip border border-[#E5E7EB]'>
                                                        <Image
                                                                src={preview.url}
                                                                alt={preview.name}
                                                                width={250}
                                                                height={250}
                                                                className='w-full aspect-square object-cover'
                                                        />
                                                        {uploading && (
                                                                <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                                                                        <LoadingSpinner />
                                                                </div>
                                                        )}
                                                        {!uploading && (
                                                                <button
                                                                        type='button'
                                                                        onClick={() => removePreview(index)}
                                                                        className='absolute top-1 right-1 bg-black/60 hover:bg-[#EF4444] text-white rounded-full p-0.5 transition-colors duration-150 cursor-pointer'
                                                                        aria-label={`Remove ${preview.name}`}
                                                                >
                                                                        <SmallCloseIcon />
                                                                </button>
                                                        )}
                                                </div>
                                        ))}
                                </div>
                        )}
                </div>
        )
}

type FormRowProps = {
        label: string
        htmlFor: string
        description?: string
        required?: boolean
        optional?: boolean
        error?: string
        children: React.ReactNode
}

const FormRow = ({
        label,
        htmlFor,
        description,
        required,
        optional,
        error,
        children,
}: FormRowProps) => (
        <div className='flex flex-col gap-1.5'>
                <Label
                        htmlFor={htmlFor}
                        className='text-[#1F2937] text-sm font-semibold font-text'
                >
                        {label}
                        {required && <span className='text-[#EF4444] ml-1'>*</span>}
                        {optional && (
                                <span className='text-[#9CA3AF] font-normal ml-1'>(Optional)</span>
                        )}
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

const UploadIcon = () => (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M12 16V8M12 8L9 11M12 8L15 11' stroke='#9CA3AF' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M8 20H16M4 16V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V16' stroke='#9CA3AF' strokeWidth='1.5' strokeLinecap='round' />
        </svg>
)

const SmallCloseIcon = () => (
        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M9 3L3 9M3 3L9 9' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
)

const ErrorIcon = () => (
        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M6 1L11 10H1L6 1Z' stroke='#EF4444' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M6 5V7' stroke='#EF4444' strokeWidth='1' strokeLinecap='round' />
                <circle cx='6' cy='8.5' r='0.5' fill='#EF4444' />
        </svg>
)

const LoadingSpinner = () => (
        <svg className='animate-spin w-4 h-4' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
        </svg>
)
