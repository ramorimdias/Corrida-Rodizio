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

export const isVehicleAvatar = (avatar: string) =>
  VEHICLE_AVATAR_SET.has(avatar);
