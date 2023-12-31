import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateMatchFormComponent } from './pages/create/create-match-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { StoreModule } from '@ngrx/store';
import { matchReducer } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonComponent } from './components/atoms/button/button.component';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [AppComponent, CreateMatchFormComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot({ url: environment.baseUrl }),
    StoreModule.forRoot({ match: matchReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    BrowserAnimationsModule,
    ButtonComponent,
    EffectsModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
