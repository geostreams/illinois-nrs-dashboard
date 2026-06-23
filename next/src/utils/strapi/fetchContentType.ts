import { draftMode, headers } from 'next/headers';

/**
 * Sourced from https://github.com/strapi/LaunchPad/blob/main/next/lib/strapi/fetchContentType.ts
 * Fetches data for a specified Strapi content type.
 *
 * When Next.js draft mode is active and the request is inside Strapi's preview
 * iframe, appends `status=draft` and an Authorization header so Strapi returns
 * unpublished entries. A stale draft cookie on normal top-level browsing is
 * ignored unless Sec-Fetch-Dest is "iframe".
 *
 * @param contentType - The Strapi plural API ID (e.g. "pages", "home").
 * @param params - Query string parameters to append (without leading "?").
 * @param spreadData - When true, unwraps the first item from the data array.
 */

interface StrapiData {
    id: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface StrapiResponse {
    data: StrapiData | StrapiData[];
}

export function spreadStrapiData(data: StrapiResponse): StrapiData | null {
    if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data[0];
    }
    if (!Array.isArray(data.data)) {
        return data.data;
    }
    return null;
}

export default async function fetchContentType(
    contentType: string,
    params: string | null,
    spreadData?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
    try {
        const { isEnabled: draftModeEnabled } = await draftMode();
        const fetchDest = (await headers()).get('sec-fetch-dest');
        const isDraftMode = draftModeEnabled && fetchDest === 'iframe';

        const url = new URL(`api/${contentType}`, process.env.CMS_URL);

        let query = params ?? '';
        const fetchHeaders: HeadersInit = {};

        if (isDraftMode) {
            query = query ? `${query}&status=draft` : 'status=draft';
            const token = process.env.CMS_READ_ONLY_TOKEN;
            if (!token) {
                throw new Error('CMS_READ_ONLY_TOKEN must be set to fetch draft content when draft mode is enabled.');
            }
            fetchHeaders['Authorization'] = `Bearer ${token}`;
        }

        const fullUrl = query ? `${url.href}?${query}` : url.href;
        const response = await fetch(fullUrl, {
            method: 'GET',
            cache: 'no-store',
            headers: fetchHeaders,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data from Strapi (url=${fullUrl}, status=${response.status})`);
        }
        const jsonData: StrapiResponse = await response.json();
        return spreadData ? spreadStrapiData(jsonData) : jsonData;
    } catch (error) {
        console.error('FetchContentTypeError', error);
        return null;
    }
}

export async function fetchPageSlugs(
    contentType: string,
    pageGroup: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
    try {
        const url = new URL(`api/${contentType}?filters[pageGroup][$eq]=${pageGroup}`, process.env.CMS_URL);

        const response = await fetch(url.href, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data from Strapi (url=${url.toString()}, status=${response.status})`);
        }
        const jsonData: StrapiResponse = await response.json();
        return (jsonData.data as StrapiData[]).map((item) => item.slug);
    } catch (error) {
        console.error('FetchContentTypeError', error);
    }
}

export async function fetchPageGroups(
    contentType: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
    try {
        const url = new URL(`api/${contentType}`, process.env.CMS_URL);

        const response = await fetch(url.href, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data from Strapi (url=${url.toString()}, status=${response.status})`);
        }
        const jsonData: StrapiResponse = await response.json();
        return (jsonData.data as StrapiData[]).map((item) => item.pageGroup);
    } catch (error) {
        console.error('FetchContentTypeError', error);
    }
}
