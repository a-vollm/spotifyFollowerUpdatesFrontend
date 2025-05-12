import {Routes} from '@angular/router';
import {CallbackComponent} from './pages/callback/callback.component';
import {AuthGuard} from './shared/services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/tab-artists/tab-artists.page').then(m => m.TabArtistsPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'tab-playlist',
    loadComponent: () =>
      import('./pages/tab-playlist/tab-playlist.page').then(m => m.TabPlaylistPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.page').then(m => m.SettingsPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
  {path: '**', redirectTo: ''},
];
