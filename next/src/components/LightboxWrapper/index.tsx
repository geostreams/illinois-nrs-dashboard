'use client';

import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import './lightbox.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import DOMPurify from 'dompurify';

interface LightboxWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    image: {
        url: string;
        alternativeText?: string | null;
        caption?: string | null;
        formats?: {
            large?: {
                url: string;
            };
            medium?: {
                url: string;
            };
        };
    };
}

export const LightboxWrapper: React.FC<LightboxWrapperProps> = ({ isOpen, onClose, image }) => {
    // Get the highest quality image URL available
    const imageUrl = `${process.env.CMS_API_URL}${image.url}`;

    // If the caption starts with "Lightbox: ", remove the prefix without mutating props
    const rawCaption = image.caption?.startsWith('Lightbox: ') ? image.caption.substring(10) : (image.caption ?? '');

    // Treat the caption as a HTML string and parse it
    const caption = DOMPurify.sanitize(rawCaption, {
        ALLOWED_TAGS: ['p', 'b', 'i', 'u', 's', 'em', 'strong', 'span', 'a'],
        ALLOWED_ATTR: ['style', 'href', 'target', 'rel'],
    });

    return (
        <Lightbox
            open={isOpen}
            close={onClose}
            plugins={[Captions]}
            carousel={{ finite: true }}
            render={{
                buttonPrev: () => null,
                buttonNext: () => null,
            }}
            controller={{
                closeOnBackdropClick: true,
            }}
            slides={[
                {
                    src: imageUrl,
                    alt: image.alternativeText ?? undefined,
                    description: caption ? <div dangerouslySetInnerHTML={{ __html: caption }} /> : undefined,
                },
            ]}
            captions={{}}
            styles={{
                root: {
                    '--yarl__color_backdrop': 'rgba(0, 0, 0, 0.7)',
                },
                container: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                button: {
                    margin: '0.75rem',
                    padding: '0.75rem',
                },
            }}
            className="custom-lightbox"
        />
    );
};
