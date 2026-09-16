/**
 * Renders one or more JSON-LD payloads as script tags.
 * Payloads are produced server-side by lib/seo/jsonld.ts builders,
 * never from unsanitized user input.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
