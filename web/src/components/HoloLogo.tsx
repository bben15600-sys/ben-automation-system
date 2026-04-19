export default function HoloLogo({ size = 26 }: { size?: number }) {
  return <span className="holo-logo" style={{ width: size, height: size }} aria-hidden />;
}
