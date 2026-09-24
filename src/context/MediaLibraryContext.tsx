// Compatibility shim — implementation lives in MediaContext.tsx.
// All existing imports of useMediaLibrary() and MediaItem continue to work unchanged.
export { useMediaLibrary } from './MediaContext'
export type { MediaItem } from './MediaContext'

export function MediaLibraryProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
