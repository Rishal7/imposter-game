/** Deterministic gradient per player index — same player always gets the same color. */
const AVATAR_GRADIENTS: readonly string[] = [
  'linear-gradient(135deg, oklch(70% 0.19 280), oklch(64% 0.20 310))',
  'linear-gradient(135deg, oklch(66% 0.22 345), oklch(62% 0.20 5))',
  'linear-gradient(135deg, oklch(78% 0.15 195), oklch(68% 0.17 220))',
  'linear-gradient(135deg, oklch(80% 0.19 130), oklch(72% 0.18 160))',
  'linear-gradient(135deg, oklch(72% 0.19 90), oklch(70% 0.2 60))',
];

export function getAvatarGradient(index: number): string {
  return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
}
