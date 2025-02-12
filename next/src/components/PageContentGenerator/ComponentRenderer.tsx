import RichContentViewer from '@/components/RichComponentViewer';
import DualChart from '@/components/charts/DualChart';
import BaseChart from '@/components/charts/BaseChart';
import Heading from './Headings';
import { BaseContentSection } from './BaseContentSection';
import { FullSpanImage } from './FullSpanImage';
interface ComponentRendererProps {
    component: any;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
    component,
}) => {
    switch (component.__component) {
        case 'charts.filled-pie-chart':
            return (
                <BaseChart
                    chartType="filled_pie"
                    chartData={component.chartData}
                    chartColors={component.chartColors}
                    heading={component.heading}
                    subheading={component.subheading}
                />
            );
        case 'charts.stacked-bar-chart':
            return (
                <BaseChart
                    chartType="stacked_bar"
                    chartData={component.chartData}
                    chartReferenceLines={component.chartReferenceLines}
                    chartColors={component.chartColors}
                    heading={component.heading}
                    subheading={component.subheading}
                />
            );
        case 'charts.line-chart':
            return (
                <BaseChart
                    chartType="line"
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
        case 'charts.chart-selector':
            return (
                <BaseChart
                    chartType={component.chartType}
                    chartData={component.chartData}
                    chartColors={component.chartColors}
                    heading={component.heading}
                    subheading={component.subheading}
                    altText={component.altText}
                />
            );
        case 'content.content-block':
            return <RichContentViewer content={component.content} />;
        case 'content.heading':
            return (
                <Heading
                    headingText={component.headingText}
                    headingColor={component.headingColor}
                    headingType={component.headingType}
                    headingIcon={component.headingIcon}
                />
            );
        case 'content.base-content-section':
            return (
                <BaseContentSection
                    textContent={component.textContent}
                    image={component.image}
                    pullQuote={component.pullQuote}
                />
            );
        case 'content.full-span-image':
            return (
                <FullSpanImage
                    image={component.image}
                    caption={component.caption}
                />
            );
        default:
            console.log('Component not found');
            console.log(component);
            return null;
    }
};
