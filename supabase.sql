-- Proses Akış & FMEA — Supabase kurulumu (YÖNETİCİ ONAYLI)
-- 1) supabase.com → ücretsiz proje oluştur
-- 2) SQL Editor → bu içeriği çalıştır
-- 3) Settings > API → URL + anon key → Akış-FMEA Çevrimiçi.html içindeki
--    BURAYA_PROJE_URL / BURAYA_ANON_KEY değerlerine yapıştır

-- ===== Veri tablosu =====
create table if not exists public.fmea_user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  data jsonb not null default '{}',
  approved boolean not null default false,
  is_admin boolean not null default false,
  updated_at timestamptz not null default now()
);

-- NOT: Hesap reddi isareti AYRI SUTUN DEGIL, data jsonb icindeki
--      data.hesapReddi alaninda tasinir. Boylece veritabani semasi
--      degistirilmeden reddetme kalici olur. Bu dosyayi yeniden
--      calistirmaniza gerek yoktur.

alter table public.fmea_user_data enable row level security;

-- ===== Yönetici tablosu (ilk kullanıcı otomatik yönetici) =====
create table if not exists public.fmea_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.fmea_admins enable row level security;

-- ===== Güvenli yönetici kontrolü (security definer, RLS bypass) =====
create or replace function public.is_fmea_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists(select 1 from public.fmea_admins where user_id = auth.uid());
$$;

-- ===== İlk kayıt olan → yönetici + onaylı trigger =====
create or replace function public.fmea_first_admin_trigger_fn()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare c int;
begin
  select count(*) into c from public.fmea_admins;
  if c = 0 then
    insert into public.fmea_admins (user_id) values (new.user_id);
    new.approved := true;
    new.is_admin := true;
  else
    new.approved := false;
    new.is_admin := false;
  end if;
  return new;
end;
$$;

drop trigger if exists fmea_first_admin_trigger on public.fmea_user_data;
create trigger fmea_first_admin_trigger
  before insert on public.fmea_user_data
  for each row
  execute function public.fmea_first_admin_trigger_fn();

-- ===== RLS politikaları — fmea_user_data =====
drop policy if exists "fmea_kendi_oku" on public.fmea_user_data;
create policy "fmea_kendi_oku"
  on public.fmea_user_data for select
  using (auth.uid() = user_id or public.is_fmea_admin());

drop policy if exists "fmea_kendi_insert" on public.fmea_user_data;
create policy "fmea_kendi_insert"
  on public.fmea_user_data for insert
  with check (auth.uid() = user_id);

-- kullanıcı kendi verisini güncelleyebilir; yönetici ise onayı/veriyi değiştirebilir
drop policy if exists "fmea_kendi_update" on public.fmea_user_data;
create policy "fmea_kendi_update"
  on public.fmea_user_data for update
  using (auth.uid() = user_id or public.is_fmea_admin())
  with check (auth.uid() = user_id or public.is_fmea_admin());

-- ===== RLS politikaları — fmea_admins =====
drop policy if exists "admin_oku" on public.fmea_admins;
create policy "admin_oku"
  on public.fmea_admins for select
  using (auth.uid() = user_id or public.is_fmea_admin());

drop policy if exists "admin_insert" on public.fmea_admins;
create policy "admin_insert"
  on public.fmea_admins for insert
  with check (auth.uid() = user_id and not public.is_fmea_admin());
