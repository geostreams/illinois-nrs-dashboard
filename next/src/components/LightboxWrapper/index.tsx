'use client';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import './lightbox.css';

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
    const imageUrl = `${process.env.CMS_API_URL}${
        image.formats?.large?.url || image.formats?.medium?.url || image.url
    }`;

    return (
        <Lightbox
            open={isOpen}
            close={onClose}
            carousel={{ finite: true }}
            render={{
                buttonPrev: () => null,
                buttonNext: () => null,
            }}
            controller={{
                closeOnBackdropClick: true,
            }}
            slides={[{ src: imageUrl }]}
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
