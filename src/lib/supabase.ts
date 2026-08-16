const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const getHeaders = (isWrite = false) => ({
  'apikey': SUPABASE_PUBLISHABLE_KEY,
  'Authorization': `Bearer ${SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY}`,
  'Content-Type': 'application/json',
  ...(isWrite ? { 'Prefer': 'return=representation, resolution=merge-duplicates' } : {}),
});

/**
 * Generic Supabase PostgREST query helper
 */
export async function supabaseFetch<T = any>(table: string, options: { method?: string; body?: any; query?: string } = {}): Promise<T | null> {
  if (!SUPABASE_URL) return null;
  const method = options.method || 'GET';
  const queryString = options.query ? `?${options.query}` : '';
  const url = `${SUPABASE_URL}/rest/v1/${table}${queryString}`;

  try {
    const res = await fetch(url, {
      method,
      headers: getHeaders(method !== 'GET'),
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[Supabase ${method} ${table} ${res.status}]:`, errText);
      return null;
    }

    const data = await res.json().catch(() => null);
    return data as T;
  } catch (error) {
    console.error(`[Supabase Fetch Error ${table}]:`, error);
    return null;
  }
}

/**
 * Fetch CMS content from Supabase
 */
export async function getSupabaseCMS(): Promise<Record<string, string> | null> {
  const rows = await supabaseFetch<Array<{ key: string; value: string }>>('site_content');
  if (!rows || !Array.isArray(rows) || rows.length === 0) return null;
  
  const map: Record<string, string> = {};
  rows.forEach((r) => {
    map[r.key] = r.value;
  });
  return map;
}

/**
 * Save CMS key-value pairs to Supabase
 */
export async function saveSupabaseCMS(cmsMap: Record<string, string>): Promise<boolean> {
  const payload = Object.entries(cmsMap).map(([key, value]) => ({ key, value }));
  const res = await supabaseFetch('site_content', {
    method: 'POST',
    query: 'on_conflict=key',
    body: payload,
  });
  return res !== null;
}

/**
 * Fetch Fleet Cars from Supabase
 */
export async function getSupabaseCars(): Promise<any[] | null> {
  const rows = await supabaseFetch<any[]>('cars', { query: 'select=*&order=created_at.desc' });
  return Array.isArray(rows) && rows.length > 0 ? rows : null;
}

/**
 * Save a Car to Supabase
 */
export async function saveSupabaseCar(car: any): Promise<boolean> {
  const res = await supabaseFetch('cars', {
    method: 'POST',
    query: 'on_conflict=id',
    body: [car],
  });
  return res !== null;
}

/**
 * Fetch Testimonials from Supabase
 */
export async function getSupabaseTestimonials(): Promise<any[] | null> {
  const rows = await supabaseFetch<any[]>('testimonials', { query: 'select=*&order=created_at.desc' });
  return Array.isArray(rows) && rows.length > 0 ? rows : null;
}

/**
 * Save a Testimonial to Supabase
 */
export async function saveSupabaseTestimonial(testimonial: any): Promise<boolean> {
  const res = await supabaseFetch('testimonials', {
    method: 'POST',
    query: 'on_conflict=id',
    body: [testimonial],
  });
  return res !== null;
}

/**
 * Save a Lead to Supabase
 */
export async function saveSupabaseLead(lead: any): Promise<boolean> {
  const res = await supabaseFetch('leads', {
    method: 'POST',
    query: 'on_conflict=id',
    body: [lead],
  });
  return res !== null;
}
