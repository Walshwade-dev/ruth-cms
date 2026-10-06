import { PageContainer } from "@/components/layout/PageContainer";
import { profileData } from "@/data/profile";

export default function ContactPage() {
  const { email, phone, socials } = profileData.contact;
  const validSocials = socials.filter((s) => s.url !== null);
  const hasAnyContact = email !== null || phone !== null || validSocials.length > 0;

  return (
    <main className="flex-grow bg-background flex flex-col justify-center">
      <PageContainer className="py-16 md:py-32">
        <div className="max-w-3xl mx-auto text-center md:text-left">
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-8">
            Let&apos;s <span className="text-golden italic">Connect</span>
          </h1>
          
          <p className="text-foreground/70 text-xl mb-16 leading-relaxed max-w-2xl mx-auto md:mx-0">
            For catering inquiries, professional collaborations, or opportunities related to food entrepreneurship.
          </p>

          <div className="border-t border-golden/20 pt-12 md:pt-16">
            
            {!hasAnyContact ? (
              <div className="bg-foreground/5 border border-golden/10 p-8 md:p-12 rounded-2xl">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Inquiries
                </h2>
                <p className="text-foreground/70 leading-relaxed max-w-lg mx-auto md:mx-0">
                  Professional contact details are currently being finalized. Please check back soon for direct email and professional network links.
                </p>
              </div>
            ) : (
              <div className="space-y-12 md:space-y-16">
                {/* Primary Contact Method (Email) */}
                {email && (
                  <section>
                    <h2 className="text-xs font-bold tracking-widest uppercase text-golden mb-4">Direct Inquiry</h2>
                    <a 
                      href={`mailto:${email}`}
                      className="inline-block font-serif text-2xl md:text-4xl text-foreground hover:text-golden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-sm px-1 -ml-1 border-b-2 border-transparent hover:border-golden"
                      aria-label="Send an email to Ruth Shiru"
                    >
                      {email}
                    </a>
                  </section>
                )}

                {/* Secondary Contact (Phone) */}
                {phone && (
                  <section>
                    <h2 className="text-xs font-bold tracking-widest uppercase text-golden mb-4">Phone</h2>
                    <a 
                      href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-block font-serif text-xl md:text-2xl text-foreground/80 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-sm px-1 -ml-1"
                      aria-label="Call Ruth Shiru"
                    >
                      {phone}
                    </a>
                  </section>
                )}

                {/* Social Presence */}
                {validSocials.length > 0 && (
                  <section>
                    <h2 className="text-xs font-bold tracking-widest uppercase text-golden mb-4">Professional Presence</h2>
                    <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 justify-center md:justify-start">
                      {validSocials.map((social) => (
                        <li key={social.platform}>
                          <a 
                            href={social.url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground/80 hover:text-foreground border-b border-foreground/30 hover:border-golden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-sm pb-1"
                          >
                            {social.platform}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
            
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
