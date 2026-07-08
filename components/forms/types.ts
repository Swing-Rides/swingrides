import { ReactNode } from 'react'
import { RegisterOptions } from 'react-hook-form'

export type FieldType =
        | 'text'
        | 'email'
        | 'password'
        | 'tel'
        | 'number'
        | 'number-dollar'
        | 'textarea'
        | 'select'
        | 'date'
        | 'datetime' 
        | 'file'
        | 'image'
        | 'checkbox'

export type SelectOption = {
        label: string
        value: string
}

export type FormFieldConfig = {
        name: string
        type: FieldType
        label?: string
        placeholder?: string
        description?: string        // helper text below the field
        icon?: ReactNode            // optional leading icon for text inputs
        uploadIcon?: ReactNode      // custom icon for file/image upload
        accept?: string             // for file/image — e.g. "image/png, image/jpeg"
        multiple?: boolean          // for file upload
        options?: SelectOption[]    // for select fields
        loadOptions?: () => Promise<SelectOption[]>     // ← add this for async selects
        rows?: number               // for textarea
        height?: number             
        min?: number | string
        max?: number | string
        step?: number
        autoComplete?: string
        validation?: RegisterOptions
        defaultValue?: string | number | boolean
        className?: string
        disabled?: boolean
        capture?: "user" | "environment"
        maxFiles?: number
        showPreview?: boolean
}

export type MainFormProps = {
        title?: string
        description?: string
        fields: FormFieldConfig[]
        onSubmit: (values: Record<string, unknown>) => void | Promise<void>
        submitLabel?: string
        isLoading?: boolean
        className?: string
        rowPairs?: [string, string][]
        footerSlot?: React.ReactNode
}
