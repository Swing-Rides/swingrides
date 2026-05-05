'use client'

import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { format } from 'date-fns'
import { CalendarIcon, LockIcon, EyeIcon, EyeOffIcon, UploadIcon, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
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

import { FormFieldConfig, MainFormProps } from './types'

export default function MainForm({
        title,
        description,
        fields,
        onSubmit,
        submitLabel = 'Submit',
        isLoading = false,
        className,
        rowPairs = [],
}: MainFormProps) {
        const {
                register,
                handleSubmit,
                control,
                getValues,
                formState: { errors },
        } = useForm({ mode: 'onTouched' })

        const renderedPairs = new Set<string>()

        return (
                <form
                        onSubmit={handleSubmit(onSubmit)}
                        className={cn('flex flex-col gap-5', className)}
                        noValidate
                >
                        {(title || description) && (
                                <div className='flex flex-col gap-1'>
                                        {title && (
                                                <h4 className='text-[#1F2937] text-lg font-bold font-text leading-6'>
                                                        {title}
                                                </h4>
                                        )}
                                        {description && (
                                                <p className='text-[#6B7280] text-sm font-normal font-text leading-5'>
                                                        {description}
                                                </p>
                                        )}
                                </div>
                        )}

                        <div className='flex flex-col gap-4'>
                                {fields.map((field) => {
                                        const pair = rowPairs.find(p => p.includes(field.name))

                                        if (pair) {

                                                if (renderedPairs.has(pair[0])) return null
                                                renderedPairs.add(pair[0])

                                                const secondField = fields.find(f => f.name === pair[1])
                                                if (!secondField) return null

                                                return (
                                                        <div key={pair.join('-')} className='flex flex-col md:flex-row gap-4'>
                                                                <FormField
                                                                        field={field}
                                                                        register={register}
                                                                        control={control}
                                                                        getValues={getValues}
                                                                        errors={errors}
                                                                />
                                                                <FormField
                                                                        field={secondField}
                                                                        register={register}
                                                                        control={control}
                                                                        getValues={getValues}
                                                                        errors={errors}
                                                                />
                                                        </div>
                                                )
                                        }

                                        return (
                                                <FormField
                                                        key={field.name}
                                                        field={field}
                                                        register={register}
                                                        control={control}
                                                        getValues={getValues}
                                                        errors={errors}
                                                />
                                        )
                                })}
                        </div>

                        <Button
                                type='submit'
                                disabled={isLoading}
                                className='w-full bg-[#1A56DB] hover:bg-[#1E429F] text-white font-medium font-text rounded-xs cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none'
                        >
                                {isLoading ? (
                                        <span className='flex items-center gap-2'>
                                                <LoadingSpinner />
                                                {submitLabel}...
                                        </span>
                                ) : submitLabel}
                        </Button>
                </form>
        )
}

// ─── Field router ─────────────────────────────────────────────────────────────

type FormFieldProps = {
        field: FormFieldConfig
        register: ReturnType<typeof useForm>['register']
        control: ReturnType<typeof useForm>['control']
        getValues: ReturnType<typeof useForm>['getValues']
        errors: ReturnType<typeof useForm>['formState']['errors']
}

const FormField = ({ field, register, control, errors }: FormFieldProps) => {
        const error = errors[field.name]?.message as string | undefined

        const wrapper = (children: React.ReactNode) => (
                <div className={cn('flex flex-col gap-1.5', field.className)}>
                        {field.label && (
                                <Label
                                        htmlFor={field.name}
                                        className='text-[#6B7280] text-xs font-semibold font-text uppercase'
                                >
                                        {field.label}
                                        {field.validation?.required && (
                                                <span className='text-[#EF4444] ml-1'>*</span>
                                        )}
                                </Label>
                        )}
                        {children}
                        {field.description && !error && (
                                <span className='text-[#9CA3AF] text-xs font-normal font-text'>
                                        {field.description}
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

        switch (field.type) {
                case 'password':
                        return wrapper(<PasswordInput field={field} register={register} error={error} />)
                case 'date':
                        return wrapper(<DateInput field={field} control={control} error={error} />)
                case 'datetime':
                        return wrapper(<DateTimeInput field={field} control={control} error={error} />)
                case 'select':
                        return wrapper(<SelectInput field={field} control={control} error={error} />)
                case 'textarea':
                        return wrapper(<TextareaInput field={field} register={register} error={error} />)
                case 'file':
                case 'image':
                        return wrapper(<FileInput field={field} register={register} error={error} />)
                case 'checkbox':
                        return wrapper(<CheckboxInput field={field} control={control} error={error} />)
                default:
                        return wrapper(<TextInput field={field} register={register} error={error} />)
        }
}

// ─── Input variants ───────────────────────────────────────────────────────────

type InputProps = {
        field: FormFieldConfig
        register: ReturnType<typeof useForm>['register']
        error?: string
}

type ControllerProps = {
        field: FormFieldConfig
        control: ReturnType<typeof useForm>['control']
        error?: string
}

const inputClass = (error?: string) => cn(
        'border-[#E5E7EB] focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] rounded-xs placeholder:text-[#9CA3AF]',
        error && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
)

// Text / email / tel / number
const TextInput = ({ field, register, error }: InputProps) => {
        const hasIcon = !!field.icon

        return (
                <div className='relative flex items-center'>
                        {hasIcon && (
                                <span className='absolute left-3 text-[#9CA3AF] pointer-events-none'>
                                        {field.icon}
                                </span>
                        )}
                        <Input
                                id={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                autoComplete={field.autoComplete}
                                disabled={field.disabled}
                                min={field.min}
                                max={field.max}
                                step={field.step}
                                defaultValue={field.defaultValue as string}
                                className={cn(inputClass(error), hasIcon && 'pl-9')}
                                {...register(field.name, field.validation)}
                        />
                </div>
        )
}

// Password — padlock leading + eye trailing
const PasswordInput = ({ field, register, error }: InputProps) => {
        const [show, setShow] = useState(false)

        return (
                <div className='relative flex items-center'>
                        <span className='absolute left-3 text-[#9CA3AF] pointer-events-none'>
                                <LockIcon className='w-4 h-4' />
                        </span>
                        <Input
                                id={field.name}
                                type={show ? 'text' : 'password'}
                                placeholder={field.placeholder ?? 'Enter password'}
                                autoComplete={field.autoComplete ?? 'current-password'}
                                disabled={field.disabled}
                                className={cn(inputClass(error), 'pl-9 pr-10')}
                                {...register(field.name, field.validation)}
                        />
                        <button
                                type='button'
                                onClick={() => setShow(prev => !prev)}
                                className='absolute right-3 text-[#9CA3AF] hover:text-[#6B7280] transition-colors duration-150 cursor-pointer'
                                aria-label={show ? 'Hide password' : 'Show password'}
                        >
                                {show
                                        ? <EyeOffIcon className='w-4 h-4' />
                                        : <EyeIcon className='w-4 h-4' />
                                }
                        </button>
                </div>
        )
}

// Textarea
const TextareaInput = ({ field, register, error }: InputProps) => {
        return (
                <Textarea
                        id={field.name}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        rows={field.rows ?? 4}
                        className={cn(inputClass(error), 'resize-none')}
                        {...register(field.name, field.validation)}
                />
        )
}

// Select
const SelectInput = ({ field, control, error }: ControllerProps) => {
        return (
                <Controller
                        name={field.name}
                        control={control}
                        defaultValue={field.defaultValue ?? ''}
                        rules={field.validation}
                        render={({ field: ctrl }) => (
                                <Select
                                        onValueChange={ctrl.onChange}
                                        value={ctrl.value}
                                        disabled={field.disabled}
                                >
                                        <SelectTrigger
                                                id={field.name}
                                                className={cn(inputClass(error), 'w-full')}
                                        >
                                                <SelectValue placeholder={field.placeholder ?? 'Select an option'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                                {field.options?.map((opt) => (
                                                        <SelectItem
                                                                key={opt.value}
                                                                value={opt.value}
                                                                className='font-text text-sm'
                                                        >
                                                                {opt.label}
                                                        </SelectItem>
                                                ))}
                                        </SelectContent>
                                </Select>
                        )}
                />
        )
}

// Date picker
const DateInput = ({ field, control, error }: ControllerProps) => {
        return (
                <Controller
                        name={field.name}
                        control={control}
                        defaultValue={field.defaultValue ?? ''}
                        rules={field.validation}
                        render={({ field: ctrl }) => (
                                <Popover>
                                        <PopoverTrigger asChild>
                                                <Button
                                                        id={field.name}
                                                        variant='outline'
                                                        disabled={field.disabled}
                                                        className={cn(
                                                                inputClass(error),
                                                                'w-full justify-start text-left font-normal',
                                                                !ctrl.value && 'text-[#9CA3AF]'
                                                        )}
                                                >
                                                        <CalendarIcon className='mr-2 h-4 w-4 text-[#9CA3AF]' />
                                                        {ctrl.value
                                                                ? format(new Date(ctrl.value), 'PPP')
                                                                : field.placeholder ?? 'Pick a date'
                                                        }
                                                </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                                <Calendar
                                                        mode='single'
                                                        selected={ctrl.value ? new Date(ctrl.value) : undefined}
                                                        onSelect={(date) => ctrl.onChange(date?.toISOString() ?? '')}
                                                        disabled={field.disabled}
                                                        initialFocus
                                                />
                                        </PopoverContent>
                                </Popover>
                        )}
                />
        )
}

// DateTime picker
const DateTimeInput = ({ field, control, error }: ControllerProps) => {
        return (
                <Controller
                        name={field.name}
                        control={control}
                        defaultValue={field.defaultValue ?? ''}
                        rules={field.validation}
                        render={({ field: ctrl }) => {
                                const parsed = ctrl.value ? new Date(ctrl.value) : undefined

                                const handleDateChange = (date?: Date) => {
                                        if (!date) return
                                        const existing = ctrl.value ? new Date(ctrl.value) : new Date()
                                        date.setHours(existing.getHours(), existing.getMinutes())
                                        ctrl.onChange(date.toISOString())
                                }

                                const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                        const [hours, minutes] = e.target.value.split(':').map(Number)
                                        const base = ctrl.value ? new Date(ctrl.value) : new Date()
                                        base.setHours(hours, minutes)
                                        ctrl.onChange(base.toISOString())
                                }

                                const timeValue = parsed
                                        ? `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`
                                        : ''

                                return (
                                        <Popover>
                                                <PopoverTrigger asChild>
                                                        <Button
                                                                id={field.name}
                                                                variant='outline'
                                                                disabled={field.disabled}
                                                                className={cn(
                                                                        inputClass(error),
                                                                        'w-full justify-start text-left font-normal',
                                                                        !ctrl.value && 'text-[#9CA3AF]'
                                                                )}
                                                        >
                                                                <CalendarIcon className='mr-2 h-4 w-4 text-[#9CA3AF] shrink-0' />
                                                                {parsed
                                                                        ? `${format(parsed, 'MMM d, yyyy')} at ${format(parsed, 'h:mm a')}`
                                                                        : field.placeholder ?? 'Pick date & time'
                                                                }
                                                        </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0' align='start'>
                                                        <Calendar
                                                                mode='single'
                                                                selected={parsed}
                                                                onSelect={handleDateChange}
                                                                disabled={field.disabled}
                                                                initialFocus
                                                        />
                                                        <div className='border-t border-[#E5E7EB] p-3 flex flex-col gap-1.5'>
                                                                <label className='text-[#6B7280] text-xs font-semibold font-text uppercase tracking-wide'>
                                                                        Time
                                                                </label>
                                                                <input
                                                                        type='time'
                                                                        value={timeValue}
                                                                        onChange={handleTimeChange}
                                                                        className='w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm font-text text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent'
                                                                />
                                                        </div>
                                                </PopoverContent>
                                        </Popover>
                                )
                        }}
                />
        )
}

// File / Image upload
const FileInput = ({ field, register, error }: InputProps) => {
        const [fileNames, setFileNames] = useState<string[]>([])
        const inputRef = useRef<HTMLInputElement | null>(null)
        const { ref, ...rest } = register(field.name, field.validation)

        const defaultIcon = field.type === 'image'
                ? <ImageIcon className='w-5 h-5 text-[#9CA3AF]' />
                : <UploadIcon className='w-5 h-5 text-[#9CA3AF]' />

        const icon = field.uploadIcon ?? defaultIcon

        return (
                <div className='flex flex-col gap-2'>
                        <label
                                htmlFor={field.name}
                                className={cn(
                                        'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-5 cursor-pointer transition-colors duration-200 group',
                                        error
                                                ? 'border-[#EF4444] bg-[#FFF5F5]'
                                                : 'border-[#E5E7EB] hover:border-[#1A56DB]'
                                )}
                        >
                                {icon}
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
                                {field.description && (
                                        <span className='text-[#9CA3AF] text-xs font-text'>
                                                {field.description}
                                        </span>
                                )}
                                <input
                                        id={field.name}
                                        type='file'
                                        accept={field.accept}
                                        multiple={field.multiple}
                                        disabled={field.disabled}
                                        className='hidden'
                                        {...rest}
                                        ref={(e) => {
                                                ref(e)
                                                inputRef.current = e
                                        }}
                                        onChange={(e) => {
                                                rest.onChange(e)
                                                const files = Array.from(e.target.files ?? [])
                                                setFileNames(files.map(f => f.name))
                                        }}
                                />
                        </label>

                        {fileNames.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                        {fileNames.map((name, i) => (
                                                <span
                                                        key={i}
                                                        className='flex items-center gap-1.5 bg-[#F3F4F6] rounded-md px-2.5 py-1.5 text-[#1F2937] text-xs font-text max-w-48 truncate'
                                                >
                                                        {icon}
                                                        {name}
                                                </span>
                                        ))}
                                </div>
                        )}
                </div>
        )
}

// Checkbox
const CheckboxInput = ({ field, control, error }: ControllerProps) => {
        return (
                <Controller
                        name={field.name}
                        control={control}
                        defaultValue={false}
                        rules={field.validation}
                        render={({ field: ctrl }) => (
                                <div className='flex items-start gap-2'>
                                        <Checkbox
                                                id={field.name}
                                                disabled={field.disabled}
                                                checked={!!ctrl.value}
                                                onCheckedChange={ctrl.onChange}
                                                className={cn(
                                                        'mt-0.5 border-[#E5E7EB] data-[state=checked]:bg-[#1A56DB] data-[state=checked]:border-[#1A56DB]',
                                                        error && 'border-[#EF4444]'
                                                )}
                                        />
                                        {field.label && (
                                                <label
                                                        htmlFor={field.name}
                                                        className='text-[#6B7280] text-sm font-normal font-text leading-5 cursor-pointer'
                                                >
                                                        {field.label}
                                                </label>
                                        )}
                                </div>
                        )}
                />
        )
}

const ErrorIcon = () => (
        <svg className='size-3' width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
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