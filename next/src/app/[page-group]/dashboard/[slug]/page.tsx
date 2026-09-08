'use client';
import { Card, CardContent, Typography, Box, Container } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

function injectHtmlWithScripts(html: string, container: HTMLElement) {
    container.innerHTML = '';

    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Append non-script nodes first
    const fragment = document.createDocumentFragment();
    Array.from(doc.body.childNodes).forEach((node) => {
        if (node.nodeName.toLowerCase() !== 'script') {
            fragment.appendChild(node);
        }
    });
    container.appendChild(fragment);

    // Then execute scripts in order
    const scripts = Array.from(doc.body.querySelectorAll('script'));
    scripts.forEach((oldScript) => {
        const src = oldScript.getAttribute('src');
        if (src && document.querySelector(`script[src="${src}"]`)) {
            return;
        }

        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.textContent) newScript.text = oldScript.textContent;
        container.appendChild(newScript);
    });
}

// Simply paste the entire Tableau embed code here (including the <script> tag)
const tableau_dashboard_dict: Record<string, string> = {
    'point-source': `<div class='tableauPlaceholder' id='viz1765217148659' style='position: relative'><noscript><a href='#'><img alt=' ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Po&#47;PointSourceDashboardv5&#47;About&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='PointSourceDashboardv5&#47;About' /><param name='tabs' value='yes' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Po&#47;PointSourceDashboardv5&#47;About&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en-US' /><param name='filter' value='publish=yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1765217148659');                    var vizElement = divElement.getElementsByTagName('object')[0];                    if ( divElement.offsetWidth > 800 ) { vizElement.style.width='1000px';vizElement.style.height='850px';} else if ( divElement.offsetWidth > 500 ) { vizElement.style.width='1000px';vizElement.style.height='850px';} else { vizElement.style.width='100%';vizElement.style.height='1950px';}                     var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>`,
    // agriculture: `<div class='tableauPlaceholder' id='viz1773782307227' style='position: relative'><noscript><a href='#'><img alt='Agriculture Dashboard ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Ag&#47;AgDashboard&#47;AgricultureDashboard&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='AgDashboard&#47;AgricultureDashboard' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Ag&#47;AgDashboard&#47;AgricultureDashboard&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en-US' /><param name='filter' value='publish=yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1773782307227');                    var vizElement = divElement.getElementsByTagName('object')[0];                    vizElement.style.width='1050px';vizElement.style.height='1027px';                    var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>`,
};

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

    const isTableauDashboard = slug && tableau_dashboard_dict[String(slug)];

    useEffect(() => {
        if (!isTableauDashboard || !tableauRef.current) return;

        injectHtmlWithScripts(tableau_dashboard_dict[String(slug)], tableauRef.current);

        return () => {
            if (tableauRef.current) tableauRef.current.innerHTML = '';
        };
    }, [slug]);

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
                <Typography
                    variant="body1"
                    component="p"
                    sx={{
                        mb: 3,
                        textAlign: 'center',
                        display: { xs: 'block', sm: 'block', md: 'none' },
                    }}
                >
                    (Best viewed on desktop)
                </Typography>
                <div
                    ref={tableauRef}
                    className="tableau-container"
                    style={{
                        maxWidth: '1000px',
                        width: '100%',
                        minHeight: '850px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        overflow: 'visible',
                    }}
                />
                {/* Feedback text */}
                <Typography variant="body1" component="p" sx={{ textAlign: 'center', mt: 2 }}>
                    If you have feedback or questions about the data or interactive map,{' '}
                    <a
                        href="mailto:NLRS@illinois.edu?subject=NLRS%20Portal%20interactive%20map%20comments"
                        style={{ color: '#1976d2', textDecoration: 'underline' }}
                    >
                        please submit your comments
                    </a>
                    .
                </Typography>
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
