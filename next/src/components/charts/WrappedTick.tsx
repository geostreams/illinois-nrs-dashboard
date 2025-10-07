import React from 'react';

interface WrappedTickProps {
    x?: number;
    y?: number;
    payload?: {
        value: string;
    };
    maxChars?: number;
    fontSize?: number;
    fill?: string;
}

const WrappedTick: React.FC<WrappedTickProps> = ({
    x = 0,
    y = 0,
    payload,
    maxChars = 16,
    fontSize = 12,
    fill = '#666',
}) => {
    if (!payload?.value) return null;

    const text = payload.value;
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        if ((currentLine + word).length <= maxChars) {
            currentLine = currentLine ? `${currentLine} ${word}` : word;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);

    return (
        <g transform={`translate(${x},${y})`}>
            {lines.map((line, i) => (
                <text key={i} x={0} y={8 + i * fontSize} textAnchor="middle" fontSize={fontSize} fill={fill}>
                    {line}
                </text>
            ))}
        </g>
    );
};

export default WrappedTick;
