interface BaseSectionProps {
    title: string;
    alignment: 'left' | 'center' | 'right';
    width: 'full' | 'half' | 'third';
}

interface TextSectionProps extends BaseSectionProps {
    content: string;
}

interface ImageSectionProps extends BaseSectionProps {
    imageUrl: string;
    altText: string;
}

interface ChartSectionProps extends BaseSectionProps {
    chartType: 'bar' | 'line' | 'pie';
    chartData: any;
    chartColors: Record<string, string>;
}
