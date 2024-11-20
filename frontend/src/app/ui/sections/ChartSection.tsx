import { Box, Typography } from '@mui/material';
import LineChart from "@/app/ui/charts/LineChart";
import StackedBarChart from "@/app/ui/charts/StackedBarChart";
import FilledPieChart from "@/app/ui/charts/FilledPieChart";


const ChartSection: React.FC<ChartSectionProps> = ({
    title,
    alignment,
    width,
    chartType,
    chartData,
    chartColors
}) => {
    // Determine chart dimensions based on width prop
    const getChartDimensions = (widthType: string) => {
        switch(widthType) {
        case 'full':
            return { width: '100%', height: 500 };
        case 'half':
            return { width: '100%', height: 400 };
        case 'third':
            return { width: '100%', height: 300 };
        default:
            return { width: '100%', height: 400 };
        }
    };

    const { width: chartWidth, height: chartHeight } = getChartDimensions(width);

    const renderChart = () => {
        const commonProps = {
            width: chartWidth,
            height: chartHeight,
            fontSize: 12,
        };

        switch (chartType) {
        case 'pie':
            return (
                <FilledPieChart
                    {...commonProps}
                    data={chartData}
                    colors={chartColors}
                    legend
                />
            );

        case 'line':
            return (
                <LineChart
                    {...commonProps}
                    data={chartData}
                    lines={Object.entries(chartColors).map(([key, color]) => ({
                        dataKey: key,
                        color
                    }))}
                    grid
                    legend
                />
            );

        case 'bar':
            return (
                <StackedBarChart
                    {...commonProps}
                    data={chartData}
                    barColors={chartColors}
                    legend
                />
            );

        default:
            return null;
        }
    };

    return (
        <>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ color: 'primary.main' }}
            >
                {title}
            </Typography>
            {renderChart()}
        </>
    );
};

export default ChartSection;
