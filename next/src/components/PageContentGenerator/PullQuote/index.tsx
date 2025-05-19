import styles from './styles.module.css';
import DOMPurify from 'isomorphic-dompurify';

interface PullQuoteProps {
    quoteText: string;
}
// Helper function to parse and style the quote text

const PullQuote = ({ quoteText }: PullQuoteProps) => {
    const processContent = (htmlContent: string) => {
        // Remove font-family declarations including HTML entities and escaped quotes
        let processedContent = htmlContent.replace(/font-family:[^;]*(&quot;|"|')[^;]*(&quot;|"|')?[^;]*(;|})/g, '$3');

        // Replace p tags to have only a bottom margin
        processedContent = processedContent.replace(/<p([^>]*)>/g, '<p$1 style="margin-top: 0; margin-bottom: 1;">');

        // Replace h1 tags with p tags while preserving h1 styling
        processedContent = processedContent.replace(
            /<h1([^>]*)>/g,
            '<p$1 style="font-size: 3em; font-weight: bold; margin: 0 0 0 0; font-family: Poppins;">'
        );
        processedContent = processedContent.replace(/<\/h1>/g, '</p>');

        // Replace h4 tags with p tags while preserving h4 styling
        processedContent = processedContent.replace(
            /<h4([^>]*)>/g,
            '<p$1 style="font-size: 18px; font-weight: 600; margin: 0 0 0 0; font-family: Open Sans, sans-serif;">'
        );
        processedContent = processedContent.replace(/<\/h4>/g, '</p>');

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
