/**
 * Formats large numbers with K (thousands), M (millions), or B (billions) suffixes
 * @param value The number to format
 * @param currency Whether to prefix with currency symbol ($)
 * @param decimals Number of decimal places to show (default: 1)
 * @returns Formatted string representation of the number
 */
export const formatLargeNumber = (
    value: number,
    currency = false,
    decimals = 1
): string => {
    if (!Number.isFinite(value)) return 'N/A';

    const absValue = Math.abs(value);
    let formatted: string;

    if (absValue >= 1_000_000_000) {
        formatted = `${(value / 1_000_000_000).toFixed(decimals).replace(/\.0$/, '')}B`;
    } else if (absValue >= 1_000_000) {
        formatted = `${(value / 1_000_000).toFixed(decimals).replace(/\.0$/, '')}M`;
    } else if (absValue >= 1_000) {
        formatted = `${(value / 1_000).toFixed(decimals).replace(/\.0$/, '')}K`;
    } else {
        formatted = value.toFixed(decimals).replace(/\.0$/, '');
    }

    return currency ? `$${formatted}` : formatted;
};
