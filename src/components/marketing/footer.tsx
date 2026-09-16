import Link from "next/link";
import { Logo } from "./logo";
import { XIcon, LinkedInIcon, YouTubeIcon } from "./social-icons";
import { CookieSettingsLink } from "./cookie-settings-link";
import { FooterNewsletter } from "./footer-newsletter";
import { footerNav } from "@/lib/nav";
import { siteConfig } from "@/lib/seo/config";

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-eyebrow">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              {siteConfig.name} by {siteConfig.company}
            </p>
            <p className="mt-1 max-w-[26ch] text-sm text-muted-foreground">{siteConfig.tagline}</p>
          </div>
          <FooterColumn title="Product" links={footerNav.product} />
          <FooterColumn title="Resources" links={footerNav.resources} />
          <FooterColumn title="Company" links={footerNav.company} />
          <div>
            <h3 className="text-eyebrow">Legal</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {footerNav.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsLink />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-border">
        <FooterNewsletter />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-eyebrow">Follow us</p>
          <div className="flex items-center gap-5">
            <a
              href={siteConfig.links.youtube}
              aria-label="YouTube"
              className="opacity-80 transition-opacity hover:opacity-100"
              target="_blank"
              rel="noreferrer"
            >
              <YouTubeIcon className="size-5" />
            </a>
            <a
              href={siteConfig.links.linkedin}
              aria-label="LinkedIn"
              className="opacity-80 transition-opacity hover:opacity-100"
              target="_blank"
              rel="noreferrer"
            >
              <LinkedInIcon className="size-5" />
            </a>
            <a
              href={siteConfig.links.x}
              aria-label="X"
              className="opacity-80 transition-opacity hover:opacity-100"
              target="_blank"
              rel="noreferrer"
            >
              <XIcon className="size-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name} by {siteConfig.company}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
