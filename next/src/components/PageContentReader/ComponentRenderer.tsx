import RichContentViewer from '@/components/RichComponentViewer';
import FilledPieChart from '@/components/charts/FilledPieChart';
import StackedBarChart from '@/components/charts/StackedBarChart';
import LineChart from '@/components/charts/LineChart';
import DualChart from '@/components/charts/DualChart';

interface ComponentRendererProps {
    component: any;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
    component,
}) => {
    switch (component.__component) {
        case 'charts.filled-pie-chart':
            return (
                <FilledPieChart
                    chart_data={component.chartData}
                    chart_colors={component.chartColors}
                    heading={component.heading}
                    subheading={component.subheading}
                />
            );
        case 'charts.stacked-bar-chart':
            return (
                <StackedBarChart
                    chartData={component.chartData}
                    chartReferenceLines={component.chartReferenceLines}
                    chartColors={component.chartColors}
                    heading={component.heading}
                    subheading={component.subheading}
                />
            );
        case 'charts.line-chart':
            return (
                <LineChart
                    chartData={component.chartData}
                    chartConfig={component.chartConfig}
                    heading={component.heading}
                    subheading={component.subheading}
                />
            );
        case 'charts.dual-chart':
            return (
                <DualChart
                    left_chart={component.leftChart}
                    right_chart={component.rightChart}
                />
            );
        case 'content.content-block':
            return <RichContentViewer content={component.content} />;
        default:
            return null;
    }
};
