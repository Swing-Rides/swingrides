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

        file: ({
                required = true,
                maxSizeMB = 5,
                maxTotalSizeMB,
                maxFiles,
                accept,
        }: {
                required?: boolean
                maxSizeMB?: number
                maxTotalSizeMB?: number
                maxFiles?: number
                accept?: string[]
        } = {}): RegisterOptions => ({
                ...(required && {
                        required: "Please upload a file",
                }),

                validate: {
                        requiredFile: (files: FileList | File[]) => {
                                if (!required) return true;

                                return files?.length > 0 || "Please upload at least one file";
                        },

                        maxFiles: (files: FileList | File[]) => {
                                if (!files || !maxFiles) return true;

                                return (
                                        files.length <= maxFiles ||
                                        `You can upload a maximum of ${maxFiles} files`
                                );
                        },

                        fileSize: (files: FileList | File[]) => {
                                if (!files?.length) return true;

                                const oversized = Array.from(files).find(
                                        (file) => file.size / (1024 * 1024) > maxSizeMB
                                );

                                return (
                                        !oversized ||
                                        `${oversized.name} exceeds the ${maxSizeMB}MB limit`
                                );
                        },

                        totalSize: (files: FileList | File[]) => {
                                if (!files?.length || !maxTotalSizeMB) return true;

                                const total =
                                        Array.from(files).reduce((sum, file) => sum + file.size, 0) /
                                        (1024 * 1024);

                                return (
                                        total <= maxTotalSizeMB ||
                                        `Total upload size must not exceed ${maxTotalSizeMB}MB`
                                );
                        },

                        fileType: (files: FileList | File[]) => {
                                if (!files?.length || !accept?.length) return true;

                                const invalid = Array.from(files).find(
                                        (file) => !accept.includes(file.type)
                                );

                                return (
                                        !invalid ||
                                        `${invalid.name} is not a supported file type`
                                );
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