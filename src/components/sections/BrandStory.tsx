import { Link } from 'react-router-dom'
import { ArrowRight, Instagram } from 'lucide-react'

export function BrandStory() {
  return (
    <section className="section-padding bg-brand-surface" aria-labelledby="brand-story-heading">
      <div className="container-base">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image / Logo */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-brand-accent/10 blur-3xl scale-110" />
              <div className="absolute inset-0 rounded-full border-2 border-brand-accent/20 scale-110 animate-pulse-glow" />
              <img
                src="/logo.jpg"
                alt="CatchMyTerpz 069 Logo"
                className="w-72 h-72 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-brand-accent/30 shadow-glow-green relative z-10"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="eyebrow mb-4">Wer wir sind</p>
            <h2 id="brand-story-heading" className="section-title mb-6">
              Built different.<br />
              <span className="text-brand-accent">CatchMyTerpz 069</span>
            </h2>
            <div className="space-y-4 text-brand-secondary leading-relaxed">
              <p>
                CatchMyTerpz 069 exists for one reason — to bring the best product to people who know the difference. We love terpenes, we love the culture, and we don't cut corners.
              </p>
              <p>
                Whole Europa isn't a slogan. It's a commitment. Premium quality, no compromise, no excuses — every time.
              </p>
              <p>
                Follow us on Instagram for the latest drops, behind-the-scenes, and exclusive offers.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8 mb-8">
              {['CMT 069', 'Whole Europa 🇪🇺', 'Premium Quality', '18+'].map((tag) => (
                <span key={tag} className="px-4 py-1.5 border border-brand-border text-xs font-bold text-brand-secondary rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/about" className="btn-primary">
                Mehr erfahren <ArrowRight size={15} />
              </Link>
              <a
                href="https://www.instagram.com/catchmyterpzz069/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <Instagram size={15} />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
