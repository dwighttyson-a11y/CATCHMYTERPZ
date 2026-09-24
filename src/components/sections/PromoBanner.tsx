import { Link } from 'react-router-dom'

interface PromoBannerProps {
  eyebrow?: string
  headline: string
  description?: string
  cta?: { label: string; to: string }
  ctaSecondary?: { label: string; to: string }
  image?: string
}

export function PromoBanner({ eyebrow, headline, description, cta, ctaSecondary, image }: PromoBannerProps) {
  return (
    <section className="relative overflow-hidden bg-brand-surface border-y border-brand-border" aria-label="Aktionsbanner">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-10" />
        </div>
      )}
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 via-transparent to-brand-accent/10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent" />

      <div className="container-base relative z-10 py-20 lg:py-28">
        <div className="max-w-2xl mx-auto text-center">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h2 className="font-black text-3xl sm:text-4xl lg:text-5xl text-brand-text leading-tight mb-6">
            {headline}
          </h2>
          {description && (
            <p className="text-brand-secondary text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto">{description}</p>
          )}
          <div className="flex flex-wrap gap-4 justify-center">
            {cta && (
              <Link to={cta.to} className="btn-primary px-10 py-4 text-base shadow-glow-green">
                {cta.label}
              </Link>
            )}
            {ctaSecondary && (
              <Link to={ctaSecondary.to} className="btn-secondary px-10 py-4 text-base">
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
