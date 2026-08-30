function firstHost(value: string | null): string | undefined {
  const host = value?.split(',')[0]?.trim();
  return host || undefined;
}

function hostnameOf(host: string): string {
  return host.split(':')[0]?.toLowerCase() ?? '';
}

function isLoopbackHost(host: string): boolean {
  const hostname = hostnameOf(host);
  return (
    hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
  );
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

function configuredPublicOrigin(
  configuredSiteUrl: string | null | undefined,
): string | undefined {
  const trimmed = configuredSiteUrl?.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    if (isLoopbackHost(url.host)) return undefined;
    return stripTrailingSlash(url.origin);
  } catch {
    return undefined;
  }
}

export function publicOriginFromRequest(
  request: Request,
  configuredSiteUrl?: string | null,
  options: { hosted?: boolean } = {},
): string {
  const configured = configuredPublicOrigin(configuredSiteUrl);
  const forwardedHost = firstHost(request.headers.get('x-forwarded-host'));
  const hostHeader = firstHost(request.headers.get('host'));
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const requestUrl = new URL(request.url);
  const hosted =
    options.hosted ??
    (Boolean(process.env.VERCEL) || Boolean(forwardedProto && forwardedHost));

  if (forwardedHost && !isLoopbackHost(forwardedHost)) {
    return `${forwardedProto ?? 'https'}://${forwardedHost}`;
  }

  if (hostHeader && !isLoopbackHost(hostHeader)) {
    return `${forwardedProto ?? requestUrl.protocol.replace(':', '')}://${hostHeader}`;
  }

  // Vercel/serverless often exposes request.url as localhost. Never put that
  // in a magic-link redirect when a public SITE_URL is configured.
  if (hosted && configured) {
    return configured;
  }

  if (hostHeader) {
    return `${forwardedProto ?? requestUrl.protocol.replace(':', '')}://${hostHeader}`;
  }

  if (configured) return configured;
  return stripTrailingSlash(requestUrl.origin);
}
