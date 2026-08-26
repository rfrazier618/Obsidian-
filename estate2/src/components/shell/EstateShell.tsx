import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { GlobalNav } from './GlobalNav';
import { EstateExplorer } from './EstateExplorer';
import { EstateModal } from '@/components/primitives/EstateModal';
import { ToastStack } from '@/components/primitives/Toast';

/**
 * The app shell: Global Navigation (always present) + Estate Explorer
 * (toggled) + whatever room the router resolves into <Outlet/> + the
 * one modal and one toast surface, both global. Every route renders
 * inside this shell, so the three navigation layers and the shared
 * overlay primitives are never re-created per room.
 */
export function EstateShell() {
  const [explorerOpen, setExplorerOpen] = useState(false);

  return (
    <>
      <GlobalNav onOpenExplorer={() => setExplorerOpen(true)} />
      <Outlet />
      <EstateExplorer open={explorerOpen} onClose={() => setExplorerOpen(false)} />
      <EstateModal />
      <ToastStack />
    </>
  );
}
