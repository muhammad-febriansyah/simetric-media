import { Badge } from '@/components/ui/badge';
import type { Option } from '@/types';

const leadStatusVariants: Record<
    string,
    'default' | 'secondary' | 'success' | 'destructive' | 'outline'
> = {
    new: 'default',
    discovery_call: 'secondary',
    assessment: 'secondary',
    proposal: 'outline',
    won: 'success',
    lost: 'destructive',
};

export function LeadStatusBadge({ status }: { status: Option }) {
    return (
        <Badge variant={leadStatusVariants[status.value] ?? 'secondary'}>
            {status.label}
        </Badge>
    );
}

export function PublishBadge({ isPublished }: { isPublished: boolean }) {
    return (
        <Badge variant={isPublished ? 'success' : 'secondary'}>
            {isPublished ? 'Terbit' : 'Draft'}
        </Badge>
    );
}
