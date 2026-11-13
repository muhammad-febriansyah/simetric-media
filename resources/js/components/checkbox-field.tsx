import type { ReactNode } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
} from '@/components/ui/field';

type CheckboxFieldProps = {
    id: string;
    name: string;
    label: string;
    description?: ReactNode;
    defaultChecked?: boolean;
    value?: string;
};

/**
 * Checkbox with a label and optional description. Submits "1" when checked.
 */
export function CheckboxField({
    id,
    name,
    label,
    description,
    defaultChecked = false,
    value = '1',
}: CheckboxFieldProps) {
    return (
        <Field orientation="horizontal">
            <Checkbox
                id={id}
                name={name}
                value={value}
                defaultChecked={defaultChecked}
            />
            <FieldContent>
                <FieldLabel htmlFor={id}>{label}</FieldLabel>
                {description && (
                    <FieldDescription>{description}</FieldDescription>
                )}
            </FieldContent>
        </Field>
    );
}
