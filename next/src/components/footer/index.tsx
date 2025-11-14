import * as React from 'react';
import Script from 'next/script';
import { Box, Link } from '@mui/material';
import FacebookIcon from '@/assets/icons/facebook.svg';
import Divider from '@mui/material/Divider';
import RichContentViewer from '@/components/RichComponentViewer';

type FooterData = {
    leftCard: string;
    rightCard: string;
    partners: {
        partnerImages: {
            alternativeText: string;
            url: string;
            caption: string;
        }[];
        partnersText: string;
    };
    facebookURL: string;
};

type FooterProps = {
    footerData: FooterData;
};

export const Footer: React.FC<FooterProps> = ({ footerData }) => {
    const cmsBaseUrl = process.env.CMS_API_URL || 'https://strapi.illinois-nrs.ncsa.illinois.edu';

    return (
        <div
            className="footer-container"
            style={{
                position: 'relative',
                bottom: 0,
                width: '100%',
            }}
        >
            <Box
                sx={{
                    '@media print': {
                        display: 'none',
                    },
                }}
            >
                {/*Small height box for a colored line*/}
                <Box sx={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ height: 4, bgcolor: '#2E5EA3', width: '50%' }} />
                    <Box sx={{ height: 4, bgcolor: '#88B147', width: '50%' }} />
                </Box>

                {/* Bottom Section for Logos */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: 1,
                        px: 4,
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: '1200px',
                            width: '100%',
                            mx: 'auto',
                            padding: '24px',
                        }}
                    >
                        <style>{`
                            /* ================================
                               FOOTER LOGO AREA WRAPPER
                               ================================ */
                            .nlrs-footer-logos {
                                width: 100%;
                                max-width: 1152px;
                                margin: 0 auto;
                                box-sizing: border-box;
                            }
                            @media (min-width: 900px) {
                                .nlrs-footer-logos {
                                    height: 90px;
                                }
                            }
                            /* ================================
                               GRID LAYOUT
                               ================================ */
                            .nlrs-footer-logos__grid {
                                display: grid;
                                grid-template-columns: repeat(4, minmax(0, max-content));
                                column-gap: 0;
                                row-gap: 0;
                                align-items: flex-start;
                            }
                            /* ================================
                               LOGO WRAPPERS
                               ================================ */
                            .nlrs-logo {
                                display: flex;
                                align-items: flex-start;
                                justify-content: flex-start;
                            }
                            /* ================================
                               IMAGE SIZING (FLUID)
                               ================================ */
                            .nlrs-logo__img {
                                height: auto;
                                max-height: 71px;
                                display: block;
                            }
                            .nlrs-logo__img--iepa {
                                width: clamp(88px, 15.28vw, 176px);
                            }
                            .nlrs-logo__img--ida {
                                width: clamp(106px, 18.40vw, 212px);
                            }
                            .nlrs-logo__img--uofi {
                                width: clamp(172px, 29.95vw, 345px);
                            }
                            .nlrs-logo__img--ngrrec {
                                width: clamp(113px, 19.62vw, 226px);
                            }
                            /* ================================
                               PER-LOGO MARGINS (FLUID VIA vw)
                               ================================ */
                            .nlrs-logo--iepa {
                                margin-top: clamp(10px, 1.736vw, 20px);
                                margin-right: clamp(16px, 3.082vw, 35.5px);
                                margin-bottom: clamp(4px, 0.694vw, 8px);
                                margin-left: 0;
                                justify-content: flex-start;
                            }
                            .nlrs-logo--ida {
                                margin-top: clamp(12px, 2.135vw, 24.6px);
                                margin-right: clamp(14px, 2.722vw, 31.36px);
                                margin-bottom: clamp(2px, 0.313vw, 3.6px);
                                margin-left: clamp(16px, 3.082vw, 35.5px);
                            }
                            .nlrs-logo--uofi {
                                margin-top: clamp(14px, 2.575vw, 29.6667px);
                                margin-right: clamp(12px, 2.360vw, 27.19px);
                                margin-bottom: clamp(6px, 1.157vw, 13.3333px);
                                margin-left: clamp(14px, 2.722vw, 31.36px);
                            }
                            .nlrs-logo--ngrrec {
                                margin-top: clamp(5px, 0.897vw, 10.33px);
                                margin-right: 0;
                                margin-bottom: clamp(4px, 0.723vw, 8.33px);
                                margin-left: clamp(12px, 2.360vw, 27.19px);
                                justify-content: flex-end;
                            }
                            /* ================================
                               RESPONSIVE BREAKPOINTS
                               ================================ */
                            @media (max-width: 900px) and (min-width: 601px) {
                                .nlrs-footer-logos {
                                    height: auto;
                                }
                                .nlrs-footer-logos__grid {
                                    display: grid;
                                    grid-template-columns: repeat(2, max-content);
                                    justify-content: center;
                                    column-gap: 5.69%;
                                    row-gap: 24px;
                                }
                                .nlrs-logo--iepa,
                                .nlrs-logo--ida,
                                .nlrs-logo--uofi,
                                .nlrs-logo--ngrrec {
                                    margin-left: 0;
                                    margin-right: 0;
                                }
                                .nlrs-logo__img--iepa {
                                    width: 176px;
                                    max-width: 176px;
                                }
                                .nlrs-logo__img--ida {
                                    width: 212px;
                                    max-width: 212px;
                                }
                                .nlrs-logo__img--uofi {
                                    width: 345px;
                                    max-width: 345px;
                                }
                                .nlrs-logo__img--ngrrec {
                                    width: 226px;
                                    max-width: 226px;
                                }
                            }
                            @media (max-width: 600px) {
                                .nlrs-footer-logos__grid {
                                    grid-template-columns: 1fr;
                                }
                                .nlrs-logo--iepa,
                                .nlrs-logo--ida,
                                .nlrs-logo--uofi,
                                .nlrs-logo--ngrrec {
                                    margin: 24px auto;
                                    justify-content: center;
                                }
                                .nlrs-logo__img--iepa {
                                    width: clamp(72px, 40vw, 176px);
                                }
                                .nlrs-logo__img--ida {
                                    width: clamp(80px, 42vw, 212px);
                                }
                                .nlrs-logo__img--uofi {
                                    width: clamp(140px, 70vw, 345px);
                                }
                                .nlrs-logo__img--ngrrec {
                                    width: clamp(90px, 45vw, 226px);
                                }
                            }
                        `}</style>
                        <footer className="nlrs-footer-logos" aria-label="Partner organization logos">
                            <div className="nlrs-footer-logos__grid">
                                {/* Illinois EPA */}
                                <div className="nlrs-logo nlrs-logo--iepa">
                                    <a href="https://epa.illinois.gov/">
                                        <img
                                            src={`${cmsBaseUrl}/uploads/Illinois_EPA_Logo_4f9806ca73.png`}
                                            alt="Illinois Environmental Protection Agency"
                                            className="nlrs-logo__img nlrs-logo__img--iepa"
                                            loading="lazy"
                                        />
                                    </a>
                                </div>

                                {/* Illinois Department of Agriculture */}
                                <div className="nlrs-logo nlrs-logo--ida">
                                    <a href="https://www2.illinois.gov/sites/agr/Pages/default.aspx">
                                        <img
                                            src={`${cmsBaseUrl}/uploads/Illinois_Department_of_Agriculture_Logo_87b259ddfa.png`}
                                            alt="Illinois Department of Agriculture"
                                            className="nlrs-logo__img nlrs-logo__img--ida"
                                            loading="lazy"
                                        />
                                    </a>
                                </div>

                                {/* U of I / Extension / NCSA (image map setup) */}
                                <div className="nlrs-logo nlrs-logo--uofi">
                                    <img
                                        src={`${cmsBaseUrl}/uploads/Uof_I_Extension_NCSA_Logo_7165e6db9c.png`}
                                        alt="University of Illinois Urbana-Champaign, Illinois Extension, and NCSA"
                                        className="nlrs-logo__img nlrs-logo__img--uofi"
                                        useMap="#uofi-partners-map"
                                        loading="lazy"
                                    />
                                    <map name="uofi-partners-map">
                                        <area
                                            shape="rect"
                                            coords="0,1,769,186"
                                            href="https://illinois.edu/"
                                            alt="University of Illinois Urbana-Champaign"
                                            aria-label="University of Illinois Urbana-Champaign"
                                        />
                                        <area
                                            shape="rect"
                                            coords="771,1,1380,95"
                                            href="https://extension.illinois.edu/"
                                            alt="Illinois Extension"
                                            aria-label="Illinois Extension"
                                        />
                                        <area
                                            shape="rect"
                                            coords="771,98,1380,185"
                                            href="https://ncsa.illinois.edu/"
                                            alt="National Center for Supercomputing Applications (NCSA)"
                                            aria-label="National Center for Supercomputing Applications, NCSA"
                                        />
                                    </map>
                                </div>

                                {/* NGRREC */}
                                <div className="nlrs-logo nlrs-logo--ngrrec">
                                    <a href="https://www.ngrrec.org/">
                                        <img
                                            src={`${cmsBaseUrl}/uploads/The_National_Great_Rivers_and_Research_Education_Center_Logo_759d326c69.png`}
                                            alt="National Great Rivers Research and Education Center"
                                            className="nlrs-logo__img nlrs-logo__img--ngrrec"
                                            loading="lazy"
                                        />
                                    </a>
                                </div>
                            </div>
                        </footer>
                        <Script
                            id="image-map-resize"
                            strategy="afterInteractive"
                            dangerouslySetInnerHTML={{
                                __html: `
                                    (function() {
                                        function imageMapResize() {
                                            const maps = document.querySelectorAll('map');
                                            maps.forEach(function(mapEl) {
                                                const mapName = mapEl.getAttribute('name');
                                                if (!mapName) return;

                                                const img = document.querySelector('img[usemap="#' + mapName + '"], img[useMap="#' + mapName + '"]');
                                                if (!img) return;

                                                function resize() {
                                                    if (img.naturalWidth === 0 || img.naturalHeight === 0) return;

                                                    const scale = {
                                                        width: img.width / img.naturalWidth,
                                                        height: img.height / img.naturalHeight
                                                    };

                                                    const padding = {
                                                        width: parseInt(window.getComputedStyle(img, null).getPropertyValue('padding-left'), 10) || 0,
                                                        height: parseInt(window.getComputedStyle(img, null).getPropertyValue('padding-top'), 10) || 0
                                                    };

                                                    const areas = mapEl.querySelectorAll('area');
                                                    areas.forEach(function(area) {
                                                        const coords = area.getAttribute('coords');
                                                        if (!coords) return;

                                                        const coordArray = coords.split(',').map(Number);
                                                        const newCoords = coordArray.map(function(coord, index) {
                                                            const dimension = index % 2 === 0 ? 'width' : 'height';
                                                            return padding[dimension] + Math.floor(coord * scale[dimension]);
                                                        });

                                                        area.setAttribute('coords', newCoords.join(','));
                                                    });
                                                }

                                                if (img.complete) {
                                                    resize();
                                                } else {
                                                    img.addEventListener('load', resize, { once: true });
                                                }

                                                window.addEventListener('resize', resize);
                                                window.addEventListener('focus', resize);
                                            });
                                        }

                                        if (document.readyState === 'loading') {
                                            document.addEventListener('DOMContentLoaded', imageMapResize);
                                        } else {
                                            imageMapResize();
                                        }

                                        window.addEventListener('resize', imageMapResize);
                                        window.addEventListener('load', imageMapResize);
                                    })();
                                `,
                            }}
                        />
                        <Box
                            sx={{
                                mt: 3,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'text.secondary',
                                fontSize: '0.875rem',
                                lineHeight: 1.5,
                                '& a': {
                                    color: '#2E5EA3',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                },
                            }}
                        >
                            <RichContentViewer content={footerData.partners.partnersText} />
                        </Box>
                        <Divider
                            sx={{
                                width: '100%',
                                borderColor: '#B0BEC5',
                                borderWidth: 1,
                                opacity: 1,
                                marginTop: 2,
                                marginBottom: 0,
                            }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: 4,
                                maxWidth: '1200px',
                                width: '100%',
                                mx: 'auto',
                                padding: '24px',
                                position: 'relative',
                            }}
                        >
                            {/* Left Card */}
                            <Box
                                sx={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <RichContentViewer content={footerData.leftCard} />
                                <Link
                                    href={footerData.facebookURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        marginTop: '16px',
                                        '&:hover': {
                                            opacity: 0.8,
                                        },
                                    }}
                                    aria-label="Illinois NRS Facebook Page"
                                >
                                    <FacebookIcon
                                        width={24}
                                        height={24}
                                        fill={'#000'}
                                        style={{ flexShrink: 0 }}
                                        aria-hidden="true"
                                    />
                                </Link>
                            </Box>
                            {/* Right Card */}
                            <Box
                                sx={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    minHeight: '100%',
                                }}
                            >
                                <RichContentViewer content={footerData.rightCard} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};
