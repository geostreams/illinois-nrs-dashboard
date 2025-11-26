'use client';
import React, { ReactNode } from 'react';
import { Props as LegendProps } from 'recharts/types/component/DefaultLegendContent';

interface LineConfig {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
    dot?: boolean;
    activeDot?: boolean;
    connectNulls?: boolean;
}

interface MarkerConfig {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
    dashArray?: string;
}

interface ChartLegendProps extends LegendProps {
    lineConfig?: LineConfig[];
    markerConfig?: MarkerConfig[];
    crosshatchingSubjects?: string[];
}

// We need to match the ContentType expected by Legend
const ChartLegend = (props: ChartLegendProps): ReactNode => {
    const { payload, lineConfig = [], markerConfig = [], crosshatchingSubjects = [] } = props;
    if (!payload || payload.length === 0) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderLegendIcon = (entry: any) => {
        // Check if this entry represents a line chart by looking at the lineConfig
        const isLine = lineConfig.some((config) => config.dataKey === entry.dataKey || config.name === entry.value);
        // Check if this entry represents a marker by looking at the markerConfig
        const isMarker = markerConfig.some((config) => config.dataKey === entry.dataKey || config.name === entry.value);
        const markerStyle = markerConfig.find(
            (config) => config.dataKey === entry.dataKey || config.name === entry.value
        );
        // Check if this entry should have crosshatching
        const isCrosshatched = crosshatchingSubjects.some(
            (subject) => subject === entry.dataKey || subject === entry.value
        );

        if (isMarker) {
            // Render a horizontal line indicator for markers
            return (
                <div
                    style={{
                        width: 16,
                        height: 10,
                        position: 'relative',
                        marginRight: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: 2,
                            borderTop: markerStyle?.dashArray
                                ? `2px dashed ${entry.color}`
                                : `2px solid ${entry.color}`,
                            backgroundColor: 'transparent',
                        }}
                    />
                </div>
            );
        } else if (isLine) {
            // Render a line indicator
            return (
                <div
                    style={{
                        width: 16,
                        height: 10,
                        position: 'relative',
                        marginRight: 6,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: 2,
                            backgroundColor: entry.color,
                            position: 'relative',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            width: 4,
                            height: 4,
                            backgroundColor: entry.color,
                            borderRadius: '50%',
                            transform: 'translate(50%, 0)',
                        }}
                    />
                </div>
            );
        } else if (isCrosshatched) {
            // Render a crosshatched rectangle indicator for bars using CSS gradients
            return (
                <div
                    style={{
                        width: 12,
                        height: 12,
                        backgroundColor: entry.color,
                        border: '1px solid black',
                        marginRight: 6,
                        boxSizing: 'border-box',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: `
                                repeating-linear-gradient(
                                    45deg,
                                    transparent,
                                    transparent 2px,
                                    white 2px,
                                    white 3px
                                ),
                                repeating-linear-gradient(
                                    -45deg,
                                    transparent,
                                    transparent 2px,
                                    white 2px,
                                    white 3px
                                )
                            `,
                            opacity: 0.6,
                        }}
                    />
                </div>
            );
        } else {
            // Render a rectangle indicator for bars
            return (
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
            );
        }
    };

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
                    {renderLegendIcon(entry)}
                    <span style={{ color: 'black', fontSize: '0.75rem' }}>
                        {typeof entry.value === 'string'
                            ? entry.value.charAt(0).toUpperCase() + entry.value.slice(1)
                            : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ChartLegend;
