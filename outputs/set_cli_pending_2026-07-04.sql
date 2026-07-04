-- Marca estos clientes como pendientes para que vuelvan a gestionarse.
-- Primero corre el SELECT de preview. Luego corre el UPDATE.
-- El UPDATE limpia la asignacion y completed_at, pero conserva datos/observaciones.

with target_cli(cli_code) as (
  values
    ('CLI1505'),
    ('CLI1642'),
    ('CLI1422'),
    ('CLI2506'),
    ('CLI2326'),
    ('CLI1380'),
    ('CLI1659'),
    ('CLI2285'),
    ('CLI1627'),
    ('CLI3747'),
    ('CLI1590'),
    ('CLI2181'),
    ('CLI0330'),
    ('CLI0677'),
    ('CLI0528'),
    ('CLI1873'),
    ('CLI3212'),
    ('CLI3144'),
    ('CLI0084'),
    ('CLI1046'),
    ('CLI2259'),
    ('CLI2692'),
    ('CLI1872'),
    ('CLI1114'),
    ('CLI0837'),
    ('CLI2861'),
    ('CLI1798'),
    ('CLI3362'),
    ('CLI4202'),
    ('CLI1946'),
    ('CLI4110'),
    ('CLI1814'),
    ('CLI1020'),
    ('CLI1766'),
    ('CLI1823'),
    ('CLI1773'),
    ('CLI1822'),
    ('CLI3460'),
    ('CLI2021'),
    ('CLI1964')
)
select
  t.cli_code as solicitado,
  c.id,
  c.client_name,
  c.company_name,
  c.status,
  c.assigned_worker_id,
  c.completed_at
from target_cli t
left join public.clients c on c.cli_code = t.cli_code
order by t.cli_code;

-- Si el preview esta correcto, ejecuta esto:
with target_cli(cli_code) as (
  values
    ('CLI1505'),
    ('CLI1642'),
    ('CLI1422'),
    ('CLI2506'),
    ('CLI2326'),
    ('CLI1380'),
    ('CLI1659'),
    ('CLI2285'),
    ('CLI1627'),
    ('CLI3747'),
    ('CLI1590'),
    ('CLI2181'),
    ('CLI0330'),
    ('CLI0677'),
    ('CLI0528'),
    ('CLI1873'),
    ('CLI3212'),
    ('CLI3144'),
    ('CLI0084'),
    ('CLI1046'),
    ('CLI2259'),
    ('CLI2692'),
    ('CLI1872'),
    ('CLI1114'),
    ('CLI0837'),
    ('CLI2861'),
    ('CLI1798'),
    ('CLI3362'),
    ('CLI4202'),
    ('CLI1946'),
    ('CLI4110'),
    ('CLI1814'),
    ('CLI1020'),
    ('CLI1766'),
    ('CLI1823'),
    ('CLI1773'),
    ('CLI1822'),
    ('CLI3460'),
    ('CLI2021'),
    ('CLI1964')
)
update public.clients c
set
  status = 'pending',
  assigned_worker_id = null,
  completed_at = null,
  updated_at = now()
from target_cli t
where c.cli_code = t.cli_code
returning
  c.cli_code,
  c.client_name,
  c.status,
  c.assigned_worker_id,
  c.completed_at;
