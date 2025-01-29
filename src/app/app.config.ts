import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';



const firebaseConfig = {
  apiKey: "AIzaSyC3ekCY7wXqxUdjyOOko1wRzEnrYjnezBk",
  authDomain: "angularshop-29c69.firebaseapp.com",
  databaseURL: "https://angularshop-29c69-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "angularshop-29c69",
  storageBucket: "angularshop-29c69.appspot.com",
  messagingSenderId: "335201968693",
  appId: "1:335201968693:web:191dc27ff14953778b877c"
};

export const appConfig: ApplicationConfig = {
   providers: [
     provideZoneChangeDetection({ eventCoalescing: true }), 
     provideRouter(routes),
     provideFirebaseApp(() => initializeApp(firebaseConfig)),
     provideAuth(() => getAuth()),
     provideDatabase(() => getDatabase())
   ]
};
