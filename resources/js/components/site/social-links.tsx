import { usePage } from '@inertiajs/react';
import {
    FacebookIcon,
    InstagramIcon,
    LinkedinIcon,
    Music2Icon,
    TwitterIcon,
    YoutubeIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NETWORKS: {
    key: 'linkedin' | 'instagram' | 'youtube' | 'facebook' | 'x' | 'tiktok';
    label: string;
    icon: LucideIcon;
}[] = [
    { key: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon },
    { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
    { key: 'youtube', label: 'YouTube', icon: YoutubeIcon },
    { key: 'facebook', label: 'Facebook', icon: FacebookIcon },
    { key: 'x', label: 'X (Twitter)', icon: TwitterIcon },
    { key: 'tiktok', label: 'TikTok', icon: Music2Icon },
];

/**
 * Social media icon links from the website settings. Renders nothing when none are set.
 */
export function SocialLinks() {
    const { company } = usePage().props;
    const links = NETWORKS.filter((network) => company.social[network.key]);

    if (links.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {links.map((network) => (
                <Button
                    key={network.key}
                    variant="secondary"
                    size="icon-sm"
                    asChild
                >
                    <a
                        href={company.social[network.key] ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={network.label}
                    >
                        <network.icon />
                    </a>
                </Button>
            ))}
        </div>
    );
}
