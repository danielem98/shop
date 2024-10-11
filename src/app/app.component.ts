import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BsNavbarComponent } from "./components/bs-navbar/bs-navbar.component";
import { HomeComponent } from "./components/home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BsNavbarComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'shop';
}
