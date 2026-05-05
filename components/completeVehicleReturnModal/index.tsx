'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Rentals } from '../pages/profilePages/types'

type CompleteVehicleReturnModalProps = {
        rentals?: Rentals[]
        onComplete: (updatedRentals: Rentals[]) => void
}

type ReturnFormState = {
        mileage: string
        fuelLevel: string
        photos: File[]
        notes: string
}

const FUEL_LEVELS = ['Empty', '1/4', '1/2', '3/4', 'Full'] as const

export default function CompleteVehicleReturnModal({ rentals, onComplete }: CompleteVehicleReturnModalProps) {
        const searchParams = useSearchParams()
        const router = useRouter()
        const pathname = usePathname()

        const returnId = searchParams.get('return')
        const rental = rentals?.find(r => r.rentId === returnId && r.status === 'Active')

        const [form, setForm] = useState<ReturnFormState>({
                mileage: '',
                fuelLevel: '',
                photos: [],
                notes: '',
        })

        const handleClose = useCallback(() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('return')
                const query = params.toString()
                router.push(query ? `${pathname}?${query}` : pathname)
                setForm({ mileage: '', fuelLevel: '', photos: [], notes: '' })
        }, [searchParams, router, pathname])

        const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
                if (!e.target.files) return
                const selected = Array.from(e.target.files)
                setForm(prev => ({ ...prev, photos: [...prev.photos, ...selected] }))
        }

        const removePhoto = (index: number) => {
                setForm(prev => ({
                        ...prev,
                        photos: prev.photos.filter((_, i) => i !== index)
                }))
        }

        const handleConfirm = useCallback(() => {
                if (!returnId || !rentals) return
                const updatedRentals = rentals.map(r =>
                        r.rentId === returnId && r.status === 'Active'
                                ? { ...r, status: 'Completed' as const }
                                : r
                )
                onComplete(updatedRentals)
                handleClose()
        }, [returnId, rentals, onComplete, handleClose])

        const isFormValid = form.mileage.trim() !== '' && form.fuelLevel !== '' && form.photos.length > 0

        if (!returnId || !rental) return null

        return (
                <div
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
                        onClick={handleClose}
                >
                        <div
                                className='relative bg-white rounded-[10px] shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto'
                                onClick={(e) => e.stopPropagation()}
                        >
                                {/* Header */}
                                <div className='flex items-center justify-between'>
                                        <div className='flex flex-col gap-0.5'>
                                                <h2 className='text-[#1F2937] text-lg font-bold font-text leading-6'>
                                                        Complete Vehicle Return
                                                </h2>
                                                <span className='text-[#6B7280] text-xs font-normal font-text'>
                                                        {rental.car.carName} · {rental.car.plateNumber}
                                                </span>
                                        </div>
                                        <button
                                                onClick={handleClose}
                                                className='text-[#6B7280] hover:text-[#1F2937] transition-colors duration-200 cursor-pointer'
                                                aria-label='Close modal'
                                        >
                                                <CloseIcon />
                                        </button>
                                </div>

                                {/* Trip summary */}
                                <div className='flex justify-between p-3 bg-[#F9FAFB] rounded-lg'>
                                        <div className='flex flex-col gap-0.5'>
                                                <span className='text-[#6B7280] text-xs font-normal font-text'>Pickup</span>
                                                <span className='text-[#1F2937] text-sm font-semibold font-text'>{rental.pickUpDate}</span>
                                        </div>
                                        <ReturnArrowIcon />
                                        <div className='flex flex-col gap-0.5 items-end'>
                                                <span className='text-[#6B7280] text-xs font-normal font-text'>Return</span>
                                                <span className='text-[#1F2937] text-sm font-semibold font-text'>{rental.returnDate}</span>
                                        </div>
                                </div>

                                {/* Mileage */}
                                <div className='flex flex-col gap-1.5'>
                                        <label className='text-[#1F2937] text-sm font-semibold font-text'>
                                                Return Mileage <span className='text-[#EF4444]'>*</span>
                                        </label>
                                        <div className='relative'>
                                                <input
                                                        type='number'
                                                        min={0}
                                                        placeholder='e.g. 24500'
                                                        value={form.mileage}
                                                        onChange={(e) => setForm(prev => ({ ...prev, mileage: e.target.value }))}
                                                        className='w-full border border-[#E5E7EB] rounded-md px-3 py-2.5 pr-14 text-sm font-text text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent'
                                                />
                                                <span className='absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs font-text'>
                                                        km
                                                </span>
                                        </div>
                                </div>

                                {/* Fuel level */}
                                <div className='flex flex-col gap-1.5'>
                                        <label className='text-[#1F2937] text-sm font-semibold font-text'>
                                                Fuel Level <span className='text-[#EF4444]'>*</span>
                                        </label>
                                        <div className='grid grid-cols-5 gap-2'>
                                                {FUEL_LEVELS.map((level) => (
                                                        <button
                                                                key={level}
                                                                onClick={() => setForm(prev => ({ ...prev, fuelLevel: level }))}
                                                                className={`py-2 text-xs font-medium font-text border rounded-md transition-colors duration-200 cursor-pointer
                                                                        ${form.fuelLevel === level
                                                                                ? 'bg-[#1A56DB] text-white border-[#1A56DB]'
                                                                                : 'bg-transparent text-[#6B7280] border-[#E5E7EB] hover:border-[#1A56DB] hover:text-[#1A56DB]'
                                                                        }`}
                                                        >
                                                                {level}
                                                        </button>
                                                ))}
                                        </div>
                                </div>

                                {/* Photo upload */}
                                <div className='flex flex-col gap-1.5'>
                                        <label className='text-[#1F2937] text-sm font-semibold font-text'>
                                                Return Photos <span className='text-[#EF4444]'>*</span>
                                        </label>
                                        <label className='flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E5E7EB] rounded-lg p-5 cursor-pointer hover:border-[#1A56DB] transition-colors duration-200 group'>
                                                <UploadIcon />
                                                <div className='text-center'>
                                                        <span className='text-[#1A56DB] text-sm font-medium font-text group-hover:underline'>
                                                                Click to upload
                                                        </span>
                                                        <span className='text-[#6B7280] text-sm font-text'>
                                                                {' '}or drag and drop
                                                        </span>
                                                </div>
                                                <span className='text-[#9CA3AF] text-xs font-text'>
                                                        PNG, JPG up to 10MB each
                                                </span>
                                                <input
                                                        type='file'
                                                        accept='image/png, image/jpeg'
                                                        multiple
                                                        className='hidden'
                                                        onChange={handlePhotoUpload}
                                                />
                                        </label>

                                        {form.photos.length > 0 && (
                                                <div className='flex flex-wrap gap-2 mt-1'>
                                                        {form.photos.map((photo, index) => (
                                                                <div key={index} className='relative group flex items-center gap-1.5 bg-[#F3F4F6] rounded-md px-2.5 py-1.5'>
                                                                        <PhotoIcon />
                                                                        <span className='text-[#1F2937] text-xs font-text max-w-32 truncate'>
                                                                                {photo.name}
                                                                        </span>
                                                                        <button
                                                                                onClick={() => removePhoto(index)}
                                                                                className='text-[#9CA3AF] hover:text-[#EF4444] transition-colors duration-150 cursor-pointer'
                                                                                aria-label={`Remove ${photo.name}`}
                                                                        >
                                                                                <SmallCloseIcon />
                                                                        </button>
                                                                </div>
                                                        ))}
                                                </div>
                                        )}
                                </div>

                                {/* Notes */}
                                <div className='flex flex-col gap-1.5'>
                                        <label className='text-[#1F2937] text-sm font-semibold font-text'>
                                                Additional Notes
                                                <span className='text-[#9CA3AF] font-normal ml-1'>(optional)</span>
                                        </label>
                                        <textarea
                                                rows={3}
                                                placeholder='Any damages, issues or remarks...'
                                                value={form.notes}
                                                onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                                                className='w-full border border-[#E5E7EB] rounded-md px-3 py-2.5 text-sm font-text text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent resize-none'
                                        />
                                </div>

                                {/* Actions */}
                                <div className='flex gap-3 justify-end pt-1'>
                                        <button
                                                onClick={handleClose}
                                                className='text-sm font-medium font-text leading-5 border border-[#E5E7EB] text-[#6B7280] rounded-xs py-2 px-4 bg-transparent hover:bg-[#F3F4F6] transition-colors duration-200 cursor-pointer'
                                        >
                                                Discard
                                        </button>
                                        <button
                                                onClick={handleConfirm}
                                                disabled={!isFormValid}
                                                className='text-sm font-medium font-text leading-5 border border-[#1A56DB] text-white rounded-xs py-2 px-4 bg-[#1A56DB] hover:bg-[#1E429F] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none'
                                        >
                                                Confirm Return
                                        </button>
                                </div>
                        </div>
                </div>
        )
}

const CloseIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
)

const SmallCloseIcon = () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
)

const ReturnArrowIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
)

const UploadIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 20H16M4 16V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V16" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
)

const PhotoIcon = () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="12" height="12" rx="2" stroke="#6B7280" strokeWidth="1.2" />
                <circle cx="4.5" cy="4.5" r="1" fill="#6B7280" />
                <path d="M1 9L4 6L6.5 8.5L9 6.5L13 10" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
)