import AppStoreRedirect from "./place/AppStoreRedirect";

export default function NotFound() {
  return (
    <div className="redirect-page">
      <AppStoreRedirect />
      <div className="container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Kinlet" width={80} height={80} />
        <p>Redirecting to the App Store…</p>
        <p>
          <a href="https://apps.apple.com/app/kinlet/id6758401270">
            Tap here if you&apos;re not redirected.
          </a>
        </p>
      </div>
    </div>
  );
}
