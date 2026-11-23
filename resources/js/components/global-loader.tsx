import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

/** Visits faster than this finish without showing the loader at all. */
const SHOW_DELAY = 250;

/** Once shown, the loader stays this long so it does not flicker. */
const MINIMUM_VISIBLE = 300;

type VisitIdentity = { method: string; url: URL };

function visitKey({ method, url }: VisitIdentity): string {
    return `${method}:${url.href}`;
}

/**
 * Full-screen glass loader for Inertia visits, replacing the top progress bar.
 * Background requests (prefetching, async reloads) do not trigger it, unless
 * the visitor clicks a link whose prefetch is still loading: Inertia then waits
 * on that request without firing a new `start` event.
 */
export function GlobalLoader() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const prefetchesInFlight = new Set<string>();
        const awaitedPrefetches = new Set<string>();
        let activeVisits = 0;
        let shownAt: number | null = null;
        let showTimer: number | undefined;
        let hideTimer: number | undefined;

        const beginLoading = () => {
            activeVisits += 1;
            window.clearTimeout(hideTimer);

            if (activeVisits === 1 && shownAt === null) {
                showTimer = window.setTimeout(() => {
                    shownAt = Date.now();
                    setIsVisible(true);
                }, SHOW_DELAY);
            }
        };

        const endLoading = () => {
            activeVisits = Math.max(0, activeVisits - 1);

            if (activeVisits > 0) {
                return;
            }

            window.clearTimeout(showTimer);

            if (shownAt === null) {
                return;
            }

            hideTimer = window.setTimeout(
                () => {
                    shownAt = null;
                    setIsVisible(false);
                },
                Math.max(0, MINIMUM_VISIBLE - (Date.now() - shownAt)),
            );
        };

        const removeBeforeListener = router.on('before', ({ detail }) => {
            const key = visitKey(detail.visit);

            if (
                !detail.visit.prefetch &&
                detail.visit.showProgress &&
                prefetchesInFlight.has(key) &&
                !awaitedPrefetches.has(key)
            ) {
                awaitedPrefetches.add(key);
                beginLoading();
            }
        });

        const removeStartListener = router.on('start', ({ detail }) => {
            if (detail.visit.prefetch) {
                prefetchesInFlight.add(visitKey(detail.visit));
            } else if (detail.visit.showProgress) {
                beginLoading();
            }
        });

        // Inertia clears `prefetch` on the visit before `finish`, so a finished
        // prefetch is recognised by its key instead of that flag.
        const removeFinishListener = router.on('finish', ({ detail }) => {
            const key = visitKey(detail.visit);

            if (prefetchesInFlight.delete(key)) {
                if (awaitedPrefetches.delete(key)) {
                    endLoading();
                }
            } else if (detail.visit.showProgress) {
                endLoading();
            }
        });

        // A new page has rendered, so nothing may keep the loader on screen.
        const removeNavigateListener = router.on('navigate', () => {
            awaitedPrefetches.clear();
            activeVisits = 1;
            endLoading();
        });

        return () => {
            removeBeforeListener();
            removeStartListener();
            removeFinishListener();
            removeNavigateListener();
            window.clearTimeout(showTimer);
            window.clearTimeout(hideTimer);
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            data-testid="global-loader"
            className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-foreground/10 backdrop-blur-sm duration-200 fade-in-0"
        >
            <div className="flex animate-in flex-col items-center gap-3 rounded-2xl border border-white/60 bg-card/70 px-8 py-6 shadow-2xl backdrop-blur-xl duration-200 zoom-in-95">
                <Spinner
                    aria-label="Memuat halaman"
                    className="size-9 text-primary"
                />
                <span aria-hidden="true" className="text-sm font-semibold">
                    Memuat...
                </span>
            </div>
        </div>
    );
}
