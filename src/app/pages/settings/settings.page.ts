import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/angular/standalone';
import {FooterNavigationComponent} from '../../shared/features/footer-navigation/footer-navigation.component';
import {SwUpdate} from '@angular/service-worker';
import {addIcons} from 'ionicons';
import {cloudDownloadOutline, settingsOutline} from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FooterNavigationComponent, IonButton, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonToggle]
})
export class SettingsPage {
  updateText = signal<string>('')
  yearOptions = Array.from({length: 30}, (_, i) => i + 1);
  selectedCount = Number(localStorage.getItem('release_years') || '3');
  selectedPrimary = localStorage.getItem('color-primary') || '#ffc815';
  selectedSecondary = localStorage.getItem('color-secondary') || '#0ce3ff';
  darkMode = localStorage.getItem('theme') === 'dark';

  constructor(private swUpdate: SwUpdate) {
    addIcons({
      'cloud-download-outline': cloudDownloadOutline,
      'settings-outline': settingsOutline,
    });
  }

  setColor(variable: 'primary' | 'secondary' | 'background', color: string) {
    const cssVar = variable === 'background' ? '--ion-background-color' : `--ion-color-${variable}`;
    document.documentElement.style.setProperty(cssVar, color);
    localStorage.setItem(`color-${variable}`, color);

    if (variable === 'primary') this.selectedPrimary = color;
    if (variable === 'secondary') this.selectedSecondary = color;
  }

  checkForUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate().then(hasUpdate => {
        if (hasUpdate) {
          this.swUpdate.activateUpdate().then(() => {
            document.location.reload();

            this.updateText.set('Update successfully installed')
            setTimeout(() => this.updateText.set(''), 3000)
          });
        } else {
          this.updateText.set('No update available')
          setTimeout(() => this.updateText.set(''), 3000)
        }
      });
    }
  }

  onChangeCount(count: number) {
    this.selectedCount = count;
    localStorage.setItem('release_years', String(count));
  }

  onColorChange(variable: 'primary' | 'secondary' | 'background', event: Event) {
    const input = event.target as HTMLInputElement;
    this.setColor(variable, input.value);
  }

  toggleDarkMode(enabled: boolean) {
    this.darkMode = enabled;

    const mode = enabled ? 'dark' : 'light';
    document.body.setAttribute('color-theme', mode);
    localStorage.setItem('theme', mode);
  }

  resetApp() {
    document.body.setAttribute('color-theme', 'dark');
    this.setColor('primary', '#ffc815');
    this.setColor('secondary', '#0ce3ff');
  }
}
