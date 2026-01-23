export const AVATAR_OPTIONS = [
  "🍕",
  "🍣",
  "🍔",
  "🍩",
  "🍟",
  "🥩",
  "🍗",
  "🚗",
  "🚕",
  "🚙",
  "🚌",
  "🚎",
  "🚚",
  "🚛",
  "🚜",
  "🏎️",
  "🚓",
  "🚑",
  "🚒",
  "🚲",
];

export const DEFAULT_AVATAR = AVATAR_OPTIONS[0];

const VEHICLE_AVATAR_SET = new Set([
  "🚗",
  "🚕",
  "🚙",
  "🚌",
  "🚎",
  "🚚",
  "🚛",
  "🚜",
  "🏎️",
  "🚓",
  "🚑",
  "🚒",
  "🚲",
]);

const IMAGE_AVATAR_PATTERN = /\.(png|jpe?g|webp|gif)$/i;

export const isVehicleAvatar = (avatar?: string | null) =>
  !!avatar && VEHICLE_AVATAR_SET.has(avatar);

export const isImageAvatar = (avatar?: string | null) =>
  !!avatar && IMAGE_AVATAR_PATTERN.test(avatar);

export const getAvatarUrl = (avatar: string) => `/avatars/${avatar}`;
