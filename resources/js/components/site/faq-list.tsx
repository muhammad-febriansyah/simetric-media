import { PlusIcon } from 'lucide-react';
import { RichText } from '@/components/rich-text';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { Faq } from '@/types';

/**
 * Two-column list of questions that expand in place (BuildWithAngga FAQ style).
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
    return (
        <div className="grid items-start gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
                <Collapsible key={faq.id} className="site-card group/faq">
                    <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left font-bold transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
                        {faq.question}
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform duration-300 group-data-[state=open]/faq:rotate-45">
                            <PlusIcon className="size-4" />
                        </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-5 pb-5 text-sm text-muted-foreground">
                        <RichText html={faq.answer} />
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>
    );
}
