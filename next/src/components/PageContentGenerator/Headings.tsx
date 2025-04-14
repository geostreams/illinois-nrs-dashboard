'use client';

import DropletIcon from '@/assets/icons/droplet.svg';
import DollarIcon from '@/assets/icons/square-dollar.svg';
import TreesIcon from '@/assets/icons/trees.svg';
import UserIcon from '@/assets/icons/user.svg';
import { Typography } from '@mui/material';

interface HeadingProps {
    headingText: string;
    headingColor?: string;
    headingType: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    headingIcon: 'user' | 'dollar' | 'trees' | 'droplet';
    hideInSidebar?: boolean;
}

const styles = {
    heading1: {
        color: '#0A3977',
        fontFamily: "'Bebas Neue', 'Source Sans', sans-serif",
        fontSize: '80px',
        fontWeight: 500,
        textTransform: 'uppercase',
        display: 'flex',
        gap: '12px', // Adds consistent spacing between icon and text
        marginBottom: '8px',
    },
    heading2: {
        color: '#0A3977',
        fontFamily: "'Source Sans', sans-serif",
        fontSize: '28px',
        fontWeight: 700,
        textTransform: 'uppercase',
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
    },
    heading3: {
        color: '#00516F',
        fontFamily: "'Source Sans', sans-serif",
        fontSize: '24px',
        fontWeight: 600,
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
    },
    heading4: {
        color: '#00516F',
        fontFamily: "'Source Sans', sans-serif",
        fontSize: '20px',
        fontWeight: 600,
        maxWidth: '60%',
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
    },
    heading5: {
        color: '#0516F',
        fontFamily: "'Source Sans', sans-serif",
        fontSize: '16px',
        fontWeight: 600,
        maxWidth: '60%',
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
    },
    focusStyles: {
        '&:focus': {
            outline: '2px solid currentColor',
            outlineOffset: '2px',
            borderRadius: '2px',
        },
        '&:focus:not(:focus-visible)': {
            outline: 'none',
        },
    },
};

const Heading = ({
    headingText,
    headingColor,
    headingType,
    headingIcon,
    hideInSidebar,
}: HeadingProps) => {
    let icon = null;

    // Adjust icon size based on heading type
    const getIconSize = (type: string) => {
        switch (type) {
            case 'h1':
                return 72;
            case 'h2':
                return 26;
            case 'h3':
                return 22;
            case 'h4':
                return 20;
            case 'h5':
                return 16;
            default:
                return 22;
        }
    };

    const iconSize = getIconSize(headingType);

    switch (headingIcon) {
        case 'user':
            icon = (
                <UserIcon
                    width={iconSize}
                    height={iconSize}
                    fill={headingColor || '#000'}
                    style={{ flexShrink: 0 }}
                />
            );
            break;
        case 'dollar':
            icon = (
                <DollarIcon
                    width={iconSize}
                    height={iconSize}
                    fill={headingColor || '#000'}
                    style={{ flexShrink: 0 }}
                />
            );
            break;
        case 'trees':
            icon = (
                <TreesIcon
                    width={iconSize}
                    height={iconSize}
                    fill={headingColor || '#000'}
                    style={{ flexShrink: 0 }}
                />
            );
            break;
        case 'droplet':
            icon = (
                <DropletIcon
                    width={iconSize}
                    height={iconSize}
                    fill={headingColor || '#000'}
                    style={{ flexShrink: 0 }}
                />
            );
            break;
        default:
            icon = null;
    }

    // Generate slug from heading text
    const headingId = headingText
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

    // Create anchor link for h1, h2, and h3
    const createAnchorHeading = (typographyElement: React.ReactNode) => {
        if (['h1', 'h2', 'h3'].includes(headingType)) {
            return (
                <div
                    id={headingId}
                    hidden-in-sidebar={hideInSidebar ? 'true' : 'false'}
                    style={{ position: 'relative', scrollMarginTop: '120px' }}
                >
                    {typographyElement}
                    <a
                        href={`#${headingId}`}
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '-1.5em',
                            transform: 'translateY(-50%)',
                            opacity: 0,
                            fontSize: '0.8em',
                            paddingRight: '0.5em',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                        className="heading-anchor hover:opacity-100"
                    />
                </div>
            );
        }
        return typographyElement;
    };

    switch (headingType) {
        case 'h1':
            return createAnchorHeading(
                <Typography
                    variant="h1"
                    component="h1"
                    tabIndex={0}
                    sx={{
                        ...styles.heading1,
                        ...styles.focusStyles,
                        color: headingColor || styles.heading1.color,
                    }}
                >
                    {icon}
                    <span>{headingText}</span>
                </Typography>
            );
        case 'h2':
            return createAnchorHeading(
                <Typography
                    variant="h2"
                    component="h2"
                    tabIndex={0}
                    sx={{
                        ...styles.heading2,
                        ...styles.focusStyles,
                        color: headingColor || styles.heading2.color,
                    }}
                >
                    {icon}
                    <span>{headingText}</span>
                </Typography>
            );
        case 'h3':
            return createAnchorHeading(
                <Typography
                    variant="h3"
                    component="h3"
                    tabIndex={0}
                    sx={{
                        ...styles.heading3,
                        ...styles.focusStyles,
                        color: headingColor || styles.heading3.color,
                    }}
                >
                    {icon}
                    <span>{headingText}</span>
                </Typography>
            );
        case 'h4':
            return (
                <Typography
                    variant="h4"
                    component="h4"
                    tabIndex={0}
                    sx={{
                        ...styles.heading4,
                        ...styles.focusStyles,
                        color: headingColor || styles.heading4.color,
                    }}
                >
                    {icon}
                    <span>{headingText}</span>
                </Typography>
            );
        case 'h5':
            return (
                <Typography
                    variant="h5"
                    component="h5"
                    sx={{
                        ...styles.heading5,
                        ...styles.focusStyles,
                        color: headingColor || styles.heading5.color,
                    }}
                >
                    {icon}
                    <span>{headingText}</span>
                </Typography>
            );
        default:
            return null;
    }
};

export default Heading;
