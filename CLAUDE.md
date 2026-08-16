# KIA-5D Vayu Vajra Service — project notes

Public information site for the BMTC **KIA-5D** route
(Kempegowda International Airport ↔ Art of Living).
Built on the KIA-15 site's design system so the two read as one product family.

## Stack
Vite 5 + React 18 + TypeScript + Tailwind 3 + shadcn/ui, copied from
`vayu-vajra-explorer`. Data fetched with **plain `fetch` to Supabase PostgREST**
and cached by the `@tanstack/react-query` already in the scaffold — deliberately
**no `@supabase/supabase-js` dependency**.

## GitHub
- `girishgangavara/kia5d-vayu-vajra-service` (**public** — was created private,
  owner made it public later)
- Push with a PAT belonging to **girishgangavara**.

## Vercel
- Project **kia5d-vayu-vajra-service** in team scope `girishs-projects-ab7d0d86`
  → `kia5d-vayu-vajra-service.vercel.app`
- **NOT git-connected.** Deploys have been manual from the local folder, so
  GitHub and production can drift. Connecting the repo in Project Settings → Git
  (the repo is private, so grant the GitHub App access) would fix this.
- `.vercel/project.json` holds `projectId` / `orgId`; `.vercel` is gitignored.

### Deploy gotcha — `--prod` hangs
`npx vercel --prod` and `vercel deploy --prod` **hang indefinitely** here: the
`npm exec` wrapper never spawns a worker (0 CPU, 0 open sockets), both before
and after login. Use this two-step instead:

```bash
npx vercel deploy --yes                 # → returns dpl_xxx, readyState READY
npx vercel promote dpl_xxx --yes        # moves it onto the production alias
```
Pipe to a file (`> /tmp/deploy.log 2>&1`), not to `tail` — `tail` buffers until
exit so the log looks empty while it runs.

## Data — Supabase `lfuthmexacgvbyjufbih`
Read over PostgREST with the public anon key (also embedded in the KIA admin
app). Everything on the site is live; nothing is hardcoded.

| Section | Table |
|---|---|
| Route stops | `KIA_Routes_Stops` (`routeNo = 'KIA-5D'`, 51 per direction) |
| Schedule | `KIA_5D_MORNING`, `KIA_5D_AFTERNOON` (`toAirport` = AOL→KIA, `toCity` = KIA→AOL) |
| Vehicle + crew | `kia_5d_routes` (published daily by a pg_cron job) |
| Live positions | `live_vehicle_positions` |

**Live tracking join:** the BMTC feed tags KIA-5D buses under the parent route
`KIA-5`, so filtering by `route_no` returns nothing. Match on **vehicle_number**
against today's assignment instead.

**`tripCode` decodes to time + direction:** `0740AOLKIAL` → 07:40 AOL→Airport;
`0510KIAAOL` → 05:10 Airport→AOL.

**Route numbers differ between tables** — `KIA-5D/1` vs `KIA-5D1`. Normalise
with `normaliseRoute()` in `src/lib/kia5d.ts` before joining.

## Privacy — do not undo
`kia_5d_routes` contains a `mobile` column with crew phone numbers. The query in
`src/lib/kia5d.ts` **names its columns explicitly and omits `mobile`**. Never
`select=*` on that table. The KIA-15 site publishes crew names without contact
numbers; match that.

## Outstanding
- **RLS is wide open**: the anon key can read crew phone numbers and write to
  some tables. Pre-existing, not introduced here, but worth tightening.
- Seed vehicle mapping in the original spec disagrees with live data (only 5D/2
  matched). Live data wins.
