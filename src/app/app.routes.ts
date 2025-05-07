import {Routes} from '@angular/router';
import {CallbackPage} from './pages/callback/callback.page';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tab-artists/tab-artists.page').then((m) => m.TabArtistsPage),
  },
  {
    path: '',
    redirectTo: 'tab-artists',
    pathMatch: 'full',
  },
  {
    path: 'tab-artists',
    loadComponent: () => import('./pages/tab-artists/tab-artists.page').then(m => m.TabArtistsPage)
  },
  {
    path: 'tab-playlist',
    loadComponent: () => import('./pages/tab-playlist/tab-playlist.page').then(m => m.TabPlaylistPage)
  },

  {path: 'callback', component: CallbackPage},
];
