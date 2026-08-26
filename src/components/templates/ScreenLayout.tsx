import type { ReactNode } from 'react';

interface ScreenLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * The one place that knows about safe-area insets, responsive content
 * width, and the header / scrollable-body / sticky-footer split. Every
 * page composes itself from this instead of re-deriving the shell.
 *
 * Below `lg` (phones and tablets) the app fills the viewport edge to edge,
 * as an installed PWA should — only its max-width grows with the screen.
 * At `lg` and up (desktop) it switches to a capped-height card centered on
 * a vignette backdrop, since a single-column, pass-the-device game reads
 * as an app on a wide desktop viewport, not a webpage stretched to fit it.
 */
export function ScreenLayout({ header, footer, children }: ScreenLayoutProps) {
  return (
    <div className="flex min-h-dvh justify-center bg-bg lg:items-center lg:bg-[radial-gradient(ellipse_120%_100%_at_50%_-10%,_var(--color-surface),_var(--color-bg)_70%)] lg:p-8">
      <div
        className="flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg
          sm:max-w-lg md:max-w-2xl
          lg:h-[min(860px,90dvh)] lg:cut lg:cut-lg lg:border lg:border-line/20 lg:shadow-[0_50px_120px_-40px_rgba(0,0,0,0.7)]"
      >
        {header ? <div className="pt-safe shrink-0">{header}</div> : null}
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
        <div className="pb-safe shrink-0 px-6 pt-3">{footer}</div>
      </div>
    </div>
  );
}
