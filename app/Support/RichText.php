<?php

namespace App\Support;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

/**
 * Helpers for HTML written in the admin rich text editor (Tiptap).
 *
 * Only the formatting the editor toolbar can produce is kept; everything else
 * (scripts, styles, event handlers, unknown tags) is removed before saving.
 */
class RichText
{
    private const MAX_INPUT_LENGTH = 100_000;

    private static ?HtmlSanitizer $sanitizer = null;

    /**
     * Sanitize editor HTML. Returns null when the content has no visible text.
     */
    public static function sanitize(?string $html): ?string
    {
        if (blank($html)) {
            return null;
        }

        $clean = trim(self::sanitizer()->sanitize($html));

        return self::isEmpty($clean) ? null : $clean;
    }

    /**
     * Convert plain text (paragraphs separated by blank lines) to editor HTML.
     * Values that already look like HTML are returned unchanged.
     */
    public static function fromPlainText(?string $text): ?string
    {
        if (blank($text)) {
            return null;
        }

        if (self::isHtml($text)) {
            return $text;
        }

        return collect(preg_split('/\R{2,}/', trim($text)))
            ->map(fn (string $paragraph): string => '<p>'.nl2br(e(trim($paragraph)), false).'</p>')
            ->implode('');
    }

    public static function isHtml(string $value): bool
    {
        return (bool) preg_match('/^\s*<(p|h[1-6]|ul|ol|blockquote)[\s>]/i', $value);
    }

    private static function isEmpty(string $html): bool
    {
        return trim(html_entity_decode(strip_tags($html)), " \t\n\r\0\x0B\u{00A0}") === '';
    }

    private static function sanitizer(): HtmlSanitizer
    {
        return self::$sanitizer ??= new HtmlSanitizer(
            (new HtmlSanitizerConfig)
                ->allowElement('p')
                ->allowElement('br')
                ->allowElement('strong')
                ->allowElement('b')
                ->allowElement('em')
                ->allowElement('i')
                ->allowElement('u')
                ->allowElement('s')
                ->allowElement('h2')
                ->allowElement('h3')
                ->allowElement('ul')
                ->allowElement('ol')
                ->allowElement('li')
                ->allowElement('blockquote')
                ->allowElement('code')
                ->allowElement('hr')
                ->allowElement('a', ['href', 'target'])
                ->allowLinkSchemes(['http', 'https', 'mailto', 'tel'])
                ->allowRelativeLinks()
                ->forceAttribute('a', 'rel', 'noopener noreferrer nofollow')
                ->withMaxInputLength(self::MAX_INPUT_LENGTH),
        );
    }
}
