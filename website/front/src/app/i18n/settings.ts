export const fallbackLng = 'fr'
export const languages = [fallbackLng]
export const cookieName = 'LANG'
export const defaultNS = 'translation'

export function getOptions (lang = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lang,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}