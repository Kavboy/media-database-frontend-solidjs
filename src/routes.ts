import { lazy } from 'solid-js';
import type { RouteDefinition } from 'solid-app-router';

import News from './pages/news';

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
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];