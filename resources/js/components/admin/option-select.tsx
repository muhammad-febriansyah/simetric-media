import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Option } from '@/types';

type OptionSelectProps = {
    id: string;
    name: string;
    options: Option[];
    defaultValue?: string;
    placeholder: string;
    /** Value for an extra "none" choice. Transform it to null before submitting. */
    emptyValue?: string;
    emptyLabel?: string;
    onValueChange?: (value: string) => void;
};

/**
 * Select bound to a form field name, built from value/label options.
 */
export function OptionSelect({
    id,
    name,
    options,
    defaultValue,
    placeholder,
    emptyValue,
    emptyLabel,
    onValueChange,
}: OptionSelectProps) {
    return (
        <Select
            name={name}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
        >
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {emptyValue && (
                        <SelectItem value={emptyValue}>{emptyLabel}</SelectItem>
                    )}
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
