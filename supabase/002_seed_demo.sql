insert into public.update_campaigns (id, name, status, created_at)
values (
  'campaign-actualizacion-datos',
  'Actualizacion de datos',
  'active',
  '2026-07-03T10:00:00.000Z'
)
on conflict (id) do update set
  name = excluded.name,
  status = excluded.status;

insert into public.workers (id, name, access_key, is_active, created_at)
values
  ('worker-ana', 'Ana Morales', 'ana-demo-2026', true, '2026-07-03T10:00:00.000Z'),
  ('worker-bruno', 'Bruno Castro', 'bruno-demo-2026', true, '2026-07-03T10:00:00.000Z'),
  ('worker-carla', 'Carla Vega', 'carla-demo-2026', true, '2026-07-03T10:00:00.000Z'),
  ('worker-diego', 'Diego Solis', 'diego-demo-2026', true, '2026-07-03T10:00:00.000Z')
on conflict (id) do update set
  name = excluded.name,
  access_key = excluded.access_key,
  is_active = excluded.is_active;

with seed as (
  select
    item,
    ('client-' || lpad(item::text, 2, '0')) as id,
    (array['worker-ana', 'worker-bruno', 'worker-carla', 'worker-diego'])[
      ((item - 1) % 4) + 1
    ] as worker_id,
    (array[
      'Almacen Central',
      'Clinica Santa Lucia',
      'Transportes Rivera',
      'Cafe Montano',
      'Ferreteria El Roble',
      'Soluciones Beta',
      'Panaderia La Espiga',
      'Servicios Luna',
      'Distribuidora Norte',
      'Textiles Prisma',
      'Auto Repuestos Vega',
      'Agroinsumos Verde',
      'Constructora Horizonte',
      'Muebles Aurora',
      'Optica Vista Clara',
      'Farmacia Los Pinos',
      'Hotel Bahia Azul',
      'Importadora Pacifico',
      'Electro Hogar',
      'Super Centro Uno'
    ])[((item - 1) % 20) + 1] as company
  from generate_series(1, 40) as item
)
insert into public.clients (
  id,
  campaign_id,
  assigned_worker_id,
  client_name,
  identification,
  current_phone,
  current_email,
  current_address,
  company_name,
  updated_phone,
  updated_email,
  updated_address,
  updated_contact_name,
  observations,
  status,
  started_at,
  completed_at,
  created_at,
  updated_at
)
select
  id,
  'campaign-actualizacion-datos',
  worker_id,
  company || ' ' || item,
  'J-' || (310100000 + item - 1)::text,
  '+506 22' || lpad((100000 + (item - 1) * 317)::text, 6, '0'),
  'contacto' || item || '@demo-clientes.com',
  'Calle ' || (item + 10)::text || ', zona comercial ' || (((item - 1) % 5) + 1)::text,
  company || ' S.A.',
  case when item <= 8 then '+506 88' || lpad((700000 + item - 1)::text, 6, '0') end,
  case when item <= 8 then 'actualizado' || item || '@demo-clientes.com' end,
  case when item <= 8 then 'Direccion validada ' || item end,
  case when item <= 8 then 'Contacto ' || item end,
  case when item <= 8 then 'Registro demo completado.' end,
  case
    when item <= 8 then 'completed'
    when item <= 12 then 'in_progress'
    else 'pending'
  end,
  case when item <= 12 then '2026-07-03T10:00:00.000Z'::timestamptz end,
  case when item <= 8 then '2026-07-03T10:00:00.000Z'::timestamptz end,
  '2026-07-03T10:00:00.000Z',
  '2026-07-03T10:00:00.000Z'
from seed
on conflict (id) do update set
  assigned_worker_id = excluded.assigned_worker_id,
  client_name = excluded.client_name,
  identification = excluded.identification,
  current_phone = excluded.current_phone,
  current_email = excluded.current_email,
  current_address = excluded.current_address,
  company_name = excluded.company_name,
  status = excluded.status,
  updated_at = excluded.updated_at;
