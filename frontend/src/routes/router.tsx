import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { HomePage } from '../pages/HomePage';
import { DeveloperPage } from '../pages/DeveloperPage';
import { NetworkPage } from '../pages/NetworkPage';
import { ConnectionsPage } from '../pages/ConnectionsPage';
import { TechnologyPage } from '../pages/TechnologyPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/connections', element: <ConnectionsPage /> },
      { path: '/technologies/:name', element: <TechnologyPage /> },
      { path: '/developers/:username', element: <DeveloperPage /> },
      { path: '/developers/:username/network', element: <NetworkPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
