-- ============================================================
-- Gatchu Coffee - setup Supabase (idempotent, aman diulang)
-- Jalankan seluruh isi file ini di Dashboard -> SQL Editor.
-- Script 1/2: schema, tabel, RLS, bucket Storage
-- Script 2/2: seed data awal
-- ============================================================

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() ->> 'role', '') = 'admin';
$$;

create table if not exists public.brand_profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text not null,
  description text not null default '',
  logo_url text,
  address text,
  maps_url text,
  social_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  price_large numeric(12, 2) check (price_large is null or price_large >= 0),
  price_liter numeric(12, 2) check (price_liter is null or price_liter >= 0),
  note text,
  image_url text,
  is_available boolean not null default true,
  is_signature boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists price_large numeric(12, 2) check (price_large is null or price_large >= 0);
alter table public.products add column if not exists price_liter numeric(12, 2) check (price_liter is null or price_liter >= 0);
alter table public.products add column if not exists note text;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  order_type text not null check (order_type in ('pickup', 'delivery')),
  address text,
  notes text,
  total numeric(12, 2) not null default 0 check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'process', 'done', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  price numeric(12, 2) not null check (price >= 0),
  qty integer not null check (qty > 0),
  subtotal numeric(12, 2) not null check (subtotal >= 0)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  tags text[] not null default '{}',
  published boolean not null default false,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  type text not null default 'contact' check (type in ('contact', 'reservation')),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists posts_published_created_at_idx on public.posts(published, created_at desc);
create index if not exists messages_read_created_at_idx on public.messages(read, created_at desc);

create trigger brand_profile_set_updated_at
before update on public.brand_profile
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

alter table public.brand_profile enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.posts enable row level security;
alter table public.gallery enable row level security;
alter table public.messages enable row level security;

create policy "brand profile is publicly readable"
on public.brand_profile for select
using (true);

create policy "categories are publicly readable"
on public.categories for select
using (true);

create policy "products are publicly readable when available"
on public.products for select
using (is_available or public.is_admin());

create policy "published posts are publicly readable"
on public.posts for select
using (published or public.is_admin());

create policy "gallery is publicly readable"
on public.gallery for select
using (true);

create policy "customers can create orders"
on public.orders for insert
with check (true);

create policy "customers can add order items"
on public.order_items for insert
with check (exists (select 1 from public.orders where id = order_id));

create policy "customers can create messages"
on public.messages for insert
with check (true);

create policy "admins manage brand profile"
on public.brand_profile for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage categories"
on public.categories for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage products"
on public.products for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage orders"
on public.orders for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage order items"
on public.order_items for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage posts"
on public.posts for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage gallery"
on public.gallery for all
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage messages"
on public.messages for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('gallery', 'gallery', true),
  ('post-covers', 'post-covers', true)
on conflict (id) do update set public = excluded.public;

create policy "public can read product images"
on storage.objects for select
using (bucket_id in ('product-images', 'gallery', 'post-covers'));

create policy "admins can upload product images"
on storage.objects for insert
with check (
  bucket_id in ('product-images', 'gallery', 'post-covers')
  and public.is_admin()
);

create policy "admins can update product images"
on storage.objects for update
using (
  bucket_id in ('product-images', 'gallery', 'post-covers')
  and public.is_admin()
)
with check (
  bucket_id in ('product-images', 'gallery', 'post-covers')
  and public.is_admin()
);

create policy "admins can delete product images"
on storage.objects for delete
using (
  bucket_id in ('product-images', 'gallery', 'post-covers')
  and public.is_admin()
);


insert into public.brand_profile (name, tagline, description, address, maps_url, social_links)
select
  'Gatchu Coffee',
  'Rasa yang datang dari cerita.',
  'Kedai kopi lokal di Sawahan Timur, Kota Padang. Nikmati kopi di tempat atau bawa pulang.',
  'Jl. Perintis No.16, Sawahan Tim., Kec. Padang Tim., Kota Padang, Sumatera Barat 25126',
  'https://maps.app.goo.gl/d6AfRSh3rREWaEGB9',
  '{"instagram": "https://www.instagram.com/gatchucoffee.pdg/", "tiktok": "https://www.tiktok.com/@gatchu.coffee", "whatsapp": "https://wa.me/628236482947", "phone": "0823-6482-9497", "hours": "Senin-Sabtu 09.00-23.00 WIB, Minggu 12.00-22.00 WIB", "services": ["Takeaway", "Dine-in"]}'::jsonb
where not exists (select 1 from public.brand_profile);

update public.brand_profile
set
  tagline = 'Rasa yang datang dari cerita.',
  description = 'Kedai kopi lokal di Sawahan Timur, Kota Padang. Nikmati kopi di tempat atau bawa pulang.',
  address = 'Jl. Perintis No.16, Sawahan Tim., Kec. Padang Tim., Kota Padang, Sumatera Barat 25126',
  maps_url = 'https://maps.app.goo.gl/d6AfRSh3rREWaEGB9',
  social_links = '{"instagram": "https://www.instagram.com/gatchucoffee.pdg/", "tiktok": "https://www.tiktok.com/@gatchu.coffee", "whatsapp": "https://wa.me/628236482947", "phone": "0823-6482-9497", "hours": "Senin-Sabtu 09.00-23.00 WIB, Minggu 12.00-22.00 WIB", "services": ["Takeaway", "Dine-in"]}'::jsonb,
  updated_at = now()
where name = 'Gatchu Coffee';

insert into public.categories (name, slug, sort_order)
values
  ('Kopi Susu Gatchu', 'kopi-susu-gatchu', 1),
  ('Premium Coffee', 'premium-coffee', 2)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into public.products (category_id, name, slug, description, price, price_large, price_liter, note, is_available, is_signature)
select c.id, v.name, v.slug, v.description, v.price::numeric, v.price_large::numeric, v.price_liter::numeric, v.note, true, v.is_signature
from public.categories c
cross join (values
  ('Kopi Susu Gatchu', 'kopi-susu-gatchu', 'Susu kopi andalan Gatchu. Available juga dalam kemasan 1 liter.', 12000, 15000, 60000, null, true),
  ('Kopi Susu Gatchu Strong', 'kopi-susu-gatchu-strong', 'Versi lebih pekat untuk pencinta kopi susu yang kuat.', 15000, 18000, null, null, true)
) as v(name, slug, description, price, price_large, price_liter, note, is_signature)
where c.slug = 'kopi-susu-gatchu'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name, description = excluded.description, price = excluded.price, price_large = excluded.price_large, price_liter = excluded.price_liter, note = excluded.note, is_available = excluded.is_available, is_signature = excluded.is_signature;

insert into public.products (category_id, name, slug, description, price, price_large, price_liter, note, is_available, is_signature)
select c.id, v.name, v.slug, v.description, v.price::numeric, v.price_large::numeric, v.price_liter::numeric, v.note, true, v.is_signature
from public.categories c
cross join (values
  ('Americano', 'americano', 'Espresso tunggal dengan air panas, hitam atau dengan susu.', 10000, 15000, null, null, false),
  ('Cappuccino', 'cappuccino', 'Espresso, susu steamed, dan busa tipis.', 15000, 20000, null, null, false),
  ('Latte', 'latte', 'Espresso dengan susu steamed yang lembut.', 15000, 20000, null, null, false),
  ('Mochaccino', 'mochaccino', 'Perpaduan cokelat dan espresso dengan susu.', 15000, 20000, null, null, false),
  ('Butterscotch Aren Latte', 'butterscotch-aren-latte', 'Latte gula aren dengan aroma karamel.', 15000, null, null, 'Tersedia ukuran R', false),
  ('Chocolate', 'chocolate', 'Cokelat pekat dengan susu, bisa panas atau dingin.', 15000, 20000, null, null, false),
  ('Matcha', 'matcha', 'Green tea powder dengan susu.', 15000, 20000, null, null, false),
  ('Thai Tea', 'thai-tea', 'Teh Thailand dengan susu dan rempah.', 12000, 15000, null, null, false),
  ('Lychee Tea', 'lychee-tea', 'Teh leci ringan dengan rasa buah yang segar.', 12000, 15000, null, null, false)
) as v(name, slug, description, price, price_large, price_liter, note, is_signature)
where c.slug = 'premium-coffee'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name, description = excluded.description, price = excluded.price, price_large = excluded.price_large, price_liter = excluded.price_liter, note = excluded.note, is_available = excluded.is_available, is_signature = excluded.is_signature;

delete from public.products
where slug in ('cacao-nib-latte', 'gatchu-manual-brew', 'brown-sugar-cloud', 'contoh-signature-gatchu', 'contoh-manual-brew', 'contoh-minuman-dingin');

delete from public.categories
where slug in ('espresso', 'manual-brew', 'signature', 'snack');

insert into public.posts (title, slug, excerpt, content, tags, published)
values
  (
    'Catatan pertama dari Gatchu',
    'catatan-pertama-dari-gatchu',
    'Ruang untuk catatan Gatchu Coffee tentang kopi, tempat, dan cerita di balik cangkir.',
    'Placeholder. Ganti dengan artikel asli Gatchu sebelum go-live.',
    array['gatchu'],
    true
  ),
  (
    'Kisah di balik cangkir Gatchu',
    'kisah-di-balik-cangkir-gatchu',
    'Cerita singkat dari dapur dan bar Gatchu Coffee di Sawahan Timur, Padang.',
    'Placeholder. Ganti dengan artikel asli Gatchu sebelum go-live.',
    array['gatchu'],
    true
  )
on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content, tags = excluded.tags, published = excluded.published;
