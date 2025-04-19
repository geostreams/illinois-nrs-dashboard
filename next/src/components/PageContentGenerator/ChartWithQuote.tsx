import Box from '@mui/material/Box';
import BaseChart from '../charts/BaseChart';
import Image from 'next/image';
import PullQuote from './PullQuote';

interface ChartWithQuoteProps {
    chart: {
        chartType: string;
        caption?: string;
        chartData: any;
        chartColors?: Record<string, string>;
        miscChartData: any;
        width?: string | number;
        height?: number;
        infoText?: string;
        ariaLabel?: string;
        dataFile?: {
            url: string;
            name: string;
        };
    };
    baseImageUrl?: string;
    image?: {
        url: string;
        alternativeText?: string | null;
    };
    pullQuote?: {
        quoteText?: string;
    };
}

export const ChartWithQuote: React.FC<ChartWithQuoteProps> = ({
    chart,
    baseImageUrl = process.env.CMS_API_URL,
    image,
    pullQuote,
}) => {
    const imageUrl = image?.url ? `${baseImageUrl}${image.url}` : '';

    return (
        <Box
            sx={{
                display: 'grid',
                maxWidth: '100%',
                my: 0,
                marginRight: 0,
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: '3fr 2fr',
                    md: '3fr 2fr',
                },
                gap: 3,
                alignItems: 'center',
            }}
        >
            {/* Left column - 60% */}
            <Box>
                <BaseChart
                    chartType={chart.chartType}
                    chartData={chart.chartData}
                    chartColors={chart.chartColors}
                    miscChartData={chart.miscChartData}
                    heading={chart.caption}
                    infoText={chart.infoText}
                    ariaLabel={chart.ariaLabel}
                    dataFile={chart?.dataFile}
                    width={{ xs: '100%', sm: '100%' }}
                    aspectRatio={'100%'}
                />
            </Box>

            {/* Right column - 40% */}
            {/* Conditionally render the image and pull quote */}
            {(imageUrl || pullQuote) && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // Centers vertically
                        alignItems: 'center', // Centers horizontally
                        gap: 2,
                        textAlign: 'center',
                        height: '100%',
                    }}
                >
                    {/* Pull Quote */}
                    {pullQuote && (
                        <PullQuote quoteText={pullQuote.quoteText || ''} />
                    )}
                    {/* Image Container */}
                    {imageUrl && (
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '400px',
                                height: 'auto',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                position: 'relative',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '70%',
                                    aspectRatio: '1/1',
                                }}
                            >
                                <Image
                                    src={imageUrl}
                                    alt={
                                        image?.alternativeText ||
                                        'Content image'
                                    }
                                    fill
                                    sizes="(max-width: 768px) 100vw, 320px"
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                    priority={false}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};
