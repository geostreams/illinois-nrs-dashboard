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
    const cmsBaseUrl = process.env.CMS_API_URL || 'https://strapi.illinois-nlrs.ncsa.illinois.edu';

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
                <Box
                    sx={{
                        height: 16,
                        width: '100%',
                        background: 'linear-gradient(to right, #7bc144 0%, #3391b1 50%, #385874 100%)',
                    }}
                />

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
                            /* Old medium screen breakpoint (900px). New medium screen breakpoint (1152px). Keeping this just in case. */
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
                               - widths and margins all scale
                                 from 1152px
                               ================================ */
                            .nlrs-logo__img {
                                height: auto;
                                max-height: 71px;
                                display: block;
                            }
                            /* Widths scale with viewport, but are clamped so they don't get weird */
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
                            /* IEPA
                               original: 20px 35.5px 8px 0 */
                            .nlrs-logo--iepa {
                                margin-top:    clamp(10px, 1.736vw, 20px);
                                margin-right:  clamp(16px, 3.082vw, 35.5px);
                                margin-bottom: clamp(4px,  0.694vw, 8px);
                                margin-left:   0;
                                justify-content: flex-start;
                            }
                            /* Illinois Department of Agriculture
                               original: 24.6px 31.36px 3.6px 35.5px */
                            .nlrs-logo--ida {
                                margin-top:    clamp(12px, 2.135vw, 24.6px);
                                margin-right:  clamp(14px, 2.722vw, 31.36px);
                                margin-bottom: clamp(2px,  0.313vw, 3.6px);
                                margin-left:   clamp(16px, 3.082vw, 35.5px);
                            }
                            /* U of I / Extension / NCSA
                               original: 29.6667px 27.19px 13.3333px 31.36px */
                            .nlrs-logo--uofi {
                                margin-top:    clamp(14px, 2.575vw, 29.6667px);
                                margin-right:  clamp(12px, 2.360vw, 27.19px);
                                margin-bottom: clamp(6px,  1.157vw, 13.3333px);
                                margin-left:   clamp(14px, 2.722vw, 31.36px);
                            }
                            /* National Great Rivers (NGRREC)
                               original: 10.33px 0 8.33px 27.19px */
                            .nlrs-logo--ngrrec {
                                margin-top:    clamp(5px,  0.897vw, 10.33px);
                                margin-right:  0;
                                margin-bottom: clamp(4px,  0.723vw, 8.33px);
                                margin-left:   clamp(12px, 2.360vw, 27.19px);
                                justify-content: flex-end;
                            }
                            /* ================================
                               RESPONSIVE BREAKPOINTS
                               ================================ */
                            /* Medium screens – 2 logos per row */
                            @media (max-width: 1152px) and (min-width: 601px) {
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
                            /* Small screens – 1 logo per row */
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
                            /* ================================
                               IMAGE MAP FALLBACK OVERLAY
                               ================================ */
                            .map-container {
                                position: relative;
                            }
                            /* Base fallback link style */
                            .map-fallback {
                                position: absolute;
                                top: 0;
                                left: 0;
                                height: 100%;
                                width: 0;              /* overridden per region */
                                pointer-events: none;  /* JS will turn this on only if map breaks */
                                display: block;
                            }
                            /* U of I: left ~55.7% of the image, full height */
                            .map-fallback.uofi {
                                left: 0;
                                width: 55.7%;
                            }
                            /* Right column (Extension + NCSA) width ~44.3% */
                            .map-fallback.extension,
                            .map-fallback.ncsa {
                                left: 55.7%;
                                width: 44.3%;
                            }
                            /* Extension: top half of right column */
                            .map-fallback.extension {
                                top: 0;
                                height: 51%;   /* ~95/186 */
                            }
                            /* NCSA: bottom half of right column */
                            .map-fallback.ncsa {
                                top: 51%;
                                height: 49%;   /* rest of the height */
                            }
                        `}</style>
                        <footer className="nlrs-footer-logos" aria-label="Partner organization logos">
                            <div className="nlrs-footer-logos__grid">
                                {/* Illinois EPA */}
                                <div className="nlrs-logo nlrs-logo--iepa">
                                    <a href="https://epa.illinois.gov/" target="_blank" rel="noopener noreferrer">
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
                                    <a
                                        href="https://www2.illinois.gov/sites/agr/Pages/default.aspx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={`${cmsBaseUrl}/uploads/Illinois_Department_of_Agriculture_Logo_87b259ddfa.png`}
                                            alt="Illinois Department of Agriculture"
                                            className="nlrs-logo__img nlrs-logo__img--ida"
                                            loading="lazy"
                                        />
                                    </a>
                                </div>

                                {/* U of I / Extension / NCSA (image map + fallback) */}
                                <div className="nlrs-logo nlrs-logo--uofi map-container">
                                    <img
                                        src={`${cmsBaseUrl}/uploads/Uof_I_Extension_NCSA_Logo_7165e6db9c.png`}
                                        alt="University of Illinois Urbana-Champaign, Illinois Extension, and NCSA"
                                        className="nlrs-logo__img nlrs-logo__img--uofi"
                                        useMap="#uofi-partners-map"
                                    />
                                    <map name="uofi-partners-map">
                                        {/* U of I */}
                                        <area
                                            shape="rect"
                                            coords="0,1,769,186"
                                            href="https://illinois.edu/"
                                            alt="University of Illinois Urbana-Champaign"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                        {/* Extension */}
                                        <area
                                            shape="rect"
                                            coords="771,1,1380,95"
                                            href="https://extension.illinois.edu/"
                                            alt="Illinois Extension"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                        {/* NCSA */}
                                        <area
                                            shape="rect"
                                            coords="771,98,1380,185"
                                            href="https://ncsa.illinois.edu/"
                                            alt="National Center for Supercomputing Applications (NCSA)"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    </map>
                                    {/* FALLBACK OVERLAY LINKS (only active if map breaks) */}
                                    <a
                                        className="map-fallback uofi"
                                        href="https://illinois.edu/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-hidden="true"
                                        tabIndex={-1}
                                    />
                                    <a
                                        className="map-fallback extension"
                                        href="https://extension.illinois.edu/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-hidden="true"
                                        tabIndex={-1}
                                    />
                                    <a
                                        className="map-fallback ncsa"
                                        href="https://ncsa.illinois.edu/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-hidden="true"
                                        tabIndex={-1}
                                    />
                                </div>

                                {/* NGRREC */}
                                <div className="nlrs-logo nlrs-logo--ngrrec">
                                    <a href="https://www.ngrrec.org/" target="_blank" rel="noopener noreferrer">
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
                                    /*! Image Map Resizer (imageMapResizer.min.js ) - v1.0.10 - 2019-04-10
                                     *  Desc: Resize HTML imageMap to scaled image.
                                     *  Copyright: (c) 2019 David J. Bradshaw - dave@bradshaw.net
                                     *  License: MIT
                                     */
                                    !function(){"use strict";function r(){function e(){var r={width:u.width/u.naturalWidth,height:u.height/u.naturalHeight},a={width:parseInt(window.getComputedStyle(u,null).getPropertyValue("padding-left"),10),height:parseInt(window.getComputedStyle(u,null).getPropertyValue("padding-top"),10)};i.forEach(function(e,t){var n=0;o[t].coords=e.split(",").map(function(e){var t=1==(n=1-n)?"width":"height";return a[t]+Math.floor(Number(e)*r[t])}).join(",")})}function t(e){return e.coords.replace(/ *, */g,",").replace(/ +/g,",")}function n(){clearTimeout(d),d=setTimeout(e,250)}function r(e){return document.querySelector('img[usemap="'+e+'"]')}var a=this,o=null,i=null,u=null,d=null;"function"!=typeof a._resize?(o=a.getElementsByTagName("area"),i=Array.prototype.map.call(o,t),u=r("#"+a.name)||r(a.name),a._resize=e,u.addEventListener("load",e,!1),window.addEventListener("focus",e,!1),window.addEventListener("resize",n,!1),window.addEventListener("readystatechange",e,!1),document.addEventListener("fullscreenchange",e,!1),u.width===u.naturalWidth&&u.height===u.naturalHeight||e()):a._resize()}function e(){function t(e){e&&(!function(e){if(!e.tagName)throw new TypeError("Object is not a valid DOM element");if("MAP"!==e.tagName.toUpperCase())throw new TypeError("Expected <MAP> tag, found <"+e.tagName+">.")}(e),r.call(e),n.push(e))}var n;return function(e){switch(n=[],typeof e){case"undefined":case"string":Array.prototype.forEach.call(document.querySelectorAll(e||"map"),t);break;case"object":t(e);break;default:throw new TypeError("Unexpected data type ("+typeof e+").")}return n}}"function"==typeof define&&define.amd?define([],e):"object"==typeof module&&"object"==typeof module.exports?module.exports=e():window.imageMapResize=e(),"jQuery"in window&&(window.jQuery.fn.imageMapResize=function(){return this.filter("map").each(r).end()})}();

                                    window.addEventListener('DOMContentLoaded', function () {
                                        // This will auto-detect all <map> elements and rescale their <area> coords
                                        if (typeof imageMapResize === 'function') {
                                            imageMapResize();
                                        }
                                    });

                                    // Safely (re)run imageMapResize only when images are measurable
                                    function recalcImageMapsWhenReady() {
                                        if (typeof imageMapResize !== 'function') return;

                                        const imgs = document.querySelectorAll('img[usemap]');
                                        if (!imgs.length) return;

                                        let allReady = true;

                                        imgs.forEach(img => {
                                            if (!img.complete || !img.naturalWidth || !img.width) {
                                                allReady = false;
                                            }
                                        });

                                        if (!allReady) {
                                            setTimeout(recalcImageMapsWhenReady, 200);
                                            return;
                                        }

                                        imageMapResize();
                                        updateFallbackLinks();
                                    }

                                    function mapIsBroken() {
                                        const first = document.querySelector('map[name="uofi-partners-map"] area');
                                        if (!first) return false;

                                        const coords = first.coords.split(',').map(Number);

                                        // If at least one coordinate is large, we assume the map is OK
                                        const hasLarge = coords.some(n => !isNaN(n) && n >= 20);

                                        console.log('[uofi map] coords:', coords, 'hasLarge:', hasLarge);

                                        return !hasLarge;
                                    }

                                    function updateFallbackLinks() {
                                        const fallbackLinks = document.querySelectorAll('.map-fallback');
                                        const broken = mapIsBroken();

                                        console.log('[uofi map] broken =', broken);

                                        fallbackLinks.forEach(a => {
                                            a.style.pointerEvents = broken ? 'auto' : 'none';
                                        });
                                    }

                                    // Debug: log which element actually received the click
                                    function attachDebugClickLogging() {
                                        document
                                            .querySelectorAll('map[name="uofi-partners-map"] area')
                                            .forEach(area => {
                                                area.addEventListener('click', () => {
                                                    console.log('[click] AREA →', area.href);
                                                });
                                            });

                                        document
                                            .querySelectorAll('.map-fallback')
                                            .forEach(a => {
                                                a.addEventListener('click', () => {
                                                    console.log('[click] FALLBACK →', a.href, 'class=', a.className);
                                                });
                                            });
                                    }

                                    window.addEventListener('DOMContentLoaded', () => {
                                        recalcImageMapsWhenReady();
                                        attachDebugClickLogging();
                                    });

                                    window.addEventListener('load', () => {
                                        setTimeout(recalcImageMapsWhenReady, 300);
                                    });

                                    window.addEventListener('resize', () => {
                                        setTimeout(recalcImageMapsWhenReady, 200);
                                    });

                                    document.addEventListener('visibilitychange', () => {
                                        if (!document.hidden) {
                                            setTimeout(recalcImageMapsWhenReady, 200);
                                        }
                                    });
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
