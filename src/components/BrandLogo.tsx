export const LOGO_DARK_SRC = "/brand/equilinq-logo-dark.png";
export const LOGO_WHITE_SRC = "/brand/equilinq-logo-white.png";

interface BrandLogoProps {
  /** Height utility class, e.g. "h-[60px]". */
  className?: string;
  /** Force the white version, for use on black bands. */
  onDark?: boolean;
  eager?: boolean;
}

/** Equilinq wordmark. Dark on light surfaces, white when onDark is set. */
export function BrandLogo({ className = "h-[60px]", onDark = false, eager = false }: BrandLogoProps) {
  return (
    <img
      src={onDark ? LOGO_WHITE_SRC : LOGO_DARK_SRC}
      alt="Equilinq"
      width={1616}
      height={498}
      loading={eager ? "eager" : "lazy"}
      className={`${className} w-auto object-contain`}
    />
  );
}


export default BrandLogo;
