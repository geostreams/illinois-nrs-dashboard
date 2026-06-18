// Wires up the preview feature for the CMS Pages and Home page
const getPreviewPathname = (uid: string, { document }: { document: Record<string, unknown> | null }): string | null => {
  switch (uid) {
    case 'api::home.home':
      return '/';
    case 'api::page.page': {
      // Creates the URL for the page based on the slug and page group
      const slug = document?.slug as string | undefined;
      const pageGroup = document?.pageGroup as string | undefined;
      if (!slug || !pageGroup) return null;
      return `/${pageGroup}/${slug}`;
    }
    default:
      return null;
  }
};

export default ({ env }) => {
  const clientUrl = env('CLIENT_URL');
  const previewSecret = env('PREVIEW_SECRET');

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: clientUrl,
        async handler(uid: string, { documentId, status }: { documentId: string; status: string }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const document = await strapi.documents(uid as any).findOne({ documentId });
          const pathname = getPreviewPathname(uid, { document });
          if (!pathname) return null;
          const params = new URLSearchParams({ url: pathname, secret: previewSecret, status });
          return `${clientUrl}/api/preview?${params}`;
        },
      },
    },
  };
};
