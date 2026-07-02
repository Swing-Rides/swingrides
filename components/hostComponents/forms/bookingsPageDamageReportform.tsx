'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FileText, CheckCircle2, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProofFile = {
        id: string
        name: string
        url: string
        type: 'image' | 'pdf'
}

type DamageReportFormProps = {
        description: string
        uploadedProof: ProofFile[]
        isAcknowledged?: boolean
        onAcknowledge: () => void | Promise<void>
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DamageReportForm({
        description,
        uploadedProof,
        isAcknowledged: initialAcknowledged = false,
        onAcknowledge,
}: DamageReportFormProps) {
        const [acknowledged, setAcknowledged] = useState(initialAcknowledged)
        const [isSubmitting, setIsSubmitting] = useState(false)

        const handleAcknowledge = async () => {
                if (acknowledged) return
                setIsSubmitting(true)
                try {
                        await onAcknowledge()
                        setAcknowledged(true)
                } finally {
                        setIsSubmitting(false)
                }
        }

        return (
                <div className='flex flex-col gap-5 w-full'>
                        {/* Acknowledged notice */}
                        {acknowledged && (
                                <div className='flex items-center gap-2 p-3 bg-emerald-50 rounded-md text-emerald-700'>
                                        <CheckCircle2 className='w-4 h-4 shrink-0' />
                                        <span className='text-sm font-medium font-text'>
                                                This damage report has been acknowledged.
                                        </span>
                                </div>
                        )}

                        {/* 1. Description */}
                        <div className='flex flex-col gap-1.5'>
                                <span className='text-gray-500 text-xs font-semibold font-text uppercase'>
                                        Description
                                </span>
                                <div className={cn(
                                        'px-3 py-2.5 rounded-xs border border-[#E5E7EB] bg-[#F9FAFB]',
                                        'text-[#1F2937] text-sm font-normal font-text leading-5 cursor-not-allowed'
                                )}>
                                        {description || '—'}
                                </div>
                        </div>

                        {/* 2. Uploaded Proof */}
                        <div className='flex flex-col gap-2'>
                                <span className='text-gray-500 text-xs font-semibold font-text uppercase'>
                                        Uploaded Proof
                                </span>

                                {uploadedProof.length === 0 ? (
                                        <span className='text-[#9CA3AF] text-sm font-normal font-text'>
                                                No documents uploaded.
                                        </span>
                                ) : (
                                        <div className='flex flex-col gap-2'>
                                                {uploadedProof.map((file) => (
                                                        file.type === 'image'
                                                                ? <ImageProofItem key={file.id} file={file} />
                                                                : <PdfProofItem key={file.id} file={file} />
                                                ))}
                                        </div>
                                )}
                        </div>

                        {/* Acknowledge button */}
                        <Button
                                type='button'
                                onClick={handleAcknowledge}
                                disabled={acknowledged || isSubmitting}
                                className={cn(
                                        'w-full font-medium font-text transition-colors duration-200',
                                        acknowledged
                                                ? 'bg-emerald-500 hover:bg-emerald-500 text-white border-emerald-500 cursor-not-allowed opacity-80'
                                                : 'bg-blue-700 hover:bg-blue-900 text-white cursor-pointer'
                                )}
                        >
                                {isSubmitting ? (
                                        <span className='flex items-center gap-2'>
                                                <Loader2 className='animate-spin w-4 h-4' />
                                                Acknowledging...
                                        </span>
                                ) : acknowledged ? (
                                        <span className='flex items-center gap-2'>
                                                <CheckCircle2 className='w-4 h-4' />
                                                Acknowledged
                                        </span>
                                ) : (
                                        'Acknowledge'
                                )}
                        </Button>
                </div>
        )
}

// ─── Image proof item ─────────────────────────────────────────────────────────

const ImageProofItem = ({ file }: { file: ProofFile }) => {
        const [expanded, setExpanded] = useState(false)

        return (
                <div className='flex flex-col gap-2'>
                        <button
                                type='button'
                                onClick={() => setExpanded(prev => !prev)}
                                className='flex items-center gap-3 p-3 rounded-xs border border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors duration-150 cursor-pointer text-left w-full'
                        >
                                <div className='relative size-10 rounded-xs overflow-clip shrink-0 bg-[#E5E7EB]'>
                                        <Image
                                                src={file.url}
                                                alt={file.name}
                                                fill
                                                className='object-cover object-center'
                                        />
                                </div>
                                <span className='text-[#1F2937] text-sm font-medium font-text flex-1 truncate'>
                                        {file.name}
                                </span>
                                <span className='text-[#6B7280] text-xs font-normal font-text text-nowrap'>
                                        {expanded ? 'Hide' : 'Preview'}
                                </span>
                        </button>

                        {expanded && (
                                <div className='relative w-full aspect-video rounded-xs overflow-clip border border-[#E5E7EB]'>
                                        <Image
                                                src={file.url}
                                                alt={file.name}
                                                fill
                                                className='object-cover object-center'
                                        />
                                </div>
                        )}
                </div>
        )
}

// ─── PDF proof item ───────────────────────────────────────────────────────────

const PdfProofItem = ({ file }: { file: ProofFile }) => (
        <Link
                href = { file.url }
                target = '_blank'
                rel = 'noopener noreferrer'
                className = 'flex items-center gap-3 p-3 rounded-xs border border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors duration-150 cursor-pointer'
        >
                <div className='flex items-center justify-center size-10 rounded-xs bg-red-50 border border-red-100 shrink-0'>
                        <FileText className='w-5 h-5 text-red-500' />
                </div>
                <span className='text-[#1F2937] text-sm font-medium font-text flex-1 truncate'>
                        {file.name}
                </span>
                <ExternalLink className='w-4 h-4 text-[#9CA3AF] shrink-0' />
        </Link >
)