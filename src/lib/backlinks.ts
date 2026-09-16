export function buildTrackedUrl(
  destinationUrl: string,
  utm: { source?: string; medium?: string; campaign?: string },
): string {
  try {
    const url = new URL(destinationUrl);
    if (utm.source) url.searchParams.set("utm_source", utm.source);
    if (utm.medium) url.searchParams.set("utm_medium", utm.medium);
    if (utm.campaign) url.searchParams.set("utm_campaign", utm.campaign);
    return url.toString();
  } catch {
    return destinationUrl;
  }
}
