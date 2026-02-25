'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface MainWrapperProps {
    children: ReactNode;
}

/**
 * Scrolls to the element with id matching window.location.hash.
 * Skips if target is inside an accordion (accordion has its own handler).
 * Uses scrollIntoView so scroll-margin-top on headings is respected.
 * Explicit handling fixes broken native hash scroll when JS is enabled (e.g. Next.js App Router).
 */
function scrollToHashTarget() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    if (el.closest('.MuiAccordionDetails-root')) return;
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

export function MainWrapper({ children }: MainWrapperProps) {
    const pathname = usePathname();
    const isHomepage = pathname === '/';

    useEffect(() => {
        const handleHashChange = () => scrollToHashTarget();
        const timeoutId = window.location.hash ? window.setTimeout(scrollToHashTarget, 100) : undefined;
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            if (timeoutId) window.clearTimeout(timeoutId);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [pathname]);

    return (
        <main
            style={{
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                position: 'relative',
                ...(isHomepage ? {} : { marginBottom: '75px' }),
            }}
        >
            {children}
        </main>
    );
}
