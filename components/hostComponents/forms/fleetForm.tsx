'use client'

import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Image from 'next/image'
import {
        Info,
        Fingerprint,
        Banknote,
        CalendarCheck,
        SlidersVertical,
        MapPin,
        Camera,
        CalendarIcon,
        Upload,
        FileText,
        X,
        AlertTriangle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from '@/components/ui/select'
import {
        Popover,
        PopoverContent,
        PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

// ─── Constants ────────────────────────────────────────────────────────────────

const VEHICLE_TYPES = [
        'Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible',
        'Van', 'Hatchback', 'Minivan', 'Pickup Truck', 'Sports Car', 'Luxury', 'Electric',
]

const STATUS_OPTIONS = ['Available', 'Rented', 'Maintenance', 'Inactive']
const TRANSMISSION_OPTIONS = ['Automatic', 'Manual', 'CVT']

const MAX_IMAGES = 5
const MAX_IMAGE_SIZE_MB = 10
const MAX_DOC_SIZE_MB = 10

// ─── Types ────────────────────────────────────────────────────────────────────

export type FleetFormValues = {
        vehicleName: string
        make: string
        model: string
        year: number | ''
        color: string
        vehicleType: string

        insuranceCarrier: string
        insurancePolicyNumber: string
        insuranceExpiration: string

        licensePlate: string
        vin: string

        priceDaily: number | ''
        priceWeekly: number | ''
        priceMonthly: number | ''

        status: string
        instantlyAvailable: boolean

        transmission: string
        seats: number | ''
        mileage: number | ''

        pickupAddress: string
        city: string

        vehicleImages?: FileList
        vehicleRegistration?: FileList
        description: string
        pickupInstructions: string
}

type FleetFormProps = {
        formId: string
        defaultValues?: Partial<FleetFormValues>
        onSubmit: (values: FleetFormValues) => void | Promise<void>
}

const FALLBACK_DEFAULTS: FleetFormValues = {
        vehicleName: '',
        make: '',
        model: '',
        year: '',
        color: '',
        vehicleType: '',
        insuranceCarrier: '',
        insurancePolicyNumber: '',
        insuranceExpiration: '',
        licensePlate: '',
        vin: '',
        priceDaily: '',
        priceWeekly: '',
        priceMonthly: '',
        status: '',
        instantlyAvailable: false,
        transmission: '',
        seats: '',
        mileage: '',
        pickupAddress: '',
        city: '',
        description: '',
        pickupInstructions: '',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FleetForm({ formId, defaultValues, onSubmit }: FleetFormProps) {
        const {
                register,
                handleSubmit,
                control,
                formState: { errors },
        } = useForm<FleetFormValues>({
                mode: 'onTouched',
                defaultValues: { ...FALLBACK_DEFAULTS, ...defaultValues },
        })

        return (
                <form
                        id={formId}
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-6 w-full'
                        noValidate
                >
                        {/* ── Top section: left + right columns ───────────── */}
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

                                {/* ── Left column ──────────────────────────── */}
                                <div className='flex flex-col gap-6'>

                                        {/* Cell 1: Vehicle Information */}
                                        <Cell icon={<Info />} title='Vehicle Information'>
                                                <FormRow label='Vehicle Name' htmlFor='vehicleName' error={errors.vehicleName?.message}>
                                                        <Input
                                                                id='vehicleName'
                                                                type='text'
                                                                placeholder='e.g. Luxury Tesla Model S'
                                                                className={inputCn(!!errors.vehicleName)}
                                                                {...register('vehicleName', { required: 'Vehicle name is required' })}
                                                        />
                                                </FormRow>

                                                <div className='grid grid-cols-2 gap-3'>
                                                        <FormRow label='Make' htmlFor='make' error={errors.make?.message}>
                                                                <Input
                                                                        id='make'
                                                                        type='text'
                                                                        placeholder='Tesla'
                                                                        className={inputCn(!!errors.make)}
                                                                        {...register('make', { required: 'Make is required' })}
                                                                />
                                                        </FormRow>
                                                        <FormRow label='Model' htmlFor='model' error={errors.model?.message}>
                                                                <Input
                                                                        id='model'
                                                                        type='text'
                                                                        placeholder='Model S'
                                                                        className={inputCn(!!errors.model)}
                                                                        {...register('model', { required: 'Model is required' })}
                                                                />
                                                        </FormRow>
                                                </div>

                                                <div className='grid grid-cols-3 gap-3'>
                                                        <FormRow label='Year' htmlFor='year' error={errors.year?.message}>
                                                                <Input
                                                                        id='year'
                                                                        type='number'
                                                                        placeholder='2025'
                                                                        className={inputCn(!!errors.year)}
                                                                        {...register('year', {
                                                                                required: 'Year is required',
                                                                                valueAsNumber: true,
                                                                                min: { value: 1980, message: 'Enter a valid year' },
                                                                                max: { value: new Date().getFullYear() + 1, message: 'Enter a valid year' },
                                                                        })}
                                                                />
                                                        </FormRow>
                                                        <FormRow label='Color' htmlFor='color' error={errors.color?.message}>
                                                                <Input
                                                                        id='color'
                                                                        type='text'
                                                                        placeholder='White'
                                                                        className={inputCn(!!errors.color)}
                                                                        {...register('color', { required: 'Color is required' })}
                                                                />
                                                        </FormRow>
                                                        <FormRow label='Vehicle Type' htmlFor='vehicleType' error={errors.vehicleType?.message}>
                                                                <Controller
                                                                        name='vehicleType'
                                                                        control={control}
                                                                        rules={{ required: 'Select a vehicle type' }}
                                                                        render={({ field }) => (
                                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                                        <SelectTrigger id='vehicleType' className={inputCn(!!errors.vehicleType)}>
                                                                                                <SelectValue placeholder='Select' />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                {VEHICLE_TYPES.map(type => (
                                                                                                        <SelectItem key={type} value={type} className='font-text text-sm'>
                                                                                                                {type}
                                                                                                        </SelectItem>
                                                                                                ))}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        )}
                                                                />
                                                        </FormRow>
                                                </div>
                                        </Cell>

                                        {/* Cell 2: Insurance Details */}
                                        <Cell icon={<Info />} title='Insurance Details'>
                                                <div className='grid grid-cols-2 gap-3'>
                                                        <FormRow label='Carrier / Company' htmlFor='insuranceCarrier' error={errors.insuranceCarrier?.message}>
                                                                <Input
                                                                        id='insuranceCarrier'
                                                                        type='text'
                                                                        placeholder='e.g. Progressive'
                                                                        className={inputCn(!!errors.insuranceCarrier)}
                                                                        {...register('insuranceCarrier', { required: 'Carrier is required' })}
                                                                />
                                                        </FormRow>
                                                        <FormRow label='Policy Number' htmlFor='insurancePolicyNumber' error={errors.insurancePolicyNumber?.message}>
                                                                <Input
                                                                        id='insurancePolicyNumber'
                                                                        type='text'
                                                                        placeholder='e.g. PLY-209384'
                                                                        className={inputCn(!!errors.insurancePolicyNumber)}
                                                                        {...register('insurancePolicyNumber', { required: 'Policy number is required' })}
                                                                />
                                                        </FormRow>
                                                </div>

                                                <FormRow label='Expiration Date' htmlFor='insuranceExpiration' error={errors.insuranceExpiration?.message}>
                                                        <DatePickerField
                                                                name='insuranceExpiration'
                                                                control={control}
                                                                placeholder='Pick expiration date'
                                                                error={errors.insuranceExpiration?.message}
                                                                rules={{ required: 'Expiration date is required' }}
                                                        />
                                                </FormRow>
                                        </Cell>

                                        {/* Cell 3: Identification */}
                                        <Cell icon={<Fingerprint />} title='Identification'>
                                                <div className='grid grid-cols-2 gap-3'>
                                                        <FormRow label='License Plate' htmlFor='licensePlate' error={errors.licensePlate?.message}>
                                                                <Input
                                                                        id='licensePlate'
                                                                        type='text'
                                                                        placeholder='e.g. ABC-1234'
                                                                        className={inputCn(!!errors.licensePlate)}
                                                                        {...register('licensePlate', { required: 'License plate is required' })}
                                                                />
                                                        </FormRow>
                                                        <FormRow label='VIN' htmlFor='vin' error={errors.vin?.message}>
                                                                <Input
                                                                        id='vin'
                                                                        type='text'
                                                                        placeholder='e.g. 1HGCM82633A123456'
                                                                        className={inputCn(!!errors.vin)}
                                                                        {...register('vin', {
                                                                                required: 'VIN is required',
                                                                                minLength: { value: 17, message: 'VIN must be 17 characters' },
                                                                                maxLength: { value: 17, message: 'VIN must be 17 characters' },
                                                                        })}
                                                                />
                                                        </FormRow>
                                                </div>
                                        </Cell>

                                        {/* Cell 4: Pricing */}
                                        <Cell icon={<Banknote />} title='Pricing (USD)'>
                                                <div className='grid grid-cols-3 gap-3'>
                                                        <FormRow label='Daily' htmlFor='priceDaily' error={errors.priceDaily?.message}>
                                                                <PriceInput
                                                                        id='priceDaily'
                                                                        hasError={!!errors.priceDaily}
                                                                        {...register('priceDaily', {
                                                                                required: 'Daily rate is required',
                                                                                valueAsNumber: true,
                                                                                min: { value: 0, message: 'Cannot be negative' },
                                                                        })}
                                                                />
                                                        </FormRow>
                                                        <FormRow label='Weekly' htmlFor='priceWeekly' error={errors.priceWeekly?.message}>
                                                                <PriceInput
                                                                        id='priceWeekly'
                                                                        hasError={!!errors.priceWeekly}
                                                                        {...register('priceWeekly', {
                                                                                required: 'Weekly rate is required',
                                                                                valueAsNumber: true,
                                                                                min: { value: 0, message: 'Cannot be negative' },
                                                                        })}
                                                                />
                                                        </FormRow>
                                                        <FormRow label='Monthly' htmlFor='priceMonthly' error={errors.priceMonthly?.message}>
                                                                <PriceInput
                                                                        id='priceMonthly'
                                                                        hasError={!!errors.priceMonthly}
                                                                        {...register('priceMonthly', {
                                                                                required: 'Monthly rate is required',
                                                                                valueAsNumber: true,
                                                                                min: { value: 0, message: 'Cannot be negative' },
                                                                        })}
                                                                />
                                                        </FormRow>
                                                </div>
                                        </Cell>
                                </div>

                                {/* ── Right column ─────────────────────────── */}
                                <div className='flex flex-col gap-6'>

                                        {/* Cell 1: Status & Availability */}
                                        <Cell icon={<CalendarCheck />} title='Status & Availability'>
                                                <div className='grid grid-cols-2 gap-3'>
                                                        <FormRow label='Status' htmlFor='status' error={errors.status?.message}>
                                                                <Controller
                                                                        name='status'
                                                                        control={control}
                                                                        rules={{ required: 'Select a status' }}
                                                                        render={({ field }) => (
                                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                                        <SelectTrigger id='status' className={inputCn(!!errors.status)}>
                                                                                                <SelectValue placeholder='Select status' />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                {STATUS_OPTIONS.map(opt => (
                                                                                                        <SelectItem key={opt} value={opt} className='font-text text-sm'>
                                                                                                                {opt}
                                                                                                        </SelectItem>
                                                                                                ))}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        )}
                                                                />
                                                        </FormRow>

                                                        <div className='flex flex-col gap-1.5'>
                                                                <Controller
                                                                        name='instantlyAvailable'
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                                <div className='flex items-center justify-between h-full gap-3 pt-5'>
                                                                                        <Label
                                                                                                htmlFor='instantlyAvailable'
                                                                                                className='text-gray-500 text-xs font-medium uppercase cursor-pointer'
                                                                                        >
                                                                                                Instantly Available
                                                                                        </Label>
                                                                                        <Switch
                                                                                                id='instantlyAvailable'
                                                                                                checked={field.value}
                                                                                                onCheckedChange={field.onChange}
                                                                                                className='border border-[#D1D5DC] bg-[#D1D5DC] data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700'
                                                                                        />
                                                                                </div>
                                                                        )}
                                                                />
                                                        </div>
                                                </div>
                                        </Cell>

                                        {/* Cell 2: Vehicle Specs */}
                                        <Cell icon={<SlidersVertical />} title='Vehicle Specs'>
                                                <div className='grid grid-cols-3 gap-3'>
                                                        <FormRow label='Transmission' htmlFor='transmission' error={errors.transmission?.message}>
                                                                <Controller
                                                                        name='transmission'
                                                                        control={control}
                                                                        rules={{ required: 'Select transmission' }}
                                                                        render={({ field }) => (
                                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                                        <SelectTrigger id='transmission' className={inputCn(!!errors.transmission)}>
                                                                                                <SelectValue placeholder='Select' />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                {TRANSMISSION_OPTIONS.map(opt => (
                                                                                                        <SelectItem key={opt} value={opt} className='font-text text-sm'>
                                                                                                                {opt}
                                                                                                        </SelectItem>
                                                                                                ))}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        )}
                                                                />
                                                        </FormRow>
                                                        <FormRow label='Seats' htmlFor='seats' error={errors.seats?.message}>
                                                                <Input
                                                                        id='seats'
                                                                        type='number'
                                                                        placeholder='5'
                                                                        className={inputCn(!!errors.seats)}
                                                                        {...register('seats', {
                                                                                required: 'Seats is required',
                                                                                valueAsNumber: true,
                                                                                min: { value: 1, message: 'Must be at least 1' },
                                                                        })}
                                                                />
                                                        </FormRow>
                                                        <FormRow label='Mileage (mi)' htmlFor='mileage' error={errors.mileage?.message}>
                                                                <Input
                                                                        id='mileage'
                                                                        type='number'
                                                                        placeholder='e.g. 12000'
                                                                        className={inputCn(!!errors.mileage)}
                                                                        {...register('mileage', {
                                                                                required: 'Mileage is required',
                                                                                valueAsNumber: true,
                                                                                min: { value: 0, message: 'Cannot be negative' },
                                                                        })}
                                                                />
                                                        </FormRow>
                                                </div>
                                        </Cell>

                                        {/* Cell 3: Location */}
                                        <Cell icon={<MapPin />} title='Location'>
                                                <FormRow label='Pickup Location Address' htmlFor='pickupAddress' error={errors.pickupAddress?.message}>
                                                        <Input
                                                                id='pickupAddress'
                                                                type='text'
                                                                placeholder='e.g. 123 Main Street'
                                                                className={inputCn(!!errors.pickupAddress)}
                                                                {...register('pickupAddress', { required: 'Pickup address is required' })}
                                                        />
                                                </FormRow>
                                                <FormRow label='City' htmlFor='city' error={errors.city?.message}>
                                                        <Input
                                                                id='city'
                                                                type='text'
                                                                placeholder='e.g. Austin'
                                                                className={inputCn(!!errors.city)}
                                                                {...register('city', { required: 'City is required' })}
                                                        />
                                                </FormRow>
                                        </Cell>
                                </div>
                        </div>

                        {/* ── Bottom section: Media & Information (full width) ── */}
                        <Cell icon={<Camera />} title='Media & Information'>
                                <ImagesUpload
                                        register={register}
                                        error={errors.vehicleImages?.message as string}
                                />

                                <RegistrationUpload
                                        register={register}
                                        error={errors.vehicleRegistration?.message as string}
                                />

                                <FormRow label='Vehicle Description' htmlFor='description' error={errors.description?.message}>
                                        <Textarea
                                                id='description'
                                                placeholder="Describe the vehicle's features, unique selling points, and any specific terms..."
                                                className={cn(
                                                        'resize-none font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] h-50',
                                                        errors.description
                                                                ? 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                                : 'border-[#E5E7EB] focus-visible:ring-blue-700 rounded-xs'
                                                )}
                                                {...register('description', { required: 'Description is required' })}
                                        />
                                </FormRow>

                                <FormRow label='Pickup Instructions' htmlFor='pickupInstructions' error={errors.pickupInstructions?.message}>
                                        <Textarea
                                                id='pickupInstructions'
                                                placeholder='Add any instructions for renters about pickup location, key collection, parking, or vehicle access...'
                                                className={cn(
                                                        'resize-none font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] h-50',
                                                        errors.pickupInstructions
                                                                ? 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                                : 'border-[#E5E7EB] focus-visible:ring-blue-700 rounded-xs'
                                                )}
                                                {...register('pickupInstructions', { required: 'Pickup instructions are required' })}
                                        />
                                </FormRow>
                        </Cell>
                </form>
        )
}

// ─── Cell wrapper ─────────────────────────────────────────────────────────────

const Cell = ({
        icon,
        title,
        children,
}: {
        icon: React.ReactNode
        title: string
        children: React.ReactNode
}) => (
        <div className='bg-white rounded-xs p-3 md:p-10 flex flex-col gap-5'>
                <div className='flex items-center gap-2'>
                        <span className='text-blue-700 size-5 [&>svg]:size-5'>{icon}</span>
                        <span className='text-neutral-950 text-base font-semibold font-text'>
                                {title}
                        </span>
                </div>
                <div className='flex flex-col gap-4'>
                        {children}
                </div>
        </div>
)

// ─── Form row ─────────────────────────────────────────────────────────────────

type FormRowProps = {
        label: string
        htmlFor: string
        error?: string
        children: React.ReactNode
}

const FormRow = ({ label, htmlFor, error, children }: FormRowProps) => (
        <div className='flex flex-col gap-1.5'>
                <Label htmlFor={htmlFor} className='text-gray-500 text-xs font-medium uppercase'>
                        {label}
                </Label>
                {children}
                {error && (
                        <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                                <AlertTriangle className='w-3 h-3 shrink-0' />
                                {error}
                        </span>
                )}
        </div>
)

// ─── Price input ($ prefix) ────────────────────────────────────────────────────

const PriceInput = ({
        hasError,
        ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) => (
        <div className='relative flex items-center'>
                <span className='absolute left-3 text-[#6B7280] text-sm font-medium pointer-events-none select-none'>
                        $
                </span>
                <Input
                        type='number'
                        placeholder='0.00'
                        min={0}
                        step={0.01}
                        className={cn(inputCn(!!hasError), 'pl-7')}
                        {...props}
                />
        </div>
)

// ─── Date picker ──────────────────────────────────────────────────────────────

type DatePickerFieldProps = {
        name: keyof FleetFormValues
        control: ReturnType<typeof useForm<FleetFormValues>>['control']
        placeholder?: string
        error?: string
        rules?: object
}

const DatePickerField = ({ name, control, placeholder, error, rules }: DatePickerFieldProps) => (
        <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => {
                        const parsed = field.value ? new Date(field.value as string) : undefined

                        return (
                                <Popover>
                                        <PopoverTrigger asChild>
                                                <Button
                                                        type='button'
                                                        variant='outline'
                                                        className={cn(
                                                                'w-full justify-start text-left font-normal rounded-xs font-text text-sm',
                                                                !parsed && 'text-[#9CA3AF]',
                                                                error
                                                                        ? 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                                        : 'border-[#E5E7EB] focus-visible:ring-blue-700'
                                                        )}
                                                >
                                                        <CalendarIcon className='mr-2 h-4 w-4 text-[#9CA3AF] shrink-0' />
                                                        {parsed ? format(parsed, 'MMM d, yyyy') : placeholder ?? 'Pick a date'}
                                                </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                                <Calendar
                                                        mode='single'
                                                        selected={parsed}
                                                        onSelect={(date) => field.onChange(date?.toISOString() ?? '')}
                                                        initialFocus
                                                />
                                        </PopoverContent>
                                </Popover>
                        )
                }}
        />
)

// ─── Vehicle images upload (multi, up to 5) ───────────────────────────────────

const ImagesUpload = ({
        register,
        error,
}: {
        register: ReturnType<typeof useForm<FleetFormValues>>['register']
        error?: string
}) => {
        const [previews, setPreviews] = useState<{ name: string; url: string }[]>([])
        const inputRef = useRef<HTMLInputElement | null>(null)

        const { ref, ...rest } = register('vehicleImages', {
                validate: {
                        maxFiles: (files: FileList | undefined) => {
                                if (!files?.length) return true
                                return files.length <= MAX_IMAGES || `Maximum ${MAX_IMAGES} images allowed`
                        },
                        maxSize: (files: FileList | undefined) => {
                                if (!files?.length) return true
                                const oversized = Array.from(files).filter(f => f.size / (1024 * 1024) > MAX_IMAGE_SIZE_MB)
                                return oversized.length === 0 || `Each image must be under ${MAX_IMAGE_SIZE_MB}MB`
                        },
                        fileType: (files: FileList | undefined) => {
                                if (!files?.length) return true
                                const invalid = Array.from(files).filter(
                                        f => !['image/png', 'image/jpeg', 'image/webp'].includes(f.type)
                                )
                                return invalid.length === 0 || 'Only PNG, JPG and WEBP files are allowed'
                        },
                },
        })

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                rest.onChange(e)
                const files = Array.from(e.target.files ?? []).slice(0, MAX_IMAGES)
                setPreviews(files.map(f => ({ name: f.name, url: URL.createObjectURL(f) })))
        }

        const removePreview = (index: number) => {
                setPreviews(prev => prev.filter((_, i) => i !== index))
        }

        return (
                <FormRow label='Vehicle Images' htmlFor='vehicleImages' error={error}>
                        <label
                                htmlFor='vehicleImages'
                                className={cn(
                                        'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xs p-5 cursor-pointer transition-colors duration-200 group',
                                        error ? 'border-[#EF4444] bg-[#FFF5F5]' : 'border-[#E5E7EB] hover:border-blue-700'
                                )}
                        >
                                <Upload className={cn('w-6 h-6', error ? 'text-[#EF4444]' : 'text-[#9CA3AF]')} />
                                <span className={cn(
                                        'text-sm font-medium font-text',
                                        error ? 'text-[#EF4444]' : 'text-blue-700 group-hover:underline'
                                )}>
                                        Click to upload <span className='text-[#6B7280] font-normal'>or drag and drop</span>
                                </span>
                                <span className='text-[#9CA3AF] text-xs font-text'>
                                        PNG, JPG, WEBP up to {MAX_IMAGE_SIZE_MB}MB, up to {MAX_IMAGES} images
                                </span>
                                <input
                                        id='vehicleImages'
                                        type='file'
                                        accept='image/png, image/jpeg, image/webp'
                                        multiple
                                        className='hidden'
                                        {...rest}
                                        ref={(e) => { ref(e); inputRef.current = e }}
                                        onChange={handleChange}
                                />
                        </label>

                        {previews.length > 0 && (
                                <div className='grid grid-cols-3 md:grid-cols-5 gap-2 mt-2'>
                                        {previews.map((preview, index) => (
                                                <div key={index} className='relative rounded-xs overflow-clip border border-[#E5E7EB]'>
                                                        <div className='relative w-full aspect-square'>
                                                                <Image src={preview.url} alt={preview.name} fill className='object-cover object-center' />
                                                        </div>
                                                        <button
                                                                type='button'
                                                                onClick={() => removePreview(index)}
                                                                aria-label={`Remove ${preview.name}`}
                                                                className='absolute top-1 right-1 bg-black/60 hover:bg-[#EF4444] text-white rounded-full p-0.5 transition-colors duration-150 cursor-pointer'
                                                        >
                                                                <X className='w-3 h-3' />
                                                        </button>
                                                </div>
                                        ))}
                                </div>
                        )}
                </FormRow>
        )
}

// ─── Vehicle registration upload (single, pdf) ────────────────────────────────

const RegistrationUpload = ({
        register,
        error,
}: {
        register: ReturnType<typeof useForm<FleetFormValues>>['register']
        error?: string
}) => {
        const [fileName, setFileName] = useState<string | null>(null)
        const inputRef = useRef<HTMLInputElement | null>(null)

        const { ref, ...rest } = register('vehicleRegistration', {
                validate: {
                        fileSize: (files: FileList | undefined) => {
                                if (!files?.[0]) return true
                                const sizeMB = files[0].size / (1024 * 1024)
                                return sizeMB <= MAX_DOC_SIZE_MB || `File must be under ${MAX_DOC_SIZE_MB}MB`
                        },
                        fileType: (files: FileList | undefined) => {
                                if (!files?.[0]) return true
                                return files[0].type === 'application/pdf' || 'Only PDF files are allowed'
                        },
                },
        })

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                rest.onChange(e)
                setFileName(e.target.files?.[0]?.name ?? null)
        }

        return (
                <FormRow label='Vehicle Registration' htmlFor='vehicleRegistration' error={error}>
                        <label
                                htmlFor='vehicleRegistration'
                                className={cn(
                                        'flex items-center gap-3 border-2 border-dashed rounded-xs p-4 cursor-pointer transition-colors duration-200 group',
                                        error ? 'border-[#EF4444] bg-[#FFF5F5]' : 'border-[#E5E7EB] hover:border-blue-700'
                                )}
                        >
                                <FileText className={cn('w-5 h-5 shrink-0', error ? 'text-[#EF4444]' : 'text-[#9CA3AF]')} />
                                <div className='flex flex-col gap-0.5'>
                                        <span className={cn(
                                                'text-sm font-medium font-text',
                                                error ? 'text-[#EF4444]' : 'text-blue-700 group-hover:underline'
                                        )}>
                                                {fileName ?? 'Upload registration document'}
                                        </span>
                                        <span className='text-[#9CA3AF] text-xs font-text'>
                                                PDF only · Max {MAX_DOC_SIZE_MB}MB
                                        </span>
                                </div>
                                <input
                                        id='vehicleRegistration'
                                        type='file'
                                        accept='application/pdf'
                                        className='hidden'
                                        {...rest}
                                        ref={(e) => { ref(e); inputRef.current = e }}
                                        onChange={handleChange}
                                />
                        </label>
                </FormRow>
        )
}

// ─── Shared input class helper ────────────────────────────────────────────────

const inputCn = (hasError: boolean) => cn(
        'rounded-xs border-[#E5E7EB] focus-visible:ring-blue-700 font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF] w-full',
        hasError && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
)