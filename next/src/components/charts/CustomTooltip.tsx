import React from 'react';
import { TooltipProps } from 'recharts';
import { formatValueWithUnit } from '@/utils/formatters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CustomTooltipProps extends TooltipProps<any, any> {
    unit?: string;
    barUnit?: string;
    lineUnit?: string;
    barConfig?: Array<{ dataKey: string; name: string; color: string }>;
    lineConfig?: Array<{ dataKey: string; name: string; color: string }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
    unit,
    barUnit,
    lineUnit,
    barConfig,
    lineConfig,
}) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px',
                    fontSize: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
            >
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>{label}</p>
                {payload
                    .slice()
                    .reverse()
                    .map((entry, index) => {
                        // Determine the appropriate unit based on whether it's a bar or line
                        let itemUnit = unit;
                        const isBar = barConfig?.some((config) => config.dataKey === entry.dataKey);
                        const isLine = lineConfig?.some(
                            (config) => config.dataKey === entry.dataKey || config.name === entry.name
                        );

                        if (barUnit && lineUnit) {
                            itemUnit = isBar ? barUnit : lineUnit;
                        }

                        // Render different indicators based on type
                        const renderIndicator = () => {
                            if (isLine) {
                                // Render a line indicator similar to chartLegend
                                return (
                                    <div
                                        style={{
                                            width: 16,
                                            height: 10,
                                            position: 'relative',
                                            marginRight: 8,
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
                            } else {
                                // Render a rectangle indicator for bars with black border and no border radius
                                return (
                                    <div
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            backgroundColor: entry.color,
                                            border: '1px solid black',
                                            marginRight: '8px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                );
                            }
                        };

                        return (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '2px 0',
                                    color: '#000000',
                                }}
                            >
                                {renderIndicator()}
                                <span>
                                    {entry.name}: {formatValueWithUnit(entry.value as number, itemUnit)}
                                </span>
                            </div>
                        );
                    })}
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
