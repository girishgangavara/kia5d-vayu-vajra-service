/**
 * KIA-5D data layer.
 *
 * Reads the same Supabase project the KIA Management System writes to, over the
 * PostgREST HTTP API so no extra client library is needed. Everything rendered
 * on the site comes from these tables - nothing is hardcoded or simulated.
 *
 *   KIA_5D_MORNING / KIA_5D_AFTERNOON  timetable (toAirport / toCity per route)
 *   kia_5d_routes                      today's crew + vehicle per route
 *   live_vehicle_positions             BMTC GPS feed
 *   route_stops                        stop list per route
 *
 * The crew `mobile` column is deliberately never selected - phone numbers are
 * personal data and the KIA-15 site does not publish them either.
 */

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://lfuthmexacgvbyjufbih.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdXRobWV4YWNndmJ5anVmYmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTkwMTYsImV4cCI6MjA3MzI3NTAxNn0.SMhKA1R9hv0ZAWDeo0V88jGt68y1gphElDuhvynbhZ0';

async function sb<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

/* ------------------------------------------------------------------ types */

export interface ScheduleRow {
  route: string;
  /** Art of Living -> Airport */
  toAirport: string | null;
  /** Airport -> Art of Living */
  toCity: string | null;
}

export interface AssignmentRow {
  route_no: string;
  vehicle_number: string | null;
  crew_name: string | null;
  crew_id: string | null;
  profilepic: string | null;
  tripCode: string | null;
  start_date: string | null;
  depot_no: string | null;
}

export interface PositionRow {
  route_no: string | null;
  vehicle_number: string | null;
  latitude: number | null;
  longitude: number | null;
  location_label: string | null;
  last_refresh_on: string | null;
  updated_at: string | null;
}

export interface StopRow {
  routeNo: string | null;
  stationName: string | null;
  stopOrder: number | null;
  /** 'to_airport' = Art of Living -> Airport, 'to_city' = Airport -> Art of Living */
  direction: string | null;
  latitude: number | null;
  longitude: number | null;
}

export type Direction = 'toAirport' | 'toCity';

/* --------------------------------------------------------------- fetchers */

export const fetchMorning = () =>
  sb<ScheduleRow[]>('KIA_5D_MORNING?select=route,toAirport,toCity&order=id');

export const fetchAfternoon = () =>
  sb<ScheduleRow[]>('KIA_5D_AFTERNOON?select=route,toAirport,toCity&order=id');

/** Today's published crew/vehicle rows. `mobile` is intentionally excluded. */
export const fetchAssignments = () =>
  sb<AssignmentRow[]>(
    'kia_5d_routes?select=route_no,vehicle_number,crew_name,crew_id,profilepic,tripCode,start_date,depot_no&order=route_no',
  );

export const fetchPositions = () =>
  sb<PositionRow[]>(
    'live_vehicle_positions?select=route_no,vehicle_number,latitude,longitude,location_label,last_refresh_on,updated_at',
  );

/** The 51 stops per direction that make up the KIA-5D corridor. */
export const fetchStops = () =>
  sb<StopRow[]>(
    'KIA_Routes_Stops?select=routeNo,stationName,stopOrder,direction,latitude,longitude&routeNo=eq.KIA-5D&order=stopOrder',
  );

/* ---------------------------------------------------------------- helpers */

/** Today's date in IST (YYYY-MM-DD), matching how the cron publishes rows. */
export function istToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** "KIA-5D/1" and "KIA-5D1" both normalise to "KIA5D1" so tables can be joined. */
export function normaliseRoute(route: string | null | undefined): string {
  return (route ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/** "KIA-5D1" / "KIA-5D/1" -> "1" (service number within the fleet). */
export function serviceNumber(route: string | null | undefined): string {
  const match = normaliseRoute(route).match(/5D(\d+)$/);
  return match ? match[1] : (route ?? '').trim();
}

/** "04.00AM" -> "04:00 AM". Returns null for blanks and "-" placeholders. */
export function formatTime(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value || value === '-') return null;
  const match = value.match(/^(\d{1,2})[.:](\d{2})\s*([AP]M)?$/i);
  if (!match) return value;
  const [, h, m, meridiem] = match;
  return `${h.padStart(2, '0')}:${m}${meridiem ? ` ${meridiem.toUpperCase()}` : ''}`;
}

/**
 * Trip codes encode departure time and direction, e.g.
 *   "0740AOLKIAL" -> 07:40, Art of Living -> Airport
 *   "0510KIAAOL"  -> 05:10, Airport -> Art of Living
 */
export function parseTripCode(
  code: string | null | undefined,
): { time: string; direction: Direction } | null {
  if (!code) return null;
  const match = code.trim().match(/^(\d{2})(\d{2})([A-Z]+)$/i);
  if (!match) return null;
  const [, hh, mm, leg] = match;
  const upper = leg.toUpperCase();
  const direction: Direction = upper.startsWith('AOL') ? 'toAirport' : 'toCity';
  return { time: `${hh}:${mm}`, direction };
}

/** Converts "HH:MM" (24h) to a display value such as "07:40 AM". */
export function to12Hour(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const meridiem = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${meridiem}`;
}

/** One entry per KIA-5D service, joining today's assignment to its schedule. */
export interface ServiceSummary {
  routeNo: string;
  serviceNo: string;
  vehicleNumber: string | null;
  crewName: string | null;
  crewId: string | null;
  photo: string | null;
  depotNo: string | null;
  trips: { time: string; direction: Direction }[];
  isToday: boolean;
}

/** Groups the flat assignment rows into one record per service. */
export function buildServices(rows: AssignmentRow[]): ServiceSummary[] {
  const today = istToday();
  const byRoute = new Map<string, ServiceSummary>();

  for (const row of rows) {
    const key = normaliseRoute(row.route_no);
    if (!key) continue;

    let entry = byRoute.get(key);
    if (!entry) {
      entry = {
        routeNo: row.route_no,
        serviceNo: serviceNumber(row.route_no),
        vehicleNumber: row.vehicle_number,
        crewName: row.crew_name,
        crewId: row.crew_id,
        photo: row.profilepic || null,
        depotNo: row.depot_no,
        trips: [],
        isToday: row.start_date === today,
      };
      byRoute.set(key, entry);
    }

    const trip = parseTripCode(row.tripCode);
    if (trip && !entry.trips.some(t => t.time === trip.time && t.direction === trip.direction)) {
      entry.trips.push(trip);
    }
  }

  for (const entry of byRoute.values()) {
    entry.trips.sort((a, b) => a.time.localeCompare(b.time));
  }

  return [...byRoute.values()].sort(
    (a, b) => Number(a.serviceNo) - Number(b.serviceNo) || a.routeNo.localeCompare(b.routeNo),
  );
}

/** Crew names are stored as "ಕನ್ನಡ / ENGLISH" - split so each script can be shown. */
export function splitCrewName(name: string | null): { kn: string | null; en: string | null } {
  if (!name) return { kn: null, en: null };
  const parts = name.split('/').map(p => p.trim()).filter(Boolean);
  if (parts.length < 2) return { kn: null, en: parts[0] ?? null };
  return { kn: parts[0], en: parts.slice(1).join(' / ') };
}
