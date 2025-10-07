import RichContentViewer from '@/components/RichComponentViewer';
import DualChart from '@/components/charts/DualChart';
import BaseChart from '@/components/charts/BaseChart';
import Heading from './Headings';
import { BaseContentSection } from './BaseContentSection';
import { FullSpanImage } from './FullSpanImage';
import { ImageWithPDF } from './ImageWithPDF';
import { ChartWithQuote } from './ChartWithQuote';
import { PageDivider } from '@/components/divider';
import InfoBlock from '@/components/InfoBlock';
import { StayInformed } from '@/components/StayInformed';
import Hero from '@/components/Hero';
import DownloadFile from '@/components/DownloadFile';
import DualMap from './DualMap';
import Accordion from '@/components/accordion';

interface ComponentRendererProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: any;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component }) => {
    switch (component.__component) {
        case 'charts.dual-chart':
            return <DualChart left_chart={component.leftChart} right_chart={component.rightChart} />;
        case 'charts.chart-selector':
            return (
                <BaseChart
                    chartType={component.chart.chartType}
                    chartData={component.chart.chartData}
                    miscChartData={component.chart.miscChartData}
                    heading={component.chart.caption}
                    infoText={component.chart.infoText}
                    ariaLabel={component.chart.ariaLabel}
                    dataFile={component.chart.dataFile}
                    width={{ xs: '100%', sm: '100%' }}
                    unit={component.chart.unit}
                    chartImage={component.chart.chartImage}
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
                    hideInSidebar={component.hideInSidebar}
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
                    bordered={component.bordered}
                />
            );
        case 'content.chart-with-quote':
            return (
                <ChartWithQuote chart={component.chart.chart} image={component.image} pullQuote={component.pullQuote} />
            );
        case 'content.page-divider':
            return <PageDivider label={component.label} />;
        case 'content.accordion':
            return <Accordion accordionGroupID={component.accordionGroupID} />;
        case 'home-page.info-block':
            return (
                <InfoBlock
                    photoBlocks={component.photoBlocks}
                    title={component.title}
                    infoText={component.infoText}
                    imageWidth={component.imageWidth}
                    imageHeight={component.imageHeight}
                    paddingTop={component.paddingTop}
                    paddingBottom={component.paddingBottom}
                />
            );
        case 'home-page.stay-informed':
            return <StayInformed title={component.title} subtitle={component.subtitle} links={component.links} />;
        case 'home-page.hero':
            return (
                <Hero
                    buttonText={component.buttonText}
                    buttonURL={component.buttonURL}
                    backgroundImage={component.backgroundImage}
                    heroRightImage={component.heroRightImage}
                    logoSection={component.logoSection}
                    heroText={component.heroText}
                />
            );
        case 'content.download-file':
            return <DownloadFile displayText={component.displayText} fileData={component.file} />;
        case 'content.image-with-pdf':
            return (
                <ImageWithPDF
                    image={component.image}
                    caption={component.caption}
                    pdf={component.pdf}
                    infoText={component.infoText}
                    imageWidth={component.imageWidth}
                />
            );
        case 'content.dual-map':
            return <DualMap leftMap={component.leftMap} rightMap={component.rightMap} />;
        default:
            console.log('Component not found');
            console.log(component);
            return null;
    }
};
