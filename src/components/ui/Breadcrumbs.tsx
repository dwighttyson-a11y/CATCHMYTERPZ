import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface Crumb {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  crumbs: Crumb[]
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  const all = [{ label: 'Startseite', to: '/' }, ...crumbs]

  return (
    <nav aria-label="Brotkrumen-Navigation">
      <ol className="flex items-center gap-1.5 text-xs text-brand-secondary flex-wrap">
        {all.map((crumb, i) => {
          const isLast = i === all.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i === 0 ? (
                <Link to="/" className="hover:text-brand-text transition-colors flex items-center gap-1" aria-label="Startseite">
                  <Home size={12} />
                </Link>
              ) : crumb.to && !isLast ? (
                <Link to={crumb.to} className="hover:text-brand-text transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-brand-text font-medium' : ''} aria-current={isLast ? 'page' : undefined}>
                  {crumb.label}
                </span>
              )}
              {!isLast && <ChevronRight size={11} className="text-brand-border flex-shrink-0" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
