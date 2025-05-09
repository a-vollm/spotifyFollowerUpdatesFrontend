import {Component, computed, effect, OnDestroy, signal} from '@angular/core';
import {SpotifyService} from '../../shared/services/spotify.service';
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
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
  IonSpinner,
  IonText,
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
    IonHeader, IonContent, IonSpinner,
    IonText, IonSegment, IonSegmentButton, IonProgressBar,
    IonSkeletonText, IonAccordionGroup, IonAccordion, IonItem,
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

  releases = signal<any[]>([]);
  loading = signal(true);
  isSwitchingView = false;
  progress = signal<any>({loading: true, totalArtists: 0, doneArtists: 0});
  lastMonthOpen = signal('');
  monthData = computed(() =>
    this.releases().map(group => {
      const filtered = group.releases.filter(r =>
        this.releaseType() === 'all' || r.album_type === this.releaseType()
      );
      const albumCount = filtered.filter(r => r.album_type === 'album').length;
      const singleCount = filtered.filter(r => r.album_type === 'single').length;
      const coverUrl = filtered[0]?.images[0]?.url || '';
      return {month: group.month, releases: filtered, albumCount, singleCount, coverUrl};
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
    let all = 0, album = 0, single = 0;
    this.monthData().forEach(g => {
      all += g.releases.length;
      album += g.albumCount;
      single += g.singleCount;
    });
    return {all, album, single};
  });

  badgeVisibility = computed(() => {
    const type = this.releaseType();
    return {showAlbums: type !== 'single', showSingles: type !== 'album'};
  });

  private unsubscribe: () => void;

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
    // this.spotify.onCacheUpdated(handler);
    // this.unsubscribe = () => this.spotify.socket.off('cacheUpdated', handler);

    effect(() => {
      if (!this.progress().loading) {
        this.loadYear(this.selectedYear());
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  async loadAll() {
    this.loading.set(true);
    try {
      const status = await this.spotify.getCacheStatus();
      this.progress.set(status);
      await this.loadYear(this.selectedYear());
    } catch (e) {
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadYear(year: string) {
    const data = await this.spotify.getReleases(year);
    // this.releases.set(data);
    // data.length ? this.lastMonthOpen.set(data[0].month) : undefined;
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

  openRelease(r) {
    r.external_urls?.spotify ? window.open(r.external_urls.spotify, '_blank') : undefined;
  }
}
