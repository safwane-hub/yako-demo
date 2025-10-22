export const locales = ["en","fr","ar"] as const;
export type Locale = typeof locales[number];
export function isRTL(locale: Locale){ return locale === "ar"; }
