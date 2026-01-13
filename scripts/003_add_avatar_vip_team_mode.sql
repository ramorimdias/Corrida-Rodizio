-- Add team mode flag to races
alter table public.races
  add column if not exists is_team_mode boolean default false;

-- Add avatar, VIP flag, and team to participants
alter table public.participants
  add column if not exists avatar text default '🍕';

alter table public.participants
  add column if not exists is_vip boolean default false;

alter table public.participants
  add column if not exists team text;
