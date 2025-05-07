import {Routes} from '@angular/router';
import {CallbackPage} from './pages/callback/callback.page';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tab-artists/tab-artists.page').then((m) => m.TabArtistsPage),
  },
  {
    path: '',
    redirectTo: 'releases',
    pathMatch: 'full',
  },
  {
    path: 'releases',
    loadComponent: () => import('./pages/tab-artists/tab-artists.page').then(m => m.TabArtistsPage)
  },
  {
    path: 'tab-playlist',
    loadComponent: () => import('./pages/tab-playlist/tab-playlist.page').then(m => m.TabPlaylistPage)
  },

  {path: 'callback', component: CallbackPage},
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage)
  },
];
