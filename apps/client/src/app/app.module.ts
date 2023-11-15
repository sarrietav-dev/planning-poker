import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateMatchFormComponent } from './create-match-form/create-match-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent, CreateMatchFormComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot({ url: environment.baseUrl }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
