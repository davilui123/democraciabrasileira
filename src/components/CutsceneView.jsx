import React, { useState } from 'react';
import { ImageOff, MapPin, Quote, Radio, SkipForward } from 'lucide-react';

export default function CutsceneView({ scene, onContinue }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (!scene) return null;
  const cobertura = scene.cobertura || {};

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-bg p-4 md:p-6">
      <div className="mx-auto grid min-h-full max-w-5xl items-center gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(330px,.95fr)]">
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-black shadow-elevation-5">
          {!imageFailed ? (
            <img
              src={scene.imagem}
              alt={`${scene.personagem} — ${scene.titulo}`}
              onError={() => setImageFailed(true)}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="grid aspect-square w-full place-items-center bg-panel p-8 text-center">
              <div>
                <ImageOff size={42} className="mx-auto text-warning" />
                <p className="mt-4 text-sm font-black">Imagem do acontecimento indisponível</p>
                <p className="mt-1 text-xs text-muted">{scene.imagem}</p>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent px-5 pb-5 pt-16 text-white">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-white/70">
              <Radio size={13} /> {cobertura.veiculo || 'RADAR'}{cobertura.programa ? ` · ${cobertura.programa}` : ''}
              <span className="rounded-full border border-white/20 bg-black/25 px-2 py-0.5"><MapPin size={10} className="mr-1 inline" /> {scene.local}</span>
            </div>
            <div className="mt-2 text-lg font-black">{scene.personagem}</div>
            <div className="text-xs font-bold text-white/70">{scene.cargo}</div>
          </div>
        </section>

        <section className="flex flex-col justify-center">
          <div className="ui-kicker">Plantão político</div>
          <h3 className="mt-2 text-3xl font-black tracking-[-.04em] text-text md:text-4xl">{scene.titulo}</h3>
          <p className="mt-1 text-sm font-bold text-warning">{scene.subtitulo}</p>
          <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-info/20 bg-info/5 px-3 py-1.5 text-xs font-bold text-muted">
            <MapPin size={14} className="text-info" /> {scene.local}
          </div>

          <p className="mt-6 text-sm leading-7 text-text/80">{scene.texto}</p>

          <div className="mt-6 rounded-2xl border border-warning/25 bg-warning/5 p-5">
            <Quote size={20} className="text-warning" />
            <p className="mt-3 text-lg font-black leading-relaxed text-text">“{scene.fala}”</p>
            <p className="mt-3 text-[10px] font-black uppercase tracking-[.18em] text-muted">{scene.tom}</p>
          </div>

          <button type="button" onClick={onContinue} className="ui-btn-primary mt-6 w-full justify-center sm:w-auto">
            Continuar <SkipForward size={16} />
          </button>
        </section>
      </div>
    </div>
  );
}
