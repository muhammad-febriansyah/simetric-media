import type { ReactNode } from 'react';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';

type FormFieldProps = {
    label: string;
    htmlFor: string;
    required?: boolean;
    error?: string;
    description?: ReactNode;
    className?: string;
    children: ReactNode;
};

/**
 * Standard form field: label (with a red asterisk when required),
 * the control passed as children, optional description and validation error.
 */
export function FormField({
    label,
    htmlFor,
    required = false,
    error,
    description,
    className,
    children,
}: FormFieldProps) {
    return (
        <Field data-invalid={error ? true : undefined} className={className}>
            <FieldLabel htmlFor={htmlFor} className="gap-1">
                {label}
                {required && (
                    <span aria-hidden="true" className="text-destructive">
                        *
                    </span>
                )}
            </FieldLabel>
            {children}
            {description && <FieldDescription>{description}</FieldDescription>}
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
