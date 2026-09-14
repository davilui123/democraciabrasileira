import React from 'react';

const POS = {
  RR:[190,45], AP:[350,58], AM:[155,120], PA:[315,135], AC:[65,180], RO:[150,205], TO:[330,225], MA:[405,170], PI:[420,225], CE:[485,205], RN:[535,220], PB:[525,245], PE:[500,270], AL:[510,300], SE:[495,323], BA:[425,325], MT:[245,265], GO:[325,320], DF:[347,316], MS:[250,360], MG:[380,365], ES:[440,380], RJ:[410,410], SP:[330,405], PR:[310,455], SC:[330,493], RS:[300,535]
};
const hex=(cx,cy,r=27)=>Array.from({length:6},(_,i)=>{const a=Math.PI/3*i-Math.PI/6;return `${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`}).join(' ');
const fill=(a)=>a>=60?'var(--color-success, #2e9d78)':a>=50?'#4f7f74':a>=40?'#8b6d3f':'#9b4d52';

export default function BrazilPoliticalMap({estados=[],selected,onSelect,compact=false}){
  return <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-border bg-panel/35">
    <svg viewBox="20 10 550 570" className="h-full w-full" role="img" aria-label="Mapa político estilizado do Brasil por unidade federativa">
      <defs><filter id="mapShadow"><feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity=".22"/></filter></defs>
      {estados.map(e=>{const [x,y]=POS[e.uf]||[300,300];const active=selected===e.uf;return <g key={e.uf} role="button" tabIndex="0" onClick={()=>onSelect?.(e.uf)} onKeyDown={ev=>{if(ev.key==='Enter'||ev.key===' ')onSelect?.(e.uf)}} className="cursor-pointer outline-none">
        <polygon points={hex(x,y,compact?24:27)} fill={fill(e.aprovacao||50)} stroke={active?'#f0c869':'rgba(255,255,255,.22)'} strokeWidth={active?4:1.4} filter={active?'url(#mapShadow)':undefined} className="transition-opacity hover:opacity-85"/>
        <text x={x} y={y+4} textAnchor="middle" fontSize={compact?10:11} fontWeight="900" fill="#fff">{e.uf}</text>
      </g>})}
    </svg>
    <div className="pointer-events-none absolute bottom-2 left-3 flex items-center gap-2 rounded-lg border border-border bg-bg/80 px-2 py-1 text-[9px] font-bold text-muted backdrop-blur"><span className="h-2 w-2 rounded-full bg-success"/>60%+ <span className="ml-1 h-2 w-2 rounded-full bg-[#9b4d52]"/>&lt;40%</div>
  </div>;
}
