interface HeadingProps {
    headingText: string;
    headingColor?: string;
    headingType: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = ({ headingText, headingColor, headingType }: HeadingProps) => {
    switch (headingType) {
        case 'h1':
            return (
                <h1
                    style={{
                        color: headingColor ? headingColor : '#0A3977',
                        fontFamily: "'Bebas Neue', 'Open Sans', sans-serif",
                        fontSize: '80px',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        marginBottom: '-34px',
                    }}
                >
                    {headingText}
                </h1>
            );
        case 'h2':
            return (
                <h2
                    style={{
                        color: headingColor ? headingColor : '#006400',
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '28px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        marginBottom: '-25px',
                    }}
                >
                    {headingText}
                </h2>
            );
        case 'h3':
            return (
                <h3
                    style={{
                        color: headingColor ? headingColor : '#00516F',
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '24px',
                        fontWeight: 600,
                    }}
                >
                    {headingText}
                </h3>
            );
        case 'h4':
            return (
                <h4
                    style={{
                        color: headingColor ? headingColor : '#00516F',
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '20px',
                        fontWeight: 600,
                        maxWidth: '60%',
                    }}
                >
                    {headingText}
                </h4>
            );
        case 'h5':
            return (
                <h5
                    style={{
                        color: headingColor ? headingColor : '#0516F',
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '16px',
                        fontWeight: 600,
                        maxWidth: '60%',
                    }}
                >
                    {headingText}
                </h5>
            );
        default:
            return null;
    }
};

export default Heading;
