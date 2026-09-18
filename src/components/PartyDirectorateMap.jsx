import React from 'react';

const POS = {
  RR:[190,45], AP:[350,58], AM:[155,120], PA:[315,135], AC:[65,180], RO:[150,205], TO:[330,225], MA:[405,170], PI:[420,225], CE:[485,205], RN:[535,220], PB:[525,245], PE:[500,270], AL:[510,300], SE:[495,323], BA:[425,325], MT:[245,265], GO:[325,320], DF:[347,316], MS:[250,360], MG:[380,365], ES:[440,380], RJ:[410,410], SP:[330,405], PR:[310,455], SC:[330,493], RS:[300,535]
};
const hex=(cx,cy,r=27)=>Array.from({length:6},(_,i)=>{const a=Math.PI/3*i-Math.PI/6;return `${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`}).join(' ');
const alpha=(value)=>Math.max(.2,Math.min(.98,(Number(value)||40)/100));

export default function PartyDirectorateMap({party,selected,onSelect}){
  const dirs=party?.diretorios||[];
  return <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-border bg-panel/35">
    <svg viewBox="35 15 515 550" preserveAspectRatio="xMidYMid meet" className="h-full w-full" role="img" aria-label={`Força dos diretórios estaduais do ${party?.sigla||'partido'}`}>
      {dirs.map(d=>{const [x,y]=POS[d.uf]||[300,300];const active=selected===d.uf;return <g key={d.uf} role="button" tabIndex="0" onClick={()=>onSelect?.(d.uf)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')onSelect?.(d.uf)}} className="cursor-pointer outline-none">
        <polygon points={hex(x,y,active?29:26)} fill={party?.corPrincipal||'#64748b'} fillOpacity={alpha(d.maquina)} stroke={active?'#F3C969':'rgba(255,255,255,.22)'} strokeWidth={active?4:1.4}/>
        <text x={x} y={y+4} textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#fff">{d.uf}</text>
      </g>})}
    </svg>
    <div className="pointer-events-none absolute bottom-2 left-3 rounded-lg border border-border bg-bg/85 px-2 py-1 text-[9px] font-bold text-muted backdrop-blur">Opacidade = força da máquina estadual</div>
  </div>;
}
