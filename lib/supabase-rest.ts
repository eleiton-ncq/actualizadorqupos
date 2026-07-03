type TableName = "update_campaigns" | "workers" | "clients";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

function endpoint(table: TableName, query = "select=*") {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL no esta configurada.");
  }

  return `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}?${query}`;
}

function headers(extra?: HeadersInit) {
  if (!supabaseKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY no esta configurada.");
  }

  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase respondio ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function selectRows<T>(table: TableName, query = "select=*") {
  const pageSize = 1000;
  const rows: T[] = [];

  for (let from = 0; ; from += pageSize) {
    const response = await fetch(endpoint(table, query), {
      headers: headers({
        Range: `${from}-${from + pageSize - 1}`,
      }),
      cache: "no-store",
    });
    const page = await parse<T[]>(response);
    rows.push(...page);

    if (page.length < pageSize) {
      break;
    }
  }

  return rows;
}

export async function insertRows<T>(table: TableName, rows: T | T[]) {
  const response = await fetch(endpoint(table), {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify(rows),
  });

  return parse<T[]>(response);
}

export async function upsertRows<T extends { id: string }>(
  table: TableName,
  rows: T | T[],
) {
  const response = await fetch(endpoint(table, "on_conflict=id"), {
    method: "POST",
    headers: headers({
      Prefer: "resolution=merge-duplicates,return=representation",
    }),
    body: JSON.stringify(rows),
  });

  return parse<T[]>(response);
}
