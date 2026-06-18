import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * GET /api/preview?url=<path>&secret=<secret>&status=<draft|published>
 *
 * Entry point for Strapi's Preview feature. Strapi calls this route when an
 * editor clicks "Open preview" in the Content Manager.
 *
 * Validates the shared secret, enables/disables Next.js draft mode, and
 * redirects to the requested path so the page renders draft content.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const url = searchParams.get('url') || '/';
    const status = searchParams.get('status');

    if (secret !== process.env.PREVIEW_SECRET) {
        return new Response('Invalid token', { status: 401 });
    }

    if (!url.startsWith('/') || url.startsWith('//')) {
        return new Response('Invalid url', { status: 400 });
    }

    const draft = await draftMode();
    if (status === 'published') {
        draft.disable();
    } else {
        draft.enable();
    }

    redirect(url);
}
