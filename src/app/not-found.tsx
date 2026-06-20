import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ws-hero px-5 text-center">
      <p className="tnum font-display text-6xl font-bold text-ws-primary">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ws-ink">Signal not found</h1>
      <p className="mt-2 text-ws-sage">This page isn&apos;t part of the experience.</p>
      <Link href="/" className="mt-6 rounded-lg bg-ws-primary px-5 py-3 text-sm font-medium text-white">Back to home</Link>
    </div>
  );
}
