/* eslint-disable @next/next/no-img-element */

export const quposLogoUrl =
  "https://www.qupos.com/assets/qupos-logo-O7Yzz17d.png";

export function BrandLogo({
  compact = false,
  inverted = false,
}: {
  compact?: boolean;
  inverted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <img
        alt="Qupos"
        className="h-10 w-10 shrink-0 object-contain"
        src={quposLogoUrl}
      />
      {!compact ? (
        <div className={inverted ? "text-white" : "text-[#201a17]"}>
          <p className="text-lg font-bold leading-5">Qupos</p>
          <p
            className={`text-xs font-semibold ${
              inverted ? "text-white/[0.65]" : "text-[#8b6b58]"
            }`}
          >
            Actualizacion de datos
          </p>
        </div>
      ) : null}
    </div>
  );
}
