'use client';

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import styles from './styles.module.css';

interface RichContentViewerProps {
    content: string;
    baseImageUrl?: string;
}

const RichContentViewer: React.FC<RichContentViewerProps> = ({
    content,
    baseImageUrl = process.env.NEXT_PUBLIC_CMS_API_URL,
}) => {
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
            ADD_ATTR: ['target', 'style'],
        });
    };

    return (
        <div className={styles.container}>
            <div
                dangerouslySetInnerHTML={{
                    __html: processContent(content),
                }}
            />
        </div>
    );
};

export default RichContentViewer;
