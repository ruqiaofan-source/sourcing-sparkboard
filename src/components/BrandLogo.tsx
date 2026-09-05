export const LOGO_DARK_SRC = "/brand/equilinq-logo-dark.png";
export const LOGO_WHITE_SRC = "/brand/equilinq-logo-white.png";

interface BrandLogoProps {
  /** Height utility class, e.g. "h-[60px]". */
  className?: string;
  /** Force the white version, for use on black bands. */
  onDark?: boolean;
  eager?: boolean;
}

/** Equilinq wordmark. Follows the theme unless onDark is set. */
export function BrandLogo({ className = "h-[60px]", onDark = false, eager = false }: BrandLogoProps) {
  const common = `${className} w-auto object-contain`;
  const loading = eager ? "eager" : "lazy";

  if (onDark) {
    return (
      <img src={LOGO_WHITE_SRC} alt="Equilinq" width={1616} height={498} loading={loading} className={common} />
    );
  }

  return (
    <>
      <img src={LOGO_DARK_SRC} alt="Equilinq" width={1616} height={498} loading={loading} className={`${common} dark:hidden`} />
      <img src={LOGO_WHITE_SRC} alt="" aria-hidden="true" width={1616} height={498} loading={loading} className={`${common} hidden dark:block`} />
    </>
  );
}

export default BrandLogo;
