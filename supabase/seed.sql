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
