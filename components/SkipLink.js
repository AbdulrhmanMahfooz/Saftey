export default function SkipLink({ label }) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-brand-700 focus:px-3 focus:py-2 focus:text-white"
    >
      {label}
    </a>
  );
}
