# KIA-5D Vayu Vajra Service

Public information site for the BMTC **KIA-5D** Vayu Vajra route:
**Kempegowda International Airport ↔ Art of Living**.

It reuses the KIA-15 Vayu Vajra site's design system (Vite + React + TypeScript +
Tailwind + shadcn/ui) so the two sites read as one product family.

## Data

Every figure on the page is read live from the Vayu Vajra API (vayuvajra.girishdevstack.com) that the KIA
Management System writes to - nothing is hardcoded:

| Section       | Source                                        |
|---------------|-----------------------------------------------|
| Route stops   | `KIA_Routes_Stops` (`routeNo = 'KIA-5D'`)     |
| Schedule      | `KIA_5D_MORNING`, `KIA_5D_AFTERNOON`          |
| Vehicles      | `kia_5d_routes`                               |
| Crew          | `kia_5d_routes`                               |
| Live tracking | `live_vehicle_positions`, matched by vehicle  |

Crew phone numbers (`mobile`) are deliberately never queried or displayed.

Every data-backed section renders explicit loading / error / empty states; no
placeholder or sample data is ever shown.

## Develop

```sh
npm install
npm run dev
```

Optional overrides (defaults point at the Vayu Vajra API):

```sh
VITE_API_URL=...
VITE_API_KEY=...
```

## Build

```sh
npm run build
```

Deploys as a static SPA; `vercel.json` provides the client-routing fallback.
