'use client';
import { Card, CardContent, Typography, Box, Container } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function InteractiveMapsPage() {
    const { slug } = useParams();
    const tableauRef = useRef<HTMLDivElement>(null);

    let formattedTitle = '';

    if (slug) {
        formattedTitle = String(slug)
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Simply paste the entire Tableau embed code here (including the <script> tag)
    const tableau_dashboard_dict: Record<string, string> = {
        'point-source': `<div class='tableauPlaceholder' id='viz1761597481369' style='position: relative'><noscript><a href='#'><img alt=' ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Po&#47;PointSourceDashboardv4&#47;HUC8MajorMunicipalLoads&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='PointSourceDashboardv4&#47;HUC8MajorMunicipalLoads' /><param name='tabs' value='yes' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Po&#47;PointSourceDashboardv4&#47;HUC8MajorMunicipalLoads&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en-US' /><param name='filter' value='publish=yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1761597481369');                    var vizElement = divElement.getElementsByTagName('object')[0];                    if ( divElement.offsetWidth > 800 ) { vizElement.style.width='1000px';vizElement.style.height='850px';} else if ( divElement.offsetWidth > 500 ) { vizElement.style.width='1000px';vizElement.style.height='850px';} else { vizElement.style.width='100%';vizElement.style.height='1950px';}                     var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>`,
    };
    const isTableauDashboard = slug && tableau_dashboard_dict[String(slug)];

    useEffect(() => {
        if (isTableauDashboard && tableauRef.current) {
            const embedCode = tableau_dashboard_dict[String(slug)!];

            // Clear any existing content
            tableauRef.current.innerHTML = '';

            // Insert the entire Tableau embed code (HTML + script)
            tableauRef.current.innerHTML = embedCode;

            // Execute any script tags that were just inserted
            const scripts = tableauRef.current.getElementsByTagName('script');
            Array.from(scripts).forEach((script) => {
                const newScript = document.createElement('script');
                newScript.type = 'text/javascript';
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.text = script.text;
                }
                script.parentNode?.replaceChild(newScript, script);
            });
        }
    }, [isTableauDashboard, slug]);

    if (isTableauDashboard) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    boxSizing: 'border-box',
                }}
            >
                <style jsx>{`
                    .tableau-container {
                        overflow: visible !important;
                    }
                    .tableau-container .tableauPlaceholder {
                        display: block !important;
                        overflow: visible !important;
                    }
                    .tableau-container .tableauViz {
                        overflow: visible !important;
                    }
                `}</style>
                <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
                    {formattedTitle} Interactive Maps
                </Typography>
                <div
                    ref={tableauRef}
                    className="tableau-container"
                    style={{
                        width: '1000px',
                        minHeight: '850px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        overflow: 'visible',
                    }}
                />
            </div>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    py: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <Card sx={{ maxWidth: 600, width: '100%' }}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 4,
                        }}
                    >
                        <Typography variant="h3" component="h1" gutterBottom>
                            {formattedTitle} Interactive Maps
                        </Typography>
                        <ConstructionIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
                        <Typography variant="h4" component="h2" gutterBottom>
                            Under Construction
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            This feature is currently under construction. Please check back later for updates.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
