'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface MainWrapperProps {
    children: ReactNode;
}

export function MainWrapper({ children }: MainWrapperProps) {
    const pathname = usePathname();
    const isHomepage = pathname === '/';

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
