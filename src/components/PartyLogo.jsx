import React, { useState } from 'react';

export default function PartyLogo({party,size=56,className=''}){
  const [failed,setFailed]=useState(false);
  const px=typeof size==='number'?`${size}px`:size;
  const style={width:px,height:px,borderColor:`${party?.corPrincipal||'#64748b'}66`,background:`linear-gradient(145deg, ${party?.corPrincipal||'#334155'}22, ${party?.corSecundaria||'#111827'}55)`};
  return <div className={`grid shrink-0 place-items-center overflow-hidden rounded-2xl border bg-panel/60 shadow-elevation-1 ${className}`} style={style}>
    {party?.logo&&!failed?<img src={party.logo} alt={`Logo ${party.sigla}`} className="h-full w-full object-contain p-2" onError={()=>setFailed(true)}/>:<div className="flex h-full w-full flex-col items-center justify-center"><div className="text-base font-black tracking-[-.04em] text-text" style={{fontSize:`calc(${px} * .28)`}}>{party?.sigla||'P'}</div><div className="mt-0.5 text-[7px] font-black uppercase tracking-[.16em] text-muted">partido</div></div>}
  </div>;
}
