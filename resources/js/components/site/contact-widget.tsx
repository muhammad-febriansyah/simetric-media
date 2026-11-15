import { Link, router, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowUpIcon,
    ArrowUpRightIcon,
    ClipboardListIcon,
    MailIcon,
    MessageCircleIcon,
    XIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { whatsappUrl } from '@/lib/whatsapp';
import { create as consultationCreate } from '@/routes/consultation';

/** Show the "back to top" button once the visitor has scrolled this far. */
const SCROLL_TOP_THRESHOLD = 600;

type ContactOption = {
    title: string;
    description: string;
    icon: LucideIcon;
    iconClassName: string;
    href: string;
    external: boolean;
};

const FLOATING_BUTTON =
    'flex items-center justify-center rounded-full shadow-lg transition focus-visible:ring-[3px] focus-visible:outline-none';

/**
 * Floating contact launcher in the bottom-right corner (like omnexa.id): a chat
 * button that opens WhatsApp, email and consultation shortcuts, with a "back to
 * top" button above it once the page is scrolled.
 */
export function ContactWidget() {
    const { company } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const whatsappLink = whatsappUrl(company.contact.whatsapp);

    useEffect(() => {
        const updateScrollTop = () =>
            setShowScrollTop(window.scrollY > SCROLL_TOP_THRESHOLD);

        updateScrollTop();
        window.addEventListener('scroll', updateScrollTop, { passive: true });
        const removeNavigateListener = router.on('navigate', () =>
            setIsOpen(false),
        );

        return () => {
            window.removeEventListener('scroll', updateScrollTop);
            removeNavigateListener();
        };
    }, []);

    const options: ContactOption[] = [
        ...(whatsappLink
            ? [
                  {
                      title: 'Chat via WhatsApp',
                      description: 'Balasan cepat dari tim kami',
                      icon: MessageCircleIcon,
                      iconClassName: 'bg-success text-white',
                      href: whatsappLink,
                      external: true,
                  },
              ]
            : []),
        {
            title: 'Kirim email',
            description: company.contact.email,
            icon: MailIcon,
            iconClassName: 'bg-primary text-primary-foreground',
            href: `mailto:${company.contact.email}`,
            external: true,
        },
        {
            title: 'Konsultasi gratis',
            description: 'Isi form singkat, gratis',
            icon: ClipboardListIcon,
            iconClassName: 'bg-accent text-accent-foreground',
            href: consultationCreate.url(),
            external: false,
        },
    ];

    return (
        <div className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        type="button"
                        aria-label="Kembali ke atas"
                        onClick={() => window.scrollTo({ top: 0 })}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            FLOATING_BUTTON,
                            'size-11 bg-card text-foreground ring-1 ring-border hover:text-primary focus-visible:ring-ring/50',
                        )}
                    >
                        <ArrowUpIcon className="size-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        aria-label={isOpen ? 'Tutup kontak' : 'Hubungi kami'}
                        className={cn(
                            FLOATING_BUTTON,
                            'relative size-14 bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90 focus-visible:ring-primary/40',
                        )}
                    >
                        {isOpen ? (
                            <XIcon className="size-6" />
                        ) : (
                            <MessageCircleIcon className="size-6" />
                        )}
                        {!isOpen && (
                            <span className="absolute top-0.5 right-0.5 size-3.5 rounded-full border-2 border-background bg-success" />
                        )}
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    side="top"
                    align="end"
                    sideOffset={12}
                    className="w-80 rounded-2xl border-0 p-0 shadow-xl"
                >
                    <div className="flex flex-col gap-1 border-b p-5">
                        <span className="text-base font-bold">
                            Butuh bantuan?
                        </span>
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="size-2 rounded-full bg-success" />
                            Tim kami siap membantu Anda
                        </span>
                    </div>
                    <ul className="flex flex-col p-2">
                        {options.map((option) => {
                            const content = (
                                <>
                                    <span
                                        className={cn(
                                            'flex size-10 shrink-0 items-center justify-center rounded-full',
                                            option.iconClassName,
                                        )}
                                    >
                                        <option.icon className="size-5" />
                                    </span>
                                    <span className="flex min-w-0 flex-1 flex-col">
                                        <span className="text-sm font-semibold">
                                            {option.title}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {option.description}
                                        </span>
                                    </span>
                                    <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground" />
                                </>
                            );
                            const className =
                                'flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none';

                            return (
                                <li key={option.title}>
                                    {option.external ? (
                                        <a
                                            href={option.href}
                                            target={
                                                option.href.startsWith('http')
                                                    ? '_blank'
                                                    : undefined
                                            }
                                            rel="noopener noreferrer"
                                            className={className}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {content}
                                        </a>
                                    ) : (
                                        <Link
                                            href={option.href}
                                            className={className}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {content}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </PopoverContent>
            </Popover>
        </div>
    );
}
