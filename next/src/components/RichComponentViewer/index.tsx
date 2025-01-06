'use client';

import React from 'react';
import DOMPurify from 'dompurify';
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
        const processedContent = content;

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
