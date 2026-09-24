import { useState } from 'react'

interface TowelieRunnerProps {
  style?: React.CSSProperties
  /** When provided, the character's eye becomes a hidden admin entry point */
  onAdminClick?: () => void
}

export function TowelieRunner({ style, onAdminClick }: TowelieRunnerProps) {
  // Tracks hover over the secret eye area — used only for the barely-visible glow
  const [eyeHovered, setEyeHovered] = useState(false)

  return (
    <>
      <style>{`
        @keyframes tw-leg-f {
          0%,100% { transform: rotate(-40deg); }
          50%      { transform: rotate(36deg);  }
        }
        @keyframes tw-leg-b {
          0%,100% { transform: rotate(36deg);  }
          50%      { transform: rotate(-40deg); }
        }
        @keyframes tw-arm-f {
          0%,100% { transform: rotate(30deg);  }
          50%      { transform: rotate(-25deg); }
        }
        @keyframes tw-arm-b {
          0%,100% { transform: rotate(-25deg); }
          50%      { transform: rotate(30deg);  }
        }
        @keyframes tw-bob {
          0%,100% { transform: translateY(0px)  rotate(-2deg); }
          25%      { transform: translateY(-5px) rotate(0deg);  }
          50%      { transform: translateY(0px)  rotate(2deg);  }
          75%      { transform: translateY(-5px) rotate(0deg);  }
        }
        @keyframes tw-smoke {
          0%   { opacity:.72; transform:translate(0,0)        scale(1);   }
          100% { opacity:0;   transform:translate(-4px,-22px) scale(3.5); }
        }

        .tw-leg-front { transform-box:fill-box; transform-origin:top center;
                        animation: tw-leg-f 0.36s ease-in-out infinite; }
        .tw-leg-back  { transform-box:fill-box; transform-origin:top center;
                        animation: tw-leg-b 0.36s ease-in-out infinite; }
        .tw-arm-front { transform-box:fill-box; transform-origin:top center;
                        animation: tw-arm-f 0.36s ease-in-out infinite; }
        .tw-arm-back  { transform-box:fill-box; transform-origin:top center;
                        animation: tw-arm-b 0.36s ease-in-out infinite; }
        .tw-body      { animation: tw-bob 0.36s ease-in-out infinite; }

        .tw-sm1 { animation: tw-smoke 1.1s ease-out infinite; }
        .tw-sm2 { animation: tw-smoke 1.1s 0.37s ease-out infinite; }
        .tw-sm3 { animation: tw-smoke 1.1s 0.73s ease-out infinite; }
      `}</style>

      <svg
        viewBox="0 0 72 108"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', ...style }}
      >
        {/* ── BACK LEG ── */}
        <g className="tw-leg-back">
          <rect x="23" y="76" width="12" height="25" rx="5" fill="#606EA8" />
          <ellipse cx="26" cy="102" rx="10" ry="4.5" fill="#B8891A" />
        </g>

        {/* ── BACK ARM ── */}
        <g className="tw-arm-back">
          <rect x="11" y="35" width="11" height="22" rx="5" fill="#606EA8" />
          <ellipse cx="16" cy="58" rx="6" ry="5" fill="#606EA8" />
        </g>

        {/* ── BODY + FACE (bobs up/down) ── */}
        <g className="tw-body">

          {/* Main towel body */}
          <rect x="15" y="19" width="44" height="58" rx="5" fill="#7B8EC8" />

          {/* Folded top edge */}
          <path d="M15 21 Q37 11 59 21 L59 27 Q37 17 15 27 Z" fill="#6572B0" />

          {/* Stripe 1 */}
          <rect x="15" y="29" width="44" height="7" rx="1" fill="rgba(255,255,255,0.92)" />

          {/* Stripe 2 */}
          <rect x="15" y="52" width="44" height="7" rx="1" fill="rgba(255,255,255,0.92)" />

          {/* ── FACE ── */}

          {/* Eye white — bloodshot */}
          <ellipse
            cx="51" cy="25" rx="9" ry="7.5"
            fill="#F0C0A8"
            style={onAdminClick && eyeHovered
              ? { filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.18))' }
              : undefined}
          />
          {/* Veins */}
          <line x1="43" y1="24" x2="49" y2="25" stroke="#CC2020" strokeWidth="0.7" opacity="0.85" />
          <line x1="46" y1="20" x2="50" y2="24" stroke="#CC2020" strokeWidth="0.7" opacity="0.85" />
          <line x1="55" y1="20" x2="52" y2="25" stroke="#CC2020" strokeWidth="0.7" opacity="0.75" />
          <line x1="59" y1="25" x2="54" y2="26" stroke="#CC2020" strokeWidth="0.7" opacity="0.75" />
          <line x1="57" y1="30" x2="53" y2="28" stroke="#CC2020" strokeWidth="0.6" opacity="0.55" />
          {/* Pupil */}
          <ellipse cx="51" cy="25" rx="3.5" ry="3.2" fill="#111" />
          {/* Shine */}
          <ellipse cx="49" cy="24" rx="1.1" ry="1" fill="white" opacity="0.9" />
          {/* Droopy upper eyelid */}
          <path d="M42 21 Q51 15 60 21" fill="#7B8EC8" />

          {/* Eyebrow */}
          <line x1="42" y1="17" x2="57" y2="15" stroke="#1A1A1A" strokeWidth="2.4" strokeLinecap="round" />

          {/* Nose bump */}
          <path d="M60 29 Q67 32 60 36" stroke="#C4A090" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Grin */}
          <path d="M47 38 Q54 44 62 38" stroke="#222" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Teeth */}
          <path d="M50 39 Q54 43 59 39" fill="rgba(255,255,255,0.88)" />

          {/*
            ─────────────────────────────────────────────────────────────
            SECRET ADMIN EYE HOTSPOT
            Invisible ellipse perfectly overlaid on the eye.
            Only rendered on the designated 4th runner (when onAdminClick is provided).

            Eye centre in SVG viewBox (0 0 72 108): cx=51, cy=25
            Clickable radius: rx=11, ry=10  — adjust here if needed

            This element bobs naturally with the .tw-body animation
            because it lives inside this group.
            ─────────────────────────────────────────────────────────────
          */}
          {onAdminClick && (
            <ellipse
              cx="51"
              cy="25"
              rx="11"
              ry="10"
              fill="rgba(0,0,0,0)"
              pointerEvents="all"
              style={{ cursor: 'default' }}
              onMouseEnter={() => setEyeHovered(true)}
              onMouseLeave={() => setEyeHovered(false)}
              onClick={(e) => { e.stopPropagation(); onAdminClick() }}
              onTouchEnd={(e) => { e.stopPropagation(); onAdminClick() }}
            />
          )}
        </g>

        {/* ── SMOKE ── */}
        <circle className="tw-sm1" cx="57" cy="66" r="3"   fill="rgba(220,220,210,0.72)" />
        <circle className="tw-sm2" cx="55" cy="59" r="4.2" fill="rgba(205,205,195,0.52)" />
        <circle className="tw-sm3" cx="58" cy="52" r="5.5" fill="rgba(190,190,180,0.32)" />

        {/* ── FRONT ARM ── */}
        <g className="tw-arm-front">
          <rect x="47" y="35" width="12" height="20" rx="6" fill="#DCDCDC" />
          <rect x="48" y="51" width="11" height="16" rx="5" fill="#D4D4D4" />
          <ellipse cx="53" cy="69" rx="7" ry="5.5" fill="#DCDCDC" />
          <rect x="51" y="71" width="4" height="18" rx="2" fill="#D8CC96" />
          <rect x="52" y="71" width="2" height="18" rx="1" fill="#C8BC7A" opacity="0.55" />
          <ellipse cx="53" cy="72" rx="2.5" ry="1.5" fill="#FF5500" opacity="0.9" />
        </g>

        {/* ── FRONT LEG ── */}
        <g className="tw-leg-front">
          <rect x="37" y="76" width="13" height="26" rx="5" fill="#D4D4D4" />
          <ellipse cx="45" cy="103" rx="12" ry="5" fill="#D4A020" />
        </g>
      </svg>
    </>
  )
}
