import Link from "next/link";
import { profileData } from "@/data/profile";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const validSocials = profileData.contact.socials.filter(social => social.url !== null);

  return (
    <footer className="bg-background border-t border-golden/10 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6 md:order-2">
            <Link 
              href="/about" 
              className="text-sm text-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-sm px-1 py-0.5"
            >
              About
            </Link>
            <Link 
              href="/portfolio" 
              className="text-sm text-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-sm px-1 py-0.5"
            >
              Portfolio
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-sm px-1 py-0.5"
            >
              Contact
            </Link>
            
            {/* Social Links (only render if confirmed URLs exist) */}
            {validSocials.length > 0 && (
              <span className="text-golden/20 hidden md:inline">|</span>
            )}
            {validSocials.map((social) => (
              <a 
                key={social.platform}
                href={social.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-sm px-1 py-0.5"
                title={social.platform}
              >
                {social.platform}
              </a>
            ))}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center md:text-left text-sm text-foreground/60">
              &copy; {currentYear} Ruth Shiru. All rights reserved.
            </p>
            <p className="text-center md:text-left text-xs text-foreground/50 mt-1">
              Food & Beverage Practitioner in Training | Mathioya Technical Institute
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
