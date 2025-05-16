import {Component, computed, effect, OnDestroy, signal, untracked} from '@angular/core';
import {CacheStatus, MonthGroup, SpotifyService} from '../../shared/services/spotify.service';
import {
  IonAccordion,
  IonAccordionGroup,
  IonAvatar,
  IonBadge,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
  IonToolbar
} from '@ionic/angular/standalone';
import {DatePipe} from '@angular/common';
import {addIcons} from 'ionicons';
import {
  calendarOutline,
  chevronDownOutline,
  chevronForwardOutline,
  discOutline,
  musicalNotesOutline,
  refreshOutline
} from 'ionicons/icons';
import {SegmentValue} from '@ionic/angular';
import {FooterNavigationComponent} from '../../shared/features/footer-navigation/footer-navigation.component';

@Component({
  selector: 'app-tab-artists',
  templateUrl: './tab-artists.page.html',
  imports: [
    IonHeader, IonContent, IonSegment, IonSegmentButton, IonSkeletonText, IonAccordionGroup, IonAccordion, IonItem,
    IonIcon, IonBadge, IonList, IonAvatar, IonNote,
    IonCard, IonCardContent, DatePipe, IonLabel, FooterNavigationComponent, IonToolbar
  ],
  styleUrls: ['./tab-artists.page.scss']
})
export class TabArtistsPage implements OnDestroy {
  years = signal(
    Array.from({length: 3}, (_, i) => String(new Date().getFullYear() - i))
  );
  selectedYear = signal(this.years()[0]);
  releaseType = signal<'all' | 'album' | 'single'>('all');

  releases = signal<MonthGroup[]>([]);
  loading = signal(true);
  isSwitchingView = false;
  progress = signal<CacheStatus>({loading: true, totalArtists: 0, doneArtists: 0});
  lastMonthOpen = signal('');
  rawReleases = signal<MonthGroup[]>([]);
  monthData = computed(() =>
    this.rawReleases().map(group => {
      const allReleases = group.releases;

      const filtered = allReleases
        .filter(r => this.releaseType() === 'all' || r.album_type === this.releaseType())
        .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());

      const albumCount = allReleases.filter(r => r.album_type === 'album').length;
      const singleCount = allReleases.filter(r => r.album_type === 'single').length;
      const coverUrl = filtered[0]?.images[0]?.url || '';

      return {
        month: group.month,
        releases: filtered,
        albumCount,
        singleCount,
        coverUrl
      };
    }).filter(g => g.releases.length > 0)
  );


  progressText = computed(() => {
    const p = this.progress();
    return `${p.doneArtists} of ${p.totalArtists} artists loaded`;
  });

  progressValue = computed(() => {
    const p = this.progress();
    return p.totalArtists > 0 ? p.doneArtists / p.totalArtists : 0;
  });

  totalCounts = computed(() => {
    let album = 0, single = 0;
    this.rawReleases().forEach(g => {
      album += g.releases.filter(r => r.album_type === 'album').length;
      single += g.releases.filter(r => r.album_type === 'single').length;
    });
    return {
      all: album + single,
      album,
      single
    };
  });

  badgeVisibility = computed(() => {
    const type = this.releaseType();
    return {showAlbums: type !== 'single', showSingles: type !== 'album'};
  });

  private readonly unsubscribe: () => void;

  constructor(private spotify: SpotifyService) {
    addIcons({
      'musical-notes': musicalNotesOutline,
      disc: discOutline,
      refresh: refreshOutline,
      'chevron-down': chevronDownOutline,
      'chevron-forward': chevronForwardOutline,
      calendar: calendarOutline
    });

    this.loadAll();
    const handler = () => this.loadAll();
    this.spotify.onCacheUpdated(handler);
    this.unsubscribe = () => this.spotify.socket.off('cacheUpdated', handler);

    effect(() => {
      const {total, done} = this.spotify.cacheProgress();
      const cur = untracked(this.progress);

      if (cur.totalArtists !== total || cur.doneArtists !== done) {
        this.progress.set({
          ...cur,
          totalArtists: total,
          doneArtists: done
        });
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  async loadAll() {
    this.loading.set(true);

    try {
      const status = await this.spotify.getCacheStatus(); // ← einmal reicht
      this.progress.set(status);

      if (!status.loading) {
        await this.loadYear(this.selectedYear());
        this.loading.set(false);
      }
    } catch (e) {
      console.error(e);
      this.loading.set(false);
    }
  }

  private async loadYear(year: string) {
    const data = await this.spotify.getReleasesForYear(year);
    this.rawReleases.set(data);
    this.releases.set(data);
    data.length ? this.lastMonthOpen.set(data[0].month) : undefined;
  }

  selectYear(value: string | number) {
    this.isSwitchingView = true;
    this.selectedYear.set(String(value));

    setTimeout(() => {
      this.isSwitchingView = false;
      const groups = this.monthData();
      this.lastMonthOpen.set(groups[0]?.month);
    }, 500);
  }

  setReleaseType(value: SegmentValue) {
    this.isSwitchingView = true;
    this.releaseType.set(String(value) as 'all' | 'album' | 'single');
    setTimeout(() => this.isSwitchingView = false);
  }

  openRelease(r: MonthGroup['releases'][0]) {
    if (r.external_urls?.spotify) {
      window.location.href = r.external_urls.spotify;
    }
  }
}
