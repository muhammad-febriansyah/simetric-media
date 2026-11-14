import { usePage } from '@inertiajs/react';
import { MessageCircleIcon } from 'lucide-react';
import { whatsappUrl } from '@/lib/whatsapp';

/**
 * Floating "Konsultasi via WhatsApp" button in the bottom-right corner of every
 * public page, using the WhatsApp number from the website settings.
 */
export function WhatsappButton() {
    const { company } = usePage().props;
    const link = whatsappUrl(company.contact.whatsapp);

    if (!link) {
        return null;
    }

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Konsultasi via WhatsApp"
            className="fixed right-4 bottom-4 z-30 flex items-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-success/30 transition hover:-translate-y-0.5 hover:bg-success/90 focus-visible:ring-[3px] focus-visible:ring-success/40 focus-visible:outline-none md:right-6 md:bottom-6"
        >
            <MessageCircleIcon className="size-5" />
            <span className="hidden sm:inline">Konsultasi via WhatsApp</span>
        </a>
    );
}
