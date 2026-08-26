/** Deterministic gradient per player index — same player always gets the same color. */
const AVATAR_GRADIENTS: readonly string[] = [
  'linear-gradient(135deg, oklch(65% 0.19 300), oklch(60% 0.19 320))',
  'linear-gradient(135deg, oklch(68% 0.20 340), oklch(63% 0.20 10))',
  'linear-gradient(135deg, oklch(68% 0.15 250), oklch(62% 0.17 280))',
  'linear-gradient(135deg, oklch(75% 0.16 55), oklch(68% 0.18 30))',
  'linear-gradient(135deg, oklch(64% 0.19 25), oklch(58% 0.20 350))',
];

export function getAvatarGradient(index: number): string {
  return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
}
