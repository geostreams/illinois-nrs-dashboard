interface PullQuoteProps {
    largeText: string;
    largeTextColor: string;
    quoteText: string;
}

import styles from './styles.module.css';

// Helper function to parse and style the quote text
const parseQuoteText = (text: string) => {
    // Remove the <p> tags
    const textWithoutParagraphs = text.replace(/<p>/g, '').replace('</p>', '');
    // Split the text by <strong> and </strong> tags
    const parts = textWithoutParagraphs.split(/<\/?strong>/);

    return parts.map((part, index) => {
        // Even indices are normal text, odd indices were inside <strong> tags
        return index % 2 === 0 ? (
            part
        ) : (
            <span key={index} className={styles.highlight}>
                {part}
            </span>
        );
    });
};

const PullQuote = ({
    largeText,
    largeTextColor,
    quoteText,
}: PullQuoteProps) => {
    return (
        <div className={styles.pullQuoteContainer}>
            {largeText && (
                <div className={styles.pullQuote}>
                    <p style={{ margin: '0 0' }}>
                        <span
                            className={styles.largeText}
                            style={{ color: largeTextColor || '#0E4A5D' }}
                        >
                            {largeText}
                        </span>
                    </p>
                </div>
            )}
            {quoteText && (
                <p className={styles.quoteText}>{parseQuoteText(quoteText)}</p>
            )}
        </div>
    );
};

export default PullQuote;
