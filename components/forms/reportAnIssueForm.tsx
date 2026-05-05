'use client'

import { useState, useRef } from 'react'
import { 
        useForm, 
        Controller, 
        RegisterOptions, 
        UseFormRegister, 
        FieldValues, 
        Path 
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

const ISSUE_TYPES = [
        { label: 'Vehicle Condition', value: 'vehicle-condition' },
        { label: 'Host Behaviour', value: 'host-behaviour' },
        { label: 'Billing & Payment', value: 'billing-payment' },
        { label: 'Booking / Reservation', value: 'booking-reservation' },
        { label: 'Safety Concern', value: 'safety-concern' },
        { label: 'Accident or Damage', value: 'accident-damage' },
        { label: 'Late Return', value: 'late-return' },
        { label: 'Other', value: 'other' },
]

const MAX_PHOTOS = 4
const MAX_PHOTO_SIZE_MB = 5

type ReportFormValues = {
        bookingReference: string
        issueType: string
        description: string
        photos?: FileList
        isUrgent: boolean
}

export default function ReportAnIssueForm() {
        const {
                register,
                handleSubmit,
                control,
                formState: { errors, isSubmitting },
        } = useForm<ReportFormValues>({
                mode: 'onTouched',
                defaultValues: { isUrgent: false },
        })

        const onSubmit = (values: ReportFormValues) => {
                console.log(values)
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
                                error={errors.photos?.message}
                        >
                                <PhotoUpload<ReportFormValues>
                                        register={register}
                                        name='photos'
                                        error={errors.photos?.message as string}
                                />
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

type PhotoUploadProps<T extends FieldValues> = {
        register: UseFormRegister<T>
        name: Path<T>
        error?: string
}

const PhotoUpload = <T extends FieldValues>({ register, name, error }: PhotoUploadProps<T>) => {
        const [previews, setPreviews] = useState<{ name: string; url: string }[]>([])

        const { ref, ...rest } = register(name, {
                validate: {
                        maxFiles: (files: FileList) => {
                                if (!files?.length) return true
                                return files.length <= MAX_PHOTOS || `Maximum ${MAX_PHOTOS} photos allowed`
                        },
                        maxSize: (files: FileList) => {
                                if (!files?.length) return true
                                const oversized = Array.from(files).filter(
                                        f => f.size / (1024 * 1024) > MAX_PHOTO_SIZE_MB
                                )
                                return oversized.length === 0 || `Each photo must be under ${MAX_PHOTO_SIZE_MB}MB`
                        },
                        fileType: (files: FileList) => {
                                if (!files?.length) return true
                                const invalid = Array.from(files).filter(
                                        f => !['image/jpeg', 'image/png'].includes(f.type)
                                )
                                return invalid.length === 0 || 'Only JPG and PNG files are allowed'
                        },
                },
        } as never)

        const inputRef = useRef<HTMLInputElement | null>(null)

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                rest.onChange(e)
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
                <div className='flex flex-col gap-3'>
                        <label
                                htmlFor={name}
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
                                                Click to upload
                                        </span>
                                        <span className='text-[#6B7280] text-sm font-text'>
                                                {' '}or drag and drop
                                        </span>
                                </div>
                                <input
                                        id={name}
                                        type='file'
                                        accept='image/jpeg, image/png'
                                        multiple
                                        className='hidden'
                                        {...rest}
                                        ref={(e) => {
                                                ref(e)
                                                inputRef.current = e
                                        }}
                                        onChange={handleChange}
                                />
                        </label>

                        {previews.length > 0 && (
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                                        {previews.map((preview, index) => (
                                                <div key={index} className='relative group rounded-md overflow-clip border border-[#E5E7EB]'>
                                                        <Image
                                                                src={preview.url}
                                                                alt={preview.name}
                                                                className='w-full aspect-square object-cover'
                                                        />
                                                        <button
                                                                type='button'
                                                                onClick={() => removePreview(index)}
                                                                className='absolute top-1 right-1 bg-black/60 hover:bg-[#EF4444] text-white rounded-full p-0.5 transition-colors duration-150 cursor-pointer'
                                                                aria-label={`Remove ${preview.name}`}
                                                        >
                                                                <SmallCloseIcon />
                                                        </button>
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