'use client';

import React, { useEffect, useRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import styles from './styles.module.css';

interface RichContentViewerProps {
    content: string;
    baseImageUrl?: string;
}

const RichContentViewer: React.FC<RichContentViewerProps> = ({
    content,
    baseImageUrl = process.env.CMS_API_URL,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Add tabIndex to each heading
    useEffect(() => {
        if (containerRef.current) {
            // Find all heading elements h1-h4
            const headings =
                containerRef.current.querySelectorAll('h1, h2, h3, h4');

            // Add tabIndex to each heading
            headings.forEach((heading) => {
                heading.setAttribute('tabIndex', '0');
            });
        }
    }, [content]); // Re-run when content changes

    const processContent = (htmlContent: string) => {
        let processedContent = htmlContent.replace(
            /src="\/uploads/g,
            `src="${baseImageUrl}/uploads`
        );

        // Remove font-family declarations including HTML entities and escaped quotes
        processedContent = processedContent.replace(
            /font-family:[^;]*(&quot;|"|')[^;]*(&quot;|"|')?[^;]*(;|})/g,
            '$3'
        );

        // DOMPurify ensures that the HTML content is safe to render
        // by removing any malicious code that could lead to XSS attacks
        return DOMPurify.sanitize(processedContent, {
            ADD_TAGS: ['iframe'],
            ADD_ATTR: ['target', 'style', 'tabindex'],
        });
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <div
                dangerouslySetInnerHTML={{
                    __html: processContent(content),
                }}
            />
        </div>
    );
};

export default RichContentViewer;
