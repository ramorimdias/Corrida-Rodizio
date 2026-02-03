-- Allow drinks as a valid food_type
alter table public.races
  drop constraint if exists races_food_type_check;

alter table public.races
  add constraint races_food_type_check
  check (food_type in ('pizza', 'sushi', 'burger', 'drinks'));
