import { contentIcons } from '@/components/site/content-icon';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type IconSelectProps = {
    id: string;
    name: string;
    defaultValue?: string | null;
};

/**
 * Select one of the icons supported on the public website.
 */
export function IconSelect({ id, name, defaultValue }: IconSelectProps) {
    return (
        <Select name={name} defaultValue={defaultValue ?? undefined}>
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder="Pilih ikon" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {Object.entries(contentIcons).map(([iconName, Icon]) => (
                        <SelectItem key={iconName} value={iconName}>
                            <Icon />
                            {iconName}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
