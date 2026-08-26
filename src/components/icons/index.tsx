import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement>;

/**
 * All icons are hand-drawn, stroke-based SVGs on a 24px grid rather than an
 * icon-font or icon-library dependency — keeps the shipped bundle free of
 * any icon set we'd otherwise only use a handful of glyphs from.
 */
const withDefaults = (props: IconProps): IconProps => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  ...props,
});

export function PlusIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path
        d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path
        d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 20v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path
        d="M20.6 12.7 12.4 21a2 2 0 0 1-2.8 0l-6.6-6.6a2 2 0 0 1 0-2.8L11.2 3.2A2 2 0 0 1 12.6 2.6h6.8A2 2 0 0 1 21.4 4.6v6.8a2 2 0 0 1-.6 1.3Z"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path d="M12 3v12" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
      <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M6 11v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path d="M12 3v12" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
      <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 19h12" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path d="M4 12l6 6L20 6" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HandTapIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path
        d="M9 11V5a1.5 1.5 0 0 1 3 0v5m0-3v-2a1.5 1.5 0 0 1 3 0v5m0-3a1.5 1.5 0 0 1 3 0v4m0 0v2a1.5 1.5 0 0 1 3 0v2a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.4L4 14.5a1.4 1.4 0 0 1 2.3-1.6L9 16"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChatDotsIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path
        d="M21 11.5a8.4 8.4 0 0 1-4.3 7.3 9 9 0 0 1-9.6-.6L3 19l1.1-3.5A8.4 8.4 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 21 11.5Z"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <circle cx="8" cy="11.5" r="1" fill="currentColor" />
      <circle cx="12" cy="11.5" r="1" fill="currentColor" />
      <circle cx="16" cy="11.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path d="M6 4.5v15l13-7.5-13-7.5Z" fill="currentColor" />
    </svg>
  );
}

export function RestartIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path
        d="M3 12a9 9 0 1 1 2.6 6.4M3 12V6m0 6h6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DetectiveIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <circle cx="10" cy="14" r="5" stroke="currentColor" strokeWidth={1.8} />
      <path
        d="M14 18l4.5 4.5M4 9c0-2.8 2.7-5 6-5s6 2.2 6 5"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShieldMaskIcon(props: IconProps) {
  return (
    <svg {...withDefaults(props)}>
      <path
        d="M9 9a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1-1.5 2.4"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="18" r="0.9" fill="currentColor" />
    </svg>
  );
}
