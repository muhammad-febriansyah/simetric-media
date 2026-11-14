import { Link, usePage } from '@inertiajs/react';
import { ArrowRightIcon, MessageCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { whatsappUrl } from '@/lib/whatsapp';
import { create as consultationCreate } from '@/routes/consultation';

/**
 * The two ways to start: the consultation form and a WhatsApp chat.
 */
export function ConsultActions({
    consultLabel = 'Konsultasi Gratis',
    message,
}: {
    consultLabel?: string;
    /** Pre-filled WhatsApp message, e.g. mentioning the page topic. */
    message?: string;
}) {
    const { company } = usePage().props;
    const whatsappLink = whatsappUrl(company.contact.whatsapp, message);

    return (
        <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
                <Link href={consultationCreate()}>
                    {consultLabel}
                    <ArrowRightIcon data-icon="inline-end" />
                </Link>
            </Button>
            {whatsappLink && (
                <Button size="lg" variant="secondary" asChild>
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <MessageCircleIcon data-icon="inline-start" />
                        Chat WhatsApp
                    </a>
                </Button>
            )}
        </div>
    );
}
