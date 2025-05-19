import React from 'react';
import { ComponentRenderer } from '@/components/PageContentGenerator/ComponentRenderer';

interface PageContentGeneratorProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pageContents: any[];
}

export const PageContentGenerator: React.FC<PageContentGeneratorProps> = ({ pageContents }) => {
    return (
        <>
            {pageContents.map((component, index) => (
                <ComponentRenderer key={index} component={component} />
            ))}
        </>
    );
};
