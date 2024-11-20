//TODO: Need to revise the code here and handle ImageSection component
import { Box } from '@mui/material';
import TextSection from './TextSection';
import ImageSection from './ImageSection';
import ChartSection from './ChartSection';

interface SectionRendererProps {
    sections: any[];
}
const SectionRenderer: React.FC<SectionRendererProps> = ({ sections }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {sections.reduce((rows: any[], section, index) => {
                const commonProps = {
                    title: section.base.title,
                    alignment: section.base.alignment,
                    width: section.base.width
                };

                // If it's a full width section, create a new row
                if (section.base.width === 'full') {
                    rows.push([
                        <Box
                            key={index}
                            sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: 1,
                                // boxShadow: 1,
                                p: 3,
                                width: '100%'
                            }}
                        >
                            {renderSection(section, commonProps)}
                        </Box>
                    ]);
                } else {
                    // Check if we need to start a new row
                    if (!rows.length || rows[rows.length - 1][0].props.sx.width === '100%') {
                        rows.push([]);
                    }

                    // Add section to the current row
                    const currentRow = rows[rows.length - 1];
                    currentRow.push(
                        <Box
                            key={index}
                            sx={{
                                flex: section.base.width === 'half' ? 1 : 1/3,
                                p: 3
                            }}
                        >
                            {renderSection(section, commonProps)}
                        </Box>
                    );
                }

                return rows;
            }, []).map((row, rowIndex) => (
                <Box
                    key={rowIndex}
                    sx={{
                        display: 'flex',
                        backgroundColor: 'background.paper',
                        borderRadius: 1,
                        // boxShadow: 1,
                    }}
                >
                    {row}
                </Box>
            ))}
        </Box>
    );
};

const renderSection = (section: any, commonProps: any) => {
    switch (section.__component) {
        case 'sections.text-section':
            return <TextSection {...commonProps} content={section.content} />;
        case 'sections.chart-section':
            return (
                <ChartSection
                    {...commonProps}
                    chartType={section.chartType}
                    chartData={section.chartData}
                    chartColors={section.chartColors}
                />
            );
        default:
            return null;
    }
};

export default SectionRenderer;
