interface HeadingProps {
    headingText: string;
    headingColor?: string;
}

const Heading1 = ({ headingText, headingColor }: HeadingProps) => {
    return (
        <h1
            style={{
                color: headingColor ? headingColor : '#003D6D',
                fontFamily: "'Bebas Neue', sans-serif",
                lineHeight: 1.2,
                margin: '1.5rem 0 1rem',
                fontSize: '2.5rem',
            }}
        >
            {headingText}
        </h1>
    );
};

const Heading2 = ({ headingText, headingColor }: HeadingProps) => {
    return (
        <h2
            style={{
                color: headingColor ? headingColor : '#008BC7',
                fontFamily: "'Bebas Neue', sans-serif",
                lineHeight: 1.2,
                margin: '1.5rem 0 1rem',
                fontSize: '2rem',
            }}
        >
            {headingText}
        </h2>
    );
};

const Heading3 = ({ headingText, headingColor }: HeadingProps) => {
    return (
        <h3
            style={{
                color: headingColor ? headingColor : '#003D6D',
                fontFamily: "'Bebas Neue', sans-serif",
                lineHeight: 1.2,
                margin: '1.5rem 0 1rem',
                fontSize: '1.75rem',
            }}
        >
            {headingText}
        </h3>
    );
};

export { Heading1, Heading2, Heading3 };
