import { createResource, lazy } from 'solid-js';
import type { RouteDefinition } from 'solid-app-router';

import News from './pages/news';
import { useAuth } from './contexts/authContext';


export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: News,
  },
  {
    path: '/media/:id',
    component: lazy(() => import('./pages/fullMedia')),
  },
  {
    path: '/media-management',
    component: lazy(() => import('./pages/mediaManagement')),
  },
  {
    path: '/add-media',
    component: lazy(() => import('./pages/addMedia')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];