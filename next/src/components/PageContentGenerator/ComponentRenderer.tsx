import RichContentViewer from '@/components/RichComponentViewer';
import DualChart from '@/components/charts/DualChart';
import BaseChart from '@/components/charts/BaseChart';
import Heading from './Headings';
import { BaseContentSection } from './BaseContentSection';
import { FullSpanImage } from './FullSpanImage';
import { ChartWithQuote } from './ChartWithQuote';
import { PageDivider } from '@/components/divider';
import InfoBlock from '@/components/InfoBlock';

interface ComponentRendererProps {
    component: any;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
    component,
}) => {
    switch (component.__component) {
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
                    chartType={component.chart.chartType}
                    chartData={component.chart.chartData}
                    chartColors={component.chart.chartColors}
                    miscChartData={component.chart.miscChartData}
                    heading={component.chart.caption}
                    altText={component.chart.altText}
                    dataFile={component.chart.dataFile3}
                    width={{ xs: '100%', sm: '75%' }}
                    unit={component.chart.unit}
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
                    quotePlacement={component.quotePlacement}
                    borderedTextBox={component.borderedTextBox}
                />
            );
        case 'content.full-span-image':
            return (
                <FullSpanImage
                    image={component.image}
                    caption={component.caption}
                    imageWidth={component.imageWidth}
                />
            );
        case 'content.chart-with-quote':
            return (
                <ChartWithQuote
                    chart={component.chart.chart}
                    image={component.image}
                    pullQuote={component.pullQuote}
                />
            );
        case 'content.page-divider':
            return <PageDivider label={component.label} />;
        case 'home-page.info-block':
            return (
                <InfoBlock
                    photoBlocks={component.photoBlocks}
                    title={component.title}
                    infoText={component.infoText}
                />
            );
        default:
            console.log('Component not found');
            console.log(component);
            return null;
    }
};
