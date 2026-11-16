-- Ancesra's tables in Supabase. Paste this whole file into the project's
-- SQL Editor and press Run. Running it again is safe.
--
-- Row level security is ON with no policies: the tables can only be read or
-- written with the project's secret key, which lives in Vercel's environment
-- variables (lib/db.js). The publishable key and the public internet get nothing.

-- Everyone who filled the download popup on the website
create table if not exists signups (
  id      text primary key,
  time    timestamptz not null default now(),
  name    text not null,
  email   text not null,
  version text,
  place   text
);

-- Everyone who finished setup in the desktop app (2.7 and later)
create table if not exists app_users (
  install_id text primary key,
  time       timestamptz not null default now(),
  name       text not null,
  email      text not null,
  city       text,
  source     text,
  version    text
);

-- One row per install per day it was used: message counts only
create table if not exists app_pings (
  day        date not null,
  install_id text not null,
  version    text,
  chat       integer not null default 0,
  coding     integer not null default 0,
  debug      integer not null default 0,
  primary key (day, install_id)
);

alter table signups   enable row level security;
alter table app_users enable row level security;
alter table app_pings enable row level security;

-- App users with their days of use and message totals, for reading
create or replace view app_users_summary with (security_invoker = true) as
select u.time as set_up, u.name, u.email, u.city, u.source,
       coalesce(max(p.version), u.version) as version,
       count(p.day) as days_used, max(p.day) as last_used,
       coalesce(sum(p.chat), 0) as chat_messages,
       coalesce(sum(p.coding), 0) as coding_messages,
       coalesce(sum(p.debug), 0) as debug_messages
from app_users u left join app_pings p on p.install_id = u.install_id
group by u.install_id, u.time, u.name, u.email, u.city, u.source, u.version
order by u.time;
