import { motion } from 'motion/react';
import type { RefObject } from 'react';
import { useEffect, useId, useState } from 'react';
import { cn } from '@/lib/utils';

type AnimatedBeamProps = {
    className?: string;
    containerRef: RefObject<HTMLElement | null>;
    fromRef: RefObject<HTMLElement | null>;
    toRef: RefObject<HTMLElement | null>;
    /** Bend of the line in pixels; positive curves upward. */
    curvature?: number;
    /** Run the light from `toRef` back to `fromRef`. */
    reverse?: boolean;
    duration?: number;
    delay?: number;
};

/**
 * A connector line between two elements with a light travelling along it
 * (adapted from Magic UI "Animated Beam"). Recomputes on resize.
 */
export function AnimatedBeam({
    className,
    containerRef,
    fromRef,
    toRef,
    curvature = 0,
    reverse = false,
    duration = 5,
    delay = 0,
}: AnimatedBeamProps) {
    const id = useId();
    const [path, setPath] = useState('');
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updatePath = () => {
            const container = containerRef.current;
            const from = fromRef.current;
            const to = toRef.current;

            if (!container || !from || !to) {
                return;
            }

            const containerRect = container.getBoundingClientRect();
            const fromRect = from.getBoundingClientRect();
            const toRect = to.getBoundingClientRect();
            const startX = fromRect.left - containerRect.left + fromRect.width / 2;
            const startY = fromRect.top - containerRect.top + fromRect.height / 2;
            const endX = toRect.left - containerRect.left + toRect.width / 2;
            const endY = toRect.top - containerRect.top + toRect.height / 2;

            setSize({ width: containerRect.width, height: containerRect.height });
            setPath(
                `M ${startX},${startY} Q ${(startX + endX) / 2},${startY - curvature} ${endX},${endY}`,
            );
        };

        const observer = new ResizeObserver(updatePath);

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        updatePath();

        return () => observer.disconnect();
    }, [containerRef, fromRef, toRef, curvature]);

    const gradient = reverse
        ? { x1: ['90%', '-10%'], x2: ['100%', '0%'] }
        : { x1: ['10%', '110%'], x2: ['0%', '100%'] };

    return (
        <svg
            aria-hidden="true"
            fill="none"
            width={size.width}
            height={size.height}
            viewBox={`0 0 ${size.width} ${size.height}`}
            className={cn(
                'pointer-events-none absolute top-0 left-0 transform-gpu',
                className,
            )}
        >
            <path
                d={path}
                stroke="currentColor"
                strokeWidth={2}
                strokeOpacity={0.15}
                strokeLinecap="round"
            />
            <path
                d={path}
                stroke={`url(#${id})`}
                strokeWidth={2}
                strokeLinecap="round"
            />
            <defs>
                <motion.linearGradient
                    id={id}
                    gradientUnits="userSpaceOnUse"
                    initial={{ x1: '0%', x2: '0%', y1: '0%', y2: '0%' }}
                    animate={{ ...gradient, y1: ['0%', '0%'], y2: ['0%', '0%'] }}
                    transition={{
                        delay,
                        duration,
                        ease: [0.16, 1, 0.3, 1],
                        repeat: Infinity,
                    }}
                >
                    <stop stopColor="#2547F9" stopOpacity="0" />
                    <stop stopColor="#2547F9" />
                    <stop offset="32.5%" stopColor="#47BB8E" />
                    <stop offset="100%" stopColor="#47BB8E" stopOpacity="0" />
                </motion.linearGradient>
            </defs>
        </svg>
    );
}
