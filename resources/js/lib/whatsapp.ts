/**
 * Build a wa.me chat link for a number in international format (e.g. 6281234567890)
 * with a pre-filled greeting.
 */
export function whatsappUrl(
    number: string | null | undefined,
    message = 'Halo, saya ingin konsultasi tentang kebutuhan teknologi perusahaan saya.',
): string | null {
    const digits = (number ?? '').replace(/\D/g, '');

    if (digits === '') {
        return null;
    }

    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
