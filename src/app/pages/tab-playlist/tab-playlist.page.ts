import {Component, effect, OnInit, signal} from '@angular/core';
import {SpotifyService} from '../../shared/services/spotify.service';
import {
  IonAccordion,
  IonAccordionGroup,
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  IonSpinner,
  IonText,
  IonThumbnail,
  IonToolbar
} from '@ionic/angular/standalone';
import {DatePipe} from '@angular/common';
import {FooterNavigationComponent} from '../../shared/features/footer-navigation/footer-navigation.component';

export interface TrackItem {
  added_by?: {
    id?: string;
    display_name?: string;
  };

  [key: string]: any;
}

interface PlaylistTrack {
  added_at: string;
  added_by?: {
    id?: string;
    display_name?: string;
    [key: string]: any;
  };
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
    };
  };

  [key: string]: any;
}

@Component({
  selector: 'app-tab-playlist',
  templateUrl: './tab-playlist.page.html',
  styleUrls: ['./tab-playlist.page.scss'],
  imports: [
    IonContent,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    DatePipe,
    IonBadge,
    IonAccordionGroup,
    IonAccordion,
    FooterNavigationComponent,
    IonProgressBar,
    IonText,
    IonHeader,
    IonCardSubtitle,
    IonToolbar
  ]
})
export class TabPlaylistPage implements OnInit {
  playlistData = signal<any>(null);
  loading = signal<boolean>(true);
  playlistGroupedByMonth = signal<{ month: string; tracks: PlaylistTrack[] }[]>([]);
  lastMonthOpen = signal<string | undefined>(undefined)

  constructor(private spotifyService: SpotifyService) {
    effect(() => {
      const groups = this.playlistGroupedByMonth();
      if (groups.length) {
        this.lastMonthOpen.set(groups[0].month);
      }
    });
  }

  ngOnInit() {
    this.getPlaylistData();
  }

  getPlaylistData() {
    const playlistId = '4QTlILYEMucSKLHptGxjAq';
    this.spotifyService.getPlaylistData(playlistId).subscribe(
      (data) => {
        this.loading.set(false);
        const tracks = data['tracks'] as {
          added_by?: { id?: string; display_name?: string; [key: string]: any };
          [key: string]: any;
        }[];

        tracks.sort((a, b) => {
          const dateA = new Date(a['added_at']).getTime();
          const dateB = new Date(b['added_at']).getTime();
          return dateB - dateA;
        });

        const grouped = new Map<string, PlaylistTrack[]>();

        tracks.forEach((track) => {
          const date = new Date(track['added_at']);
          const key = date.toLocaleString('default', {month: 'long', year: 'numeric'});
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key)!.push(<PlaylistTrack>track);
        });

        const result = Array.from(grouped.entries()).map(([month, tracks]) => ({
          month,
          tracks,
        }));

        this.playlistGroupedByMonth.set(result);
        this.playlistData.set(data);
      },
      (error) => {
        console.error('Error loading playlist data', error);
        this.loading.set(false);
      }
    );
  }

  badgeColorMap = new Map<string, string>();

  getBadgeColor(userName: string): string {
    if (!this.badgeColorMap.has(userName)) {
      const color = this.generateColorFromName(userName);
      this.badgeColorMap.set(userName, color);
    }
    return this.badgeColorMap.get(userName)!;
  }

  generateColorFromName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 337;
    return `hsl(${hue}, 65%, 50%)`;
  }

}
