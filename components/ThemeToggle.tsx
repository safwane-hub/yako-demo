'use client';
import { useTheme } from "next-themes";
export function ThemeToggle(){ const { setTheme } = useTheme(); return (<div className="flex items-center gap-1"><button className="btn-ghost" onClick={()=>setTheme('light')}>☀</button><button className="btn-ghost" onClick={()=>setTheme('dark')}>🌙</button><button className="btn-ghost" onClick={()=>setTheme('system')}>💻</button></div>); }
