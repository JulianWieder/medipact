import UnlocalizedLink from "next/link";
import { Link as LocalizedLink } from "@/i18n/navigation";
import { isMigratedLocalePath } from "@/i18n/routing";
import { JsonLd } from "@/app/components/JsonLd";

/**
 * Only paths actually migrated into app/[locale]/ (currently "/" and
 * "/konflikte/trennung", see i18n/routing.ts) may use the locale-aware Link
 * — using it elsewhere caused the "/de/en/methode" prefix-loop bug
 * documented in Header.tsx. Mirrors Header.tsx's NavLink helper.
 */
function BreadcrumbLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (isMigratedLocalePath(href)) {
    return (
      <LocalizedLink href={href} className={className}>
        {children}
      </LocalizedLink>
    );
  }
  return (
    <UnlocalizedLink href={href} className={className}>
      {children}
    </UnlocalizedLink>
  );
}

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

const BASE_URL = "https://medipact.de";

/**
 * Visible breadcrumb trail + matching BreadcrumbList JSON-LD.
 *
 * Purpose: give both users and crawlers an explicit path back to parent
 * pages (Startseite → Übersicht → aktuelle Seite), so no marketing or case
 * study page is a dead end reachable only via the header nav. "Home" is
 * implicit and always prepended; pass the remaining trail, with the final
 * (current) item omitting `href`.
 *
 * `variant="dark"` is for pages whose top section sits on a dark hero image
 * (ImagePinHero); `variant="light"` for plain light-background heroes.
 */
export function Breadcrumbs({
  items,
  variant = "dark",
}: {
  items: BreadcrumbItem[];
  variant?: "dark" | "light";
}) {
  const fullTrail: BreadcrumbItem[] = [{ label: "Start", href: "/" }, ...items];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullTrail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
    })),
  };

  const linkClass =
    variant === "dark"
      ? "text-neutral-300 hover:text-white"
      : "text-neutral-500 hover:text-neutral-900";
  const currentClass = variant === "dark" ? "text-white" : "text-neutral-900";
  const separatorClass = variant === "dark" ? "text-neutral-500" : "text-neutral-300";

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {fullTrail.map((item, index) => {
            const isLast = index === fullTrail.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {index > 0 && <span className={separatorClass}>/</span>}
                {isLast || !item.href ? (
                  <span aria-current="page" className={`font-medium ${currentClass}`}>
                    {item.label}
                  </span>
                ) : (
                  <BreadcrumbLink href={item.href} className={`transition ${linkClass}`}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
