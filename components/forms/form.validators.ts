import { RegisterOptions } from 'react-hook-form'

export const validators = {
        required: (label = 'This field'): RegisterOptions => ({
                required: `${label} is required`,
        }),

        email: (): RegisterOptions => ({
                required: 'Email address is required',
                pattern: {
                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}$/i,
                        message: 'Please enter a valid email address',
                },
        }),

        password: (): RegisterOptions => ({
                required: 'Password is required',
                minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                },
                pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                        message: 'Password must include uppercase, lowercase, number and special character',
                },
        }),

        confirmPassword: (getValues: () => Record<string, unknown>, fieldName = 'password'): RegisterOptions => ({
                required: 'Please confirm your password',
                validate: (value: string) =>
                        value === getValues()[fieldName] || 'Passwords do not match',
        }),

        phone: (): RegisterOptions => ({
                required: 'Phone number is required',
                pattern: {
                        value: /^\+?[1-9]\d{0,2}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
                        message: 'Enter a valid phone number (e.g. +1 555-123-4567 or +44 7911 123456)',
                },
                minLength: {
                        value: 7,
                        message: 'Phone number is too short',
                },
                maxLength: {
                        value: 20,
                        message: 'Phone number is too long',
                },
        }),

        name: (label = 'Name'): RegisterOptions => ({
                required: `${label} is required`,
                minLength: {
                        value: 2,
                        message: `${label} must be at least 2 characters`,
                },
                pattern: {
                        value: /^[a-zA-Z\s'-]+$/,
                        message: `${label} can only contain letters, spaces, hyphens and apostrophes`,
                },
        }),

        amount: (min = 1000): RegisterOptions => ({
                required: 'Amount is required',
                min: {
                        value: min,
                        message: `Minimum amount is $${min.toLocaleString('en-US')}`,  // ← USD
                },
                pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: 'Enter a valid amount',
                },
        }),

        url: (): RegisterOptions => ({
                pattern: {
                        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                        message: 'Please enter a valid URL',
                },
        }),

        file: (maxSizeMB = 5, accept?: string[]): RegisterOptions => ({
                required: 'Please upload a file',
                validate: {
                        fileSize: (files: FileList) => {
                                if (!files?.[0]) return true
                                const sizeInMB = files[0].size / (1024 * 1024)
                                return sizeInMB <= maxSizeMB || `File must be smaller than ${maxSizeMB}MB`
                        },
                        fileType: (files: FileList) => {
                                if (!files?.[0] || !accept?.length) return true
                                const fileType = files[0].type
                                return accept.includes(fileType) || `File must be one of: ${accept.join(', ')}`
                        },
                },
        }),

        minLength: (length: number, label = 'This field'): RegisterOptions => ({
                minLength: {
                        value: length,
                        message: `${label} must be at least ${length} characters`,
                },
        }),

        maxLength: (length: number, label = 'This field'): RegisterOptions => ({
                maxLength: {
                        value: length,
                        message: `${label} must not exceed ${length} characters`,
                },
        }),

        checkbox: (label = 'This field'): RegisterOptions => ({
                validate: (value: boolean) =>
                        value === true || `${label} must be checked to proceed`,
        }),
}