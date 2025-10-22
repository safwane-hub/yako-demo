'use client';
import { usePathname } from "next/navigation";
export function LocaleSwitcher(){ const pathname = usePathname(); const segs = pathname.split('/').filter(Boolean); const current = segs[0] || 'en'; const to = (l: string) => '/' + [l, ...segs.slice(1)].join('/'); return (<div className="flex gap-2">{['en','fr','ar'].map(l => (<a key={l} href={to(l)} className={l===current ? 'font-semibold' : 'opacity-70'}>{l.toUpperCase()}</a>))}</div>); }
