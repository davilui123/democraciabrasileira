import React, { useMemo, useState } from 'react';
import { Building2, Image as ImageIcon, Newspaper } from 'lucide-react';

const initials=(label='')=>String(label).split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'•';

export function LogoMark({src,label='',kind='company',className=''}){
  const [failed,setFailed]=useState(false);
  const Icon=kind==='media'?Newspaper:Building2;
  if(src&&!failed) return <img src={src} alt={label} onError={()=>setFailed(true)} className={`object-contain ${className}`} />;
  return <div title={`${label} · logo pendente`} className={`grid place-items-center rounded-xl border border-dashed border-border bg-bg/55 text-muted ${className}`}>
    <div className="text-center leading-none"><Icon size={14} className="mx-auto opacity-55"/><div className="mt-1 text-[9px] font-black tracking-[.12em]">{initials(label)}</div></div>
  </div>;
}

export function IllustratedAsset({src,label='',emoji='◈',className=''}){
  const [failed,setFailed]=useState(false);
  const fallback=useMemo(()=>String(emoji||'◈').slice(0,4),[emoji]);
  if(src&&!failed) return <img src={src} alt={label} onError={()=>setFailed(true)} className={`object-cover ${className}`} />;
  return <div title={`${label} · ilustração pendente`} className={`relative grid place-items-center overflow-hidden rounded-2xl border border-dashed border-border bg-gradient-to-br from-panel/80 to-bg text-muted ${className}`}>
    <ImageIcon size={18} className="absolute left-2 top-2 opacity-25"/>
    <span className="text-4xl opacity-80">{fallback}</span>
    <span className="absolute bottom-2 rounded-md border border-border bg-card/70 px-2 py-1 text-[8px] font-black uppercase tracking-[.12em]">arte pendente</span>
  </div>;
}
