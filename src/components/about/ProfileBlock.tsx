import { ReactNode } from "react";

export function ProfileBlock({ title, children }: { title: string, children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-serif text-2xl font-bold text-foreground mb-4 border-b border-golden/20 pb-2">
        {title}
      </h2>
      <div className="text-foreground/80 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
