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
}

const styles = {
    heading1: {
        color: '#0A3977',
        fontFamily: "'Bebas Neue', 'Open Sans', sans-serif",
        fontSize: '80px',
        fontWeight: 500,
        textTransform: 'uppercase',
        display: 'flex',
        gap: '12px', // Adds consistent spacing between icon and text
        marginBottom: '8px',
    },
    heading2: {
        color: '#006400',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '28px',
        fontWeight: 700,
        textTransform: 'uppercase',
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
    },
    heading3: {
        color: '#00516F',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '24px',
        fontWeight: 600,
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
    },
    heading4: {
        color: '#00516F',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '20px',
        fontWeight: 600,
        maxWidth: '60%',
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
    },
    heading5: {
        color: '#0516F',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '16px',
        fontWeight: 600,
        maxWidth: '60%',
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
    },
};

const Heading = ({
    headingText,
    headingColor,
    headingType,
    headingIcon,
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

    switch (headingType) {
        case 'h1':
            return (
                <Typography
                    variant="h1"
                    sx={{
                        ...styles.heading1,
                        color: headingColor || styles.heading1.color,
                    }}
                >
                    {icon}
                    <span>{headingText}</span>
                </Typography>
            );
        case 'h2':
            return (
                <Typography
                    variant="h2"
                    sx={{
                        ...styles.heading2,
                        color: headingColor || styles.heading2.color,
                    }}
                >
                    {icon}
                    <span>{headingText}</span>
                </Typography>
            );
        case 'h3':
            return (
                <Typography
                    variant="h3"
                    sx={{
                        ...styles.heading3,
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
                    sx={{
                        ...styles.heading4,
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
                    sx={{
                        ...styles.heading5,
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
