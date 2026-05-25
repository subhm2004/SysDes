import { cn } from "@/lib/utils";

type LandingSectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  alt?: boolean;
};

export function LandingSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  innerClassName,
  alt = false,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-16 sm:py-24", alt && "landing-section-alt", className)}
    >
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6", innerClassName)}>
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-landing-accent">{eyebrow}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--landing-fg)] sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-base leading-relaxed text-landing-muted sm:text-lg">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
