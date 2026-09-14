import React from 'react';

const tones = {
  success: 'from-emerald-400/24 via-emerald-500/12 to-transparent border-emerald-400/30 text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]',
  warning: 'from-amber-400/24 via-amber-500/12 to-transparent border-amber-400/30 text-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]',
  danger: 'from-rose-400/24 via-rose-500/12 to-transparent border-rose-400/30 text-rose-300 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]',
  info: 'from-blue-400/24 via-blue-500/12 to-transparent border-blue-400/30 text-blue-300 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]',
  violet: 'from-violet-400/24 via-violet-500/12 to-transparent border-violet-400/30 text-violet-300 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]',
  neutral: 'from-slate-400/18 via-slate-500/8 to-transparent border-white/10 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]',
};

const sizes = {
  sm: 'h-8 w-8 rounded-lg',
  md: 'h-10 w-10 rounded-xl',
  lg: 'h-12 w-12 rounded-2xl',
};

export default function GameIcon({ icon: Icon, tone = 'neutral', size = 'md', iconSize, className = '' }) {
  const px = iconSize || (size === 'lg' ? 21 : size === 'sm' ? 14 : 17);
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden border bg-gradient-to-br ${tones[tone] || tones.neutral} ${sizes[size] || sizes.md} ${className}`}>
      <span className="absolute inset-[3px] rounded-[inherit] border border-white/[0.035]" />
      <Icon size={px} strokeWidth={2.05} className="relative z-10" />
    </span>
  );
}
