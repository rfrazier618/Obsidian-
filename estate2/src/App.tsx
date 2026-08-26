import { Routes, Route } from 'react-router-dom';
import { REGISTRY } from '@/registry/data';
import { EstateShell } from '@/components/shell/EstateShell';
import { RoomRoute, UnknownRoute } from '@/routes/RoomRoute';
import { Hub } from '@/routes/Hub';

/**
 * Routes are generated FROM the Registry, not hand-declared per room.
 * Adding a destination to registry/data.ts is enough for it to resolve
 * directly by URL — there is no second list of routes to keep in sync.
 *
 * Only destinations with a route get a page — `status:'planned'` stubs
 * and `route:null` reference-only entries (registered for Directory/
 * canon completeness, e.g. a threshold gate) correctly get no route at
 * all, rather than a blank or 404-ing page.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<EstateShell />}>
        {REGISTRY.filter((d) => d.status === 'live' && d.route).map((d) =>
          d.id === 'estate-hall' ? (
            <Route key={d.id} path={d.route!} element={<Hub />} />
          ) : (
            <Route key={d.id} path={d.route!} element={<RoomRoute destinationId={d.id} />} />
          )
        )}
        <Route path="*" element={<UnknownRoute />} />
      </Route>
    </Routes>
  );
}
