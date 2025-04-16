'use client';
import React, { ReactNode } from 'react';
import { Props as LegendProps } from 'recharts/types/component/DefaultLegendContent';

// We need to match the ContentType expected by Legend
const ChartLegend = (props: LegendProps): ReactNode => {
    const { payload } = props;
    if (!payload || payload.length === 0) return null;

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '8px',
                padding: 0,
                margin: '10px 0 0 0',
            }}
        >
            {payload.map((entry, index) => (
                <div
                    key={`item-${index}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '12px',
                        padding: '2px 4px',
                    }}
                >
                    <div
                        style={{
                            minWidth: 10,
                            height: 10,
                            backgroundColor: entry.color,
                            border: '1px solid black',
                            marginRight: 6,
                            boxSizing: 'border-box',
                        }}
                    />
                    <span style={{ color: 'black', fontSize: '0.75rem' }}>
                        {typeof entry.value === 'string'
                            ? entry.value.charAt(0).toUpperCase() +
                              entry.value.slice(1)
                            : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ChartLegend;
