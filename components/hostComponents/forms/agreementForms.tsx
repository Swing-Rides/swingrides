"use client"

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { validators } from '@/components/forms/form.validators'
import { RegisterOptions } from 'react-hook-form'
import {
        Copy,
        Check,
        FileText,
        Upload,
        Mail,
        MessageSquare,
        AlertTriangle,
        Loader2,
        X,
} from 'lucide-react'
import Link from "next/link";
import Image from "next/image";

// ─── Upload Document Form ─────────────────────────────────────────────────────

const MAX_DOC_SIZE_MB = 20
const ACCEPTED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

// ─── Types ────────────────────────────────────────────────────────────────────

type AgreementType = 'long-term' | 'commercial-fleet'

type SendAgreementFormValues = {
        email: string
        message: string
}

type UploadDocumentFormValues = {
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
        onClose: () => void
        onSubmit?: (values: SendAgreementFormValues) => void | Promise<void>
}

type UploadDocumentFormProps = {
        agreementType: AgreementType
        onClose: () => void
        onSubmit?: (values: UploadDocumentFormValues) => void | Promise<void>
}

// ─── Agreement label map ──────────────────────────────────────────────────────

const AGREEMENT_LABELS: Record<AgreementType, string> = {
        'long-term': 'Long-Term Rental Agreement',
        'commercial-fleet': 'Commercial Fleet Rental Agreement',
}

export const SendAgreementForm = ({
        agreementType,
        shareLink,
        previewLink,
        onClose,
        onSubmit: onSubmitProp,
}: SendAgreementFormProps) => {
        const [copied, setCopied] = useState(false)

        const {
                register,
                handleSubmit,
                formState: { errors, isSubmitting },
        } = useForm<SendAgreementFormValues>({ mode: 'onTouched' })

        const handleCopy = async () => {
                try {
                        await navigator.clipboard.writeText(shareLink)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                } catch {
                        console.error('Failed to copy link')
                }
        }

        const onSubmit = async (values: SendAgreementFormValues) => {
                if (onSubmitProp) {
                        await onSubmitProp(values)
                } else {
                        // TODO: replace with real API call
                        console.log('sending agreement:', { ...values, agreementType, shareLink })
                }
                onClose()
        }

        return (
                <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-4'
                        noValidate
                >
                        {/* 1. Email */}
                        <FormRow
                                label='Email Address'
                                htmlFor='email'
                                required
                                error={errors.email?.message}
                        >
                                <div className='relative flex items-center'>
                                        <span className='absolute left-3 text-[#9CA3AF] pointer-events-none'>
                                                <Mail className='w-4 h-4' />
                                        </span>
                                        <Input
                                                id='email'
                                                type='email'
                                                placeholder='renter@email.com'
                                                autoComplete='email'
                                                className={cn(
                                                        'pl-9 border-[#E5E7EB] rounded-xs focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF]',
                                                        errors.email && 'border-[#EF4444] focus-visible:ring-[#EF4444]'
                                                )}
                                                {...register('email', validators.email() as RegisterOptions<SendAgreementFormValues, 'email'>)}
                                        />
                                </div>
                        </FormRow>

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
                                                className='border-[#E5E7EB] rounded-xs font-text text-sm text-[#6B7280] bg-[#F9FAFB] cursor-not-allowed opacity-80'
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
                                <div className='relative'>
                                        <MessageSquare className='absolute left-3 top-3 w-4 h-4 text-[#9CA3AF] pointer-events-none' />
                                        <Textarea
                                                id='message'
                                                placeholder='Add a personal note to the renter...'
                                                rows={5}
                                                className='pl-9 resize-none border-[#E5E7EB] rounded-xs focus-visible:ring-[#1A56DB] font-text text-sm text-[#1F2937] placeholder:text-[#9CA3AF]'
                                                {...register('message')}
                                        />
                                </div>
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

export const UploadDocumentForm = ({
        agreementType,
        onClose,
        onSubmit: onSubmitProp,
}: UploadDocumentFormProps) => {
        const [preview, setPreview] = useState<{ name: string; url: string; type: string } | null>(null)
        const inputRef = useRef<HTMLInputElement | null>(null)

        const {
                register,
                handleSubmit,
                formState: { errors, isSubmitting },
        } = useForm<UploadDocumentFormValues>({ mode: 'onTouched' })

        const { ref: docRef, ...docRest } = register('document', {
                required: 'Please upload a document',
                validate: {
                        fileSize: (files: FileList | undefined) => {
                                if (!files?.[0]) return true
                                const sizeMB = files[0].size / (1024 * 1024)
                                return sizeMB <= MAX_DOC_SIZE_MB || `File must be under ${MAX_DOC_SIZE_MB}MB`
                        },
                        fileType: (files: FileList | undefined) => {
                                if (!files?.[0]) return true
                                return ACCEPTED_DOC_TYPES.includes(files[0].type)
                                        || 'Only PDF, JPG and PNG files are allowed'
                        },
                },
        })

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                docRest.onChange(e)
                const file = e.target.files?.[0]
                if (!file) return
                setPreview({
                        name: file.name,
                        url: URL.createObjectURL(file),
                        type: file.type,
                })
        }

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
                        {/* File upload zone */}
                        <div className='flex flex-col gap-1.5'>
                                <Label className='text-[#1F2937] text-sm font-semibold font-text'>
                                        Upload Document <span className='text-[#EF4444]'>*</span>
                                </Label>
                                <label
                                        htmlFor='document'
                                        className={cn(
                                                'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors duration-200 group',
                                                errors.document
                                                        ? 'border-[#EF4444] bg-[#FFF5F5]'
                                                        : 'border-[#E5E7EB] hover:border-blue-700'
                                        )}
                                >
                                        <Upload className={cn(
                                                'w-6 h-6 rounded-xs',
                                                errors.document ? 'text-[#EF4444]' : 'text-[#9CA3AF]'
                                        )} />
                                        <div className='text-center'>
                                                <span className={cn(
                                                        'text-sm font-medium font-text',
                                                        errors.document
                                                                ? 'text-[#EF4444]'
                                                                : 'text-blue-700 group-hover:underline'
                                                )}>
                                                        Click to upload
                                                </span>
                                                <span className='text-[#6B7280] text-sm font-text'>
                                                        {' '}or drag and drop
                                                </span>
                                        </div>
                                        <span className='text-[#9CA3AF] text-xs font-text'>
                                                PDF, JPG, PNG · Max {MAX_DOC_SIZE_MB}MB
                                        </span>
                                        <input
                                                id='document'
                                                type='file'
                                                accept='.pdf,image/jpeg,image/png'
                                                className='hidden'
                                                {...docRest}
                                                ref={(e) => {
                                                        docRef(e)
                                                        inputRef.current = e
                                                }}
                                                onChange={handleFileChange}
                                        />
                                </label>
                                {errors.document && (
                                        <span className='text-[#EF4444] text-xs font-normal font-text flex items-center gap-1'>
                                                <AlertTriangle className='w-3 h-3 shrink-0' />
                                                {errors.document.message as string}
                                        </span>
                                )}
                        </div>

                        {/* Preview card — shown after file selected */}
                        {preview && (
                                <div className='flex items-center gap-3 p-3 border border-blue-50 bg-blue-50 rounded-xs'>
                                        <div className='flex items-center justify-center bg-blue-100 rounded-xs size-12 p-3 shrink-0'>
                                                <FileText className='w-full h-full text-blue-700' />
                                        </div>
                                        <div className='flex flex-col gap-0.5 flex-1 min-w-0'>
                                                <span className='text-[#1F2937] text-sm font-semibold font-text truncate'>
                                                        {AGREEMENT_LABELS[agreementType]}
                                                </span>
                                                <span className='text-[#6B7280] text-xs font-normal font-text truncate'>
                                                        {preview.name}
                                                </span>
                                        </div>
                                        {preview.type === 'application/pdf' ? (
                                                <Link
                                                        href = { preview.url }
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        className='shrink-0 px-2.5 py-1.5 bg-transparent border border-[#E5E7EB] rounded-xs text-[11px] font-medium font-text uppercase text-[#6B7280] hover:bg-[#F3F4F6] transition-colors duration-150 text-nowrap'
                                                                >
                                                        Preview PDF
                                                </Link>
                                        ) : (
                                                <div className='relative w-12 h-12 rounded-xs overflow-clip shrink-0 border border-[#E5E7EB]'>
                                                        <Image
                                                                src={preview.url}
                                                                alt='Document preview'
                                                                fill
                                                                className='object-cover object-center'
                                                        />
                                                </div>
                                        )}
                                        <button
                                                type='button'
                                                onClick={() => {
                                                        setPreview(null)
                                                        if (inputRef.current) inputRef.current.value = ''
                                                }}
                                                className='text-[#9CA3AF] hover:text-[#EF4444] transition-colors duration-150 cursor-pointer shrink-0'
                                                aria-label='Remove file'
                                        >
                                                <X className='w-4 h-4' />
                                        </button>
                                </div>
                        )
                }

                <Separator />

                {/* Actions */ }
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
                                disabled={isSubmitting || !preview}
                                        className='bg-blue-700 hover:bg-blue-900 rounded-xs text-white font-medium font-text cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none'
                        >
                                {isSubmitting
                                        ? <span className='flex items-center gap-2'><Loader2 className='animate-spin w-4 h-4' />Uploading...</span>
                                        : 'Upload Document'
                                }
                        </Button>
                </div>
                </form >
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
                                <AlertTriangle className='w-3 h-3 shrink-0' />
                                {error}
                        </span>
                )}
        </div>
)