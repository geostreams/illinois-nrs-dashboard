'use client';

import React, { useEffect, useRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import styles from './styles.module.css';

interface RichContentViewerProps {
    content: string;
    baseImageUrl?: string;
}

const RichContentViewer: React.FC<RichContentViewerProps> = ({ content, baseImageUrl = process.env.CMS_API_URL }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Add tabIndex to headings
    useEffect(() => {
        if (containerRef.current) {
            // Find all heading elements h1-h3
            const headings = containerRef.current.querySelectorAll('h1, h2, h3');

            // Add tabIndex to each heading
            headings.forEach((heading) => {
                heading.setAttribute('tabIndex', '0');
            });

            // Find all links
            const links = containerRef.current.querySelectorAll('a');

            // Add target="_blank" to each link
            links.forEach((link) => {
                link.setAttribute('target', '_blank');
            });
        }
    }, [content]); // Re-run when content changes

    const processContent = (htmlContent: string) => {
        let processedContent = htmlContent.replace(/src="\/uploads/g, `src="${baseImageUrl}/uploads`);

        // Remove paragraphs with just whitespace or &nbsp;
        processedContent = processedContent.replace(/<p(?:\s+class="p1")?>\s*(?:&nbsp;)?\s*<\/p>/g, '');

        // Add margin-bottom to all p tags with a margin-bottom
        processedContent = processedContent.replace(/<p(?:\s+class="p1")?>/g, '<p style="margin-bottom: 8px;">');

        // Replace all instaces of <strong> with <b>
        processedContent = processedContent.replace(/<strong>/g, '<b>');
        processedContent = processedContent.replace(/<\/strong>/g, '</b>');

        // Replace all instances of h4 with p that has the same styling properties
        // processedContent = processedContent.replace(
        //     /<h4([^>]*)>(.*?)<\/h4>/g,
        //     '<p style="font-size: 20px; color: #00516f; font-family: \'Source Sans\', sans-serif; font-weight: 600; display: flex; gap: 8px; margin-bottom: 8px; line-height: 1.2;">$2</p>'
        // );

        // Remove font-family declarations including HTML entities and escaped quotes
        processedContent = processedContent.replace(/font-family:[^;]*(&quot;|"|')[^;]*(&quot;|"|')?[^;]*(;|})/g, '$3');

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
