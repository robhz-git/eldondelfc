-- LEAGUE SYSTEM SCHEMA (V2)

-- 1. Players (Users who register)
create table if not exists league_players (
  id uuid primary key default uuid_generate_v4(),
  username text not null, -- The name shown in standings
  ea_id text,             -- EA FC Username
  contact_info text,      -- Discord/WhatsApp (Private)
  
  -- Stats (Updated via triggers or admin logic)
  points integer default 0,
  matches_played integer default 0,
  wins integer default 0,
  draws integer default 0,
  losses integer default 0,
  goals_for integer default 0,
  goals_against integer default 0,
  clean_sheets integer default 0, -- For Golden Glove
  
  status text default 'pending', -- 'pending', 'active' (Only active show in standings)
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Matches (Played Games)
create table if not exists league_matches (
  id uuid primary key default uuid_generate_v4(),
  player_home_id uuid references league_players(id),
  player_away_id uuid references league_players(id),
  score_home integer,
  score_away integer,
  match_date timestamp with time zone default timezone('utc'::text, now()),
  
  recorded_by text -- Admin who input the score
);

-- AUTOMATION: Trigger to update stats when a match is played
create or replace function update_player_stats() returns trigger as $$
begin
  -- Update HOME Player
  update league_players set 
    matches_played = matches_played + 1,
    goals_for = goals_for + new.score_home,
    goals_against = goals_against + new.score_away,
    clean_sheets = case when new.score_away = 0 then clean_sheets + 1 else clean_sheets end,
    wins = case when new.score_home > new.score_away then wins + 1 else wins end,
    draws = case when new.score_home = new.score_away then draws + 1 else draws end,
    losses = case when new.score_home < new.score_away then losses + 1 else losses end,
    points = points + case 
      when new.score_home > new.score_away then 3 
      when new.score_home = new.score_away then 1 
      else 0 
    end
  where id = new.player_home_id;

  -- Update AWAY Player
  update league_players set 
    matches_played = matches_played + 1,
    goals_for = goals_for + new.score_away,
    goals_against = goals_against + new.score_home,
    clean_sheets = case when new.score_home = 0 then clean_sheets + 1 else clean_sheets end,
    wins = case when new.score_away > new.score_home then wins + 1 else wins end,
    draws = case when new.score_away = new.score_home then draws + 1 else draws end,
    losses = case when new.score_away < new.score_home then losses + 1 else losses end,
    points = points + case 
      when new.score_away > new.score_home then 3 
      when new.score_away = new.score_home then 1 
      else 0 
    end
  where id = new.player_away_id;
  
  return new;
end;
$$ language plpgsql;

-- Bind Trigger
drop trigger if exists on_match_insert on league_matches;
create trigger on_match_insert
  after insert on league_matches
  for each row execute procedure update_player_stats();

-- 3. Security Policies (RLS)
alter table league_players enable row level security;
alter table league_matches enable row level security;

-- PUBLIC: Register (Insert) and Read Active Players
create policy "Public can register" on league_players 
  for insert with check (true);

create policy "Public can view active players" on league_players 
  for select using (status = 'active');

-- ADMIN: Full Access (Using Service Role or Authenticated Admin)
-- For simplicity in this setup, we assume Admin uses the Dashboard with elevated privileges
-- or we add a specific policy if using Supabase Auth users.
-- (We will refine this when implementing the Admin Dashboard)

-- 4. Standings Helper View
create or replace view view_standings as
select 
  username, 
  points, 
  matches_played, 
  wins, 
  draws, 
  losses, 
  goals_for, 
  goals_against, 
  (goals_for - goals_against) as goal_diff
from league_players
where status = 'active'
order by points desc, (goals_for - goals_against) desc, goals_for desc;

-- 5. ADMIN SECURITY (The "Vault")
-- We store the "Launch Keys" here. Not visible to public.
create table if not exists league_admins (
  username text primary key,
  secret_code text not null
);

-- Enable RLS but don't add policies (so nobody can read it directly via API)
alter table league_admins enable row level security;

-- Default Admin (You can add more rows in the Table Editor!)
insert into league_admins (username, secret_code) values ('admin', 'admin2026')
on conflict (username) do nothing;

-- SECURE FUNCTION: Check password
-- The frontend sends user+pass, this function checks it and returns TRUE/FALSE.
create or replace function verify_admin_access(input_user text, input_pass text) returns boolean as $$
declare
  stored_pass text;
begin
  select secret_code into stored_pass from league_admins where username = input_user;
  
  if stored_pass is null then
    return false;
  end if;
  
  return (stored_pass = input_pass);
end;
$$ language plpgsql security definer;
-- "security definer" means this function runs with God-mode privileges

