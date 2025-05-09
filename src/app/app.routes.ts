import {CallbackComponent} from './pages/callback/callback.component';
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./pages/tab-artists/tab-artists.page').then(m => m.TabArtistsPage)
  },
  {
    path: 'tab-playlist',
    loadComponent: () => import('./pages/tab-playlist/tab-playlist.page').then(m => m.TabPlaylistPage)
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage)
  }
];
