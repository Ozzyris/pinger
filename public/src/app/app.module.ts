//INTERNAL PACKAGE
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

// VIEWS
import { AppComponent } from './app.component';
import { LandingComponent } from './views/landing/landing.component';
import { DiscoveryComponent } from './views/discovery/discovery.component';
import { MatchComponent } from './views/match/match.component';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';

//PIPES
import { Sanitizor_pipe } from './pipes/sanitizor/sanitizor.pipe';

const routes: Routes = [
  { path: 'landing', component: LandingComponent, data: { title: 'Pinger' } },
  { path: '',   redirectTo: 'landing', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'signup', component: SignupComponent, data: { title: 'Signup' } },
  { path: 'discovery', component: DiscoveryComponent, data: { title: 'Discovery' } },
  { path: 'match/:id', component: MatchComponent, data: { title: 'Match' } }
];


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    DiscoveryComponent,
    MatchComponent,
    LoginComponent,
    SignupComponent,
    Sanitizor_pipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
