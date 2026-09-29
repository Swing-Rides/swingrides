'use client'

import * as React from 'react'
import { Clock, ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const HOURS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

export const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

export const PERIODS = ['AM', 'PM'] as const
export type Period = (typeof PERIODS)[number]

export interface ParsedTime {
	hour: string
	minute: string
	period: Period
}

/**
 * Converts a 24-hour "HH:mm" string into 12-hour components:
 * hour: "1" - "12"
 * minute: "00" - "59"
 * period: "AM" | "PM"
 */
export const parse24To12 = (timeStr?: string): ParsedTime | null => {
	if (!timeStr || !timeStr.includes(':')) return null
	const [hStr, mStr] = timeStr.split(':')
	const h24 = parseInt(hStr ?? '0', 10)
	const m = parseInt(mStr ?? '0', 10)
	if (isNaN(h24) || isNaN(m)) return null

	const period: Period = h24 >= 12 ? 'PM' : 'AM'
	const h12 = h24 % 12 === 0 ? 12 : h24 % 12
	return {
		hour: String(h12),
		minute: String(m).padStart(2, '0'),
		period,
	}
}

/**
 * Converts 12-hour components into a 24-hour "HH:mm" string
 */
export const format12To24 = (hour: string, minute: string, period: Period): string => {
	const h12 = parseInt(hour, 10)
	let h24 = isNaN(h12) ? 12 : h12
	if (period === 'AM') {
		if (h24 === 12) h24 = 0
	} else {
		if (h24 !== 12) h24 += 12
	}
	const m = parseInt(minute, 10)
	const mClean = isNaN(m) ? 0 : m
	return `${String(h24).padStart(2, '0')}:${String(mClean).padStart(2, '0')}`
}

/**
 * Formats a 24-hour "HH:mm" string for user-friendly display (e.g. "9:30 AM")
 */
export const formatDisplayTime = (timeStr?: string): string => {
	const parsed = parse24To12(timeStr)
	if (!parsed) return ''
	return `${parsed.hour}:${parsed.minute} ${parsed.period}`
}

// ─── TimePicker Component ─────────────────────────────────────────────────────

export interface TimePickerProps {
	id?: string
	value?: string // 24-hour format: "HH:mm" or ""
	onChange?: (value: string) => void
	disabled?: boolean
	placeholder?: string
	className?: string
}

export function TimePicker({
	id,
	value = '',
	onChange,
	disabled = false,
	placeholder = 'Select time',
	className,
}: TimePickerProps) {
	const [open, setOpen] = React.useState(false)

	const parsed = parse24To12(value)

	const handleHourSelect = (selectedHour: string) => {
		const currentMinute = parsed?.minute ?? '00'
		const currentPeriod = parsed?.period ?? 'AM'
		onChange?.(format12To24(selectedHour, currentMinute, currentPeriod))
	}

	const handleMinuteSelect = (selectedMinute: string) => {
		const currentHour = parsed?.hour ?? '12'
		const currentPeriod = parsed?.period ?? 'AM'
		onChange?.(format12To24(currentHour, selectedMinute, currentPeriod))
	}

	const handlePeriodSelect = (selectedPeriod: Period) => {
		const currentHour = parsed?.hour ?? '12'
		const currentMinute = parsed?.minute ?? '00'
		onChange?.(format12To24(currentHour, currentMinute, selectedPeriod))
	}

	const handleSetNow = () => {
		const now = new Date()
		const h24 = now.getHours()
		const m = now.getMinutes()
		const timeStr = `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
		onChange?.(timeStr)
	}

	const handleClear = () => {
		onChange?.('')
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type='button'
					id={id}
					disabled={disabled}
					className={cn(
						'w-full flex items-center justify-between px-3 py-2 border border-[#E5E7EB] rounded-md text-sm font-text bg-white text-left focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
						open && 'ring-2 ring-[#1A56DB] border-transparent',
						className
					)}
				>
					<div className='flex items-center gap-2 min-w-0'>
						<Clock className='size-4 text-[#9CA3AF] shrink-0' />
						<span
							className={cn(
								'truncate text-sm font-text',
								value ? 'text-[#1F2937] font-medium' : 'text-[#9CA3AF]'
							)}
						>
							{formatDisplayTime(value) || placeholder}
						</span>
					</div>
					<ChevronDown className='size-4 text-[#9CA3AF] shrink-0 ml-1' />
				</button>
			</PopoverTrigger>

			<PopoverContent
				align='start'
				sideOffset={6}
				className='z-[9999] w-auto p-3 bg-white border border-[#E5E7EB] shadow-lg rounded-xl flex flex-col gap-2.5 font-text'
			>
				{/* Top Status Bar */}
				<div className='flex items-center justify-between border-b border-[#E5E7EB] pb-2 text-xs font-semibold text-[#374151]'>
					<span>Select Time</span>
					{value ? (
						<span className='text-[#1A56DB] font-bold text-xs bg-[#EBF0FB] px-2 py-0.5 rounded'>
							{formatDisplayTime(value)}
						</span>
					) : (
						<span className='text-[#9CA3AF] font-normal'>Not set</span>
					)}
				</div>

				{/* 3 Columns: Hours, Minutes, AM/PM */}
				<div className='flex items-stretch gap-2 text-center text-xs'>
					{/* Hours Column */}
					<div className='flex flex-col gap-1 items-center'>
						<span className='text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider'>
							Hour
						</span>
						<div
							className='h-48 w-14 overflow-y-auto flex flex-col gap-1 p-1 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] overscroll-contain'
							tabIndex={-1}
						>
							{HOURS.map((h) => {
								const isSelected = parsed?.hour === h
								return (
									<button
										key={h}
										type='button'
										onClick={() => handleHourSelect(h)}
										className={cn(
											'h-8 w-full rounded text-xs font-medium cursor-pointer transition-colors shrink-0 flex items-center justify-center',
											isSelected
												? 'bg-[#1A56DB] text-white font-bold shadow-xs'
												: 'text-[#374151] hover:bg-[#E5E7EB]'
										)}
									>
										{h}
									</button>
								)
							})}
						</div>
					</div>

					{/* Colon separator */}
					<div className='flex flex-col justify-center text-[#9CA3AF] font-bold pt-4 text-sm'>
						:
					</div>

					{/* Minutes Column */}
					<div className='flex flex-col gap-1 items-center'>
						<span className='text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider'>
							Min
						</span>
						<div
							className='h-48 w-14 overflow-y-auto flex flex-col gap-1 p-1 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] overscroll-contain'
							tabIndex={-1}
						>
							{MINUTES.map((m) => {
								const isSelected = parsed?.minute === m
								return (
									<button
										key={m}
										type='button'
										onClick={() => handleMinuteSelect(m)}
										className={cn(
											'h-8 w-full rounded text-xs font-medium cursor-pointer transition-colors shrink-0 flex items-center justify-center',
											isSelected
												? 'bg-[#1A56DB] text-white font-bold shadow-xs'
												: 'text-[#374151] hover:bg-[#E5E7EB]'
										)}
									>
										{m}
									</button>
								)
							})}
						</div>
					</div>

					{/* AM/PM Column */}
					<div className='flex flex-col gap-1 items-center'>
						<span className='text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider'>
							Period
						</span>
						<div className='h-48 w-14 flex flex-col gap-2 p-1 rounded-md border border-[#E5E7EB] bg-[#F9FAFB]'>
							{PERIODS.map((p) => {
								const isSelected = parsed?.period === p
								return (
									<button
										key={p}
										type='button'
										onClick={() => handlePeriodSelect(p)}
										className={cn(
											'h-12 w-full rounded-md text-xs font-semibold cursor-pointer transition-colors shrink-0 flex items-center justify-center',
											isSelected
												? 'bg-[#1A56DB] text-white font-bold shadow-xs'
												: 'text-[#374151] bg-white border border-[#E5E7EB] hover:bg-[#E5E7EB]'
										)}
									>
										{p}
									</button>
								)
							})}
						</div>
					</div>
				</div>

				{/* Quick Actions & Done */}
				<div className='flex items-center justify-between gap-2 pt-2 border-t border-[#E5E7EB]'>
					<div className='flex items-center gap-2'>
						<button
							type='button'
							onClick={handleSetNow}
							className='text-xs font-medium text-[#1A56DB] hover:underline cursor-pointer'
						>
							Now
						</button>
						{value && (
							<>
								<span className='text-[#D1D5DB]'>|</span>
								<button
									type='button'
									onClick={handleClear}
									className='text-xs font-medium text-[#6B7280] hover:text-[#EF4444] cursor-pointer'
								>
									Clear
								</button>
							</>
						)}
					</div>
					<Button
						type='button'
						size='xs'
						onClick={() => setOpen(false)}
						className='h-7 px-3 bg-[#1A56DB] hover:bg-[#1E429F] text-white text-xs font-medium cursor-pointer rounded'
					>
						Done
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default TimePicker
