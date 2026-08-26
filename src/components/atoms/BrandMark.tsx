import { MaskIcon } from '@/components/icons';

import { IconTile } from './IconTile';

interface BrandMarkProps {
  size?: number;
  className?: string;
}

/** The small gradient mask-tile used to keep the app's identity visible on every screen. */
export function BrandMark({ size = 26, className }: BrandMarkProps) {
  return (
    <IconTile size={size} className={className}>
      <MaskIcon width={size * 0.52} height={size * 0.52} />
    </IconTile>
  );
}
