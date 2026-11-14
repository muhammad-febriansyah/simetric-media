import { useId } from 'react';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

type DotPatternProps = SVGProps<SVGSVGElement> & {
    /** Distance between dots in pixels. */
    spacing?: number;
    /** Dot radius in pixels. */
    radius?: number;
};

/**
 * Decorative dot grid background (adapted from Magic UI "Dot Pattern").
 * Rendered as a single SVG pattern instead of one element per dot, so it stays
 * cheap on large hero sections. Color follows `currentColor`.
 */
export function DotPattern({
    spacing = 18,
    radius = 1.2,
    className,
    ...props
}: DotPatternProps) {
    const id = useId();

    return (
        <svg
            aria-hidden="true"
            className={cn(
                'pointer-events-none absolute inset-0 size-full text-primary/20',
                className,
            )}
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={spacing}
                    height={spacing}
                    patternUnits="userSpaceOnUse"
                >
                    <circle
                        cx={spacing / 2}
                        cy={spacing / 2}
                        r={radius}
                        fill="currentColor"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
}
