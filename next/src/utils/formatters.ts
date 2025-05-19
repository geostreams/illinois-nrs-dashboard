/**
 * Formats large numbers with K (thousands), M (millions), or B (billions) suffixes
 * @param value The number to format
 * @param decimals Number of decimal places to show (default: 1)
 * @returns Formatted string representation of the number
 */
export const formatLargeNumber = (value: number, decimals = 1): string => {
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

    return formatted;
};

/**
 * Formats a value with the appropriate unit
 * @param value The number to format
 * @param unit Optional unit string (e.g., '$', '%', 'kg')
 * @param decimals Number of decimal places to show
 * @returns Formatted string with appropriate unit placement
 */
export const formatValueWithUnit = (value: number, unit?: string, decimals = 1): string => {
    // If unit is provided, format accordingly
    if (unit) {
        const formattedNumber = formatLargeNumber(value, decimals);
        // Handle percentage (% suffix)
        if (unit === '%') return `${formattedNumber}%`;

        // Handle currency symbols (prefix)
        if (unit === '$') return `${unit}${formattedNumber}`;

        // Handle other units (with space)
        return `${formattedNumber} ${unit}`;
    }

    // Default formatting with no unit
    return formatLargeNumber(value, decimals);
};

/**
 * Formats a number by adding commas as thousand separators
 * @param value The number to format
 * @param decimals Optional number of decimal places to show (default: 0)
 * @returns Formatted string with commas as thousand separators
 * @example
 * formatNumberWithCommas(1234567) // "1,234,567"
 * formatNumberWithCommas(1234567.89, 2) // "1,234,567.89"
 */
export const formatNumberWithCommas = (value: number, decimals = 0): string => {
    if (!Number.isFinite(value)) return 'N/A';

    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};
