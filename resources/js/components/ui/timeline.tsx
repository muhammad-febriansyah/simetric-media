import { motion, useScroll, useTransform } from 'motion/react';
import type { ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Scroll-driven timeline (adapted from Aceternity UI "Timeline"): a sticky step
 * label on the left and a progress line that fills while the visitor scrolls.
 */
export type TimelineEntry = {
    title: string;
    eyebrow?: string;
    content: ReactNode;
};

export function Timeline({ data }: { data: TimelineEntry[] }) {
    const listRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        if (!listRef.current) {
            return;
        }

        const observer = new ResizeObserver(([entry]) =>
            setHeight(entry.contentRect.height),
        );
        observer.observe(listRef.current);

        return () => observer.disconnect();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 20%', 'end 60%'],
    });
    const progressHeight = useTransform(scrollYProgress, [0, 1], [0, height]);
    const progressOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div ref={containerRef} className="w-full">
            <div ref={listRef} className="relative">
                {data.map((item) => (
                    <div
                        key={item.title}
                        className="flex justify-start pt-8 first:pt-0 md:gap-10 md:pt-16"
                    >
                        <div className="sticky top-32 z-10 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
                            <div className="absolute left-1 flex size-10 items-center justify-center rounded-full bg-background">
                                <div className="size-4 rounded-full border-2 border-primary/40 bg-card" />
                            </div>
                            <div className="hidden flex-col gap-1 md:flex md:pl-16">
                                {item.eyebrow && (
                                    <span className="text-sm font-semibold text-success">
                                        {item.eyebrow}
                                    </span>
                                )}
                                <h3 className="text-2xl font-semibold text-foreground">
                                    {item.title}
                                </h3>
                            </div>
                        </div>

                        <div className="relative w-full pr-2 pl-16 md:pl-4">
                            <div className="mb-3 flex flex-col gap-1 md:hidden">
                                {item.eyebrow && (
                                    <span className="text-sm font-semibold text-success">
                                        {item.eyebrow}
                                    </span>
                                )}
                                <h3 className="text-xl font-semibold text-foreground">
                                    {item.title}
                                </h3>
                            </div>
                            {item.content}
                        </div>
                    </div>
                ))}
                <div
                    aria-hidden="true"
                    style={{ height }}
                    className="absolute top-0 left-6 w-0.5 overflow-hidden bg-border [mask-image:linear-gradient(to_bottom,transparent_0%,black_5%,black_95%,transparent_100%)]"
                >
                    <motion.div
                        style={{
                            height: progressHeight,
                            opacity: progressOpacity,
                        }}
                        className="absolute inset-x-0 top-0 w-0.5 rounded-full bg-gradient-to-t from-primary via-primary/60 to-transparent"
                    />
                </div>
            </div>
        </div>
    );
}
