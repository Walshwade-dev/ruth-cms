import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "light" | "text";

const styles: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:bg-golden hover:text-foreground px-7 py-3.5 rounded-full shadow-sm",
  secondary:
    "border border-foreground/20 text-foreground hover:border-golden hover:bg-golden/10 px-7 py-3.5 rounded-full",
  light:
    "bg-background text-foreground hover:bg-golden px-7 py-3.5 rounded-full",
  text:
    "text-foreground border-b-2 border-golden pb-1 hover:text-golden rounded-sm",
};

export function CtaLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden focus-visible:ring-offset-2 focus-visible:ring-offset-background ${styles[variant]} ${className}`}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        &rarr;
      </span>
    </Link>
  );
}
