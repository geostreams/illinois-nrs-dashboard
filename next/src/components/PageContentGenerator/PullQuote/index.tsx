import styles from './styles.module.css';
import DOMPurify from 'isomorphic-dompurify';

interface PullQuoteProps {
    quoteText: string;
}
// Helper function to parse and style the quote text

const PullQuote = ({ quoteText }: PullQuoteProps) => {
    const processContent = (htmlContent: string) => {
        // Remove font-family declarations including HTML entities and escaped quotes
        let processedContent = htmlContent.replace(
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
        <div className={styles.pullQuoteContainer}>
            <div
                dangerouslySetInnerHTML={{
                    __html: processContent(quoteText),
                }}
            />
        </div>
    );
};

export default PullQuote;
