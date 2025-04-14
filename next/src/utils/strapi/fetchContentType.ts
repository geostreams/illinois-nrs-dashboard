/**
 * Sourced from https://github.com/strapi/LaunchPad/blob/main/next/lib/strapi/fetchContentType.ts
 * Fetches data for a specified Strapi content type.
 *
 * @param {string} contentType - The type of content to fetch from Strapi.
 * @param {string} params - Query parameters to append to the API request.
 * @return {Promise<object>} The fetched data.
 */

interface StrapiData {
    id: number;
    [key: string]: any; // Allow for any additional fields
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
): Promise<any> {
    try {
        // Construct the full URL for the API request
        const url = new URL(`api/${contentType}`, process.env.CMS_API_URL);

        let response = null;
        if (params) {
            // Perform the fetch request with the provided query parameters
            response = await fetch(`${url.href}?${params}`, {
                method: 'GET',
                cache: 'no-store',
            });
        } else {
            response = await fetch(`${url.href}`, {
                method: 'GET',
                cache: 'no-store',
            });
        }

        if (!response.ok) {
            throw new Error(
                `Failed to fetch data from Strapi (url=${url.toString()}, status=${response.status})`
            );
        }
        const jsonData: StrapiResponse = await response.json();
        return spreadData ? spreadStrapiData(jsonData) : jsonData;
    } catch (error) {
        // Log any errors that occur during the fetch process
        console.error('FetchContentTypeError', error);
        return null;
    }
}

export async function fetchPageSlugs(
    contentType: string,
    pageGroup: string
): Promise<any> {
    try {
        // Construct the full URL for the API request
        const url = new URL(
            `api/${contentType}?filters[pageGroup][$eq]=${pageGroup}`,
            process.env.CMS_API_URL
        );

        // Perform the fetch request
        const response = await fetch(`${url.href}`, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch data from Strapi (url=${url.toString()}, status=${response.status})`
            );
        }
        const jsonData: StrapiResponse = await response.json();
        return jsonData.data.map((item: StrapiData) => item.slug);
    } catch (error) {
        // Log any errors that occur during the fetch process
        console.error('FetchContentTypeError', error);
    }
}
