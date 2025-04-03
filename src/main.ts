import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; // importa config com roteador + http


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

