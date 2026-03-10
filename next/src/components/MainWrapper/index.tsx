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
    // Text Fragment hashes start with :~: — let the browser handle those natively.
    if (!hash || hash.startsWith(':~:')) return;
    const el = document.getElementById(hash);
    if (!el) return;
    if (el.closest('.MuiAccordionDetails-root')) return;
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

/**
 * Reads the ?highlight= query param, uses mark.js to highlight all matching text
 * in the page, then smoothly scrolls to the first match. Accounts for the sticky
 * navbar (~120px) by applying a scroll-margin-top offset. Cleans up the param
 * from the URL afterwards to avoid stale highlights on back-navigation.
 */
async function highlightAndScroll() {
    const params = new URLSearchParams(window.location.search);
    const highlightText = params.get('highlight');
    if (!highlightText) return;

    // Remove the ?highlight= param from the address bar without triggering navigation.
    params.delete('highlight');
    const newSearch = params.toString();
    const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
    window.history.replaceState(null, '', newUrl);

    const Mark = (await import('mark.js')).default;

    // Scope to the innermost <main> (the page content box) to exclude the sidebar,
    // which lives in a sibling div. Falls back to the outermost <main> on pages
    // without a nested main (e.g. the home page).
    const contentRoot =
        document.querySelector<HTMLElement>('main main') ??
        document.querySelector<HTMLElement>('main') ??
        document.body;

    const instance = new Mark(contentRoot);

    instance.mark(highlightText, {
        separateWordSearch: false,
        accuracy: 'partially',
        // Exclude nav elements (breadcrumbs use <nav aria-label="breadcrumb">).
        exclude: ['nav', 'nav *'],
        done() {
            const firstMark = document.querySelector<HTMLElement>('mark[data-markjs="true"]');
            if (!firstMark) return;
            // Offset scroll position to account for the sticky navbar (120px).
            const top = firstMark.getBoundingClientRect().top + window.scrollY - 130;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        },
    });
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

    useEffect(() => {
        // Delay slightly to allow the page content to finish rendering before marking.
        const timeoutId = window.setTimeout(highlightAndScroll, 300);
        return () => window.clearTimeout(timeoutId);
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
