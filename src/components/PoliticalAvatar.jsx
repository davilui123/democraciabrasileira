import React, { useEffect, useMemo, useState } from 'react';

const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();

export const avatarKey = (value = '') => String(value || 'personagem')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'personagem';

export default function PoliticalAvatar({ name, seed, imageKey, size = 52, className = '' }) {
  const key = useMemo(() => avatarKey(imageKey || seed || name), [imageKey, seed, name]);
  const localSources = useMemo(() => [
    `/characters/${key}.webp`,
    `/characters/${key}.png`,
    `/characters/${key}.jpg`,
    `/characters/${key}.jpeg`,
  ], [key]);
  const dicebear = `https://api.dicebear.com/10.x/notionists/svg?seed=${encodeURIComponent(seed || name || 'Congress')}&radius=18&scale=88`;
  const sources = useMemo(() => [...localSources, dicebear], [localSources, dicebear]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const exhausted = sourceIndex >= sources.length;

  useEffect(() => setSourceIndex(0), [key, dicebear]);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-700 to-slate-900 shadow-elevation-1 ${className}`}
      style={{ width: size, height: size }}
      title={`${name || 'Personagem'} · imagem: public/characters/${key}.webp`}
      data-character-image={`/characters/${key}.webp`}
    >
      {!exhausted ? (
        <img
          src={sources[sourceIndex]}
          alt={`Retrato de ${name}`}
          className="h-full w-full object-cover"
          onError={() => setSourceIndex((index) => index + 1)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-black text-slate-200" style={{ fontSize: Math.max(12, size * 0.28) }}>
          {initials(name)}
        </div>
      )}
    </div>
  );
}
