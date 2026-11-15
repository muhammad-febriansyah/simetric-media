/**
 * Point the page's favicon links at a new image. The root view renders the
 * favicon from the website settings, but an Inertia visit keeps that HTML head,
 * so after the favicon is changed in the admin the tab would keep the old icon
 * until a full reload.
 */
export function syncFavicon(url: string | null | undefined): void {
    if (!url || typeof document === 'undefined') {
        return;
    }

    document
        .querySelectorAll<HTMLLinkElement>(
            'link[rel="icon"], link[rel="apple-touch-icon"]',
        )
        .forEach((link) => {
            if (link.href !== url) {
                link.href = url;
                link.removeAttribute('type');
                link.removeAttribute('sizes');
            }
        });
}
