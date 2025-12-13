import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  
  imports: [RouterOutlet,CommonModule],
  template: `
    <header style="padding: 15px; background: #fff; border-bottom: 1px solid #eee;">
      <h1 style="margin: 0; font-size: 1.5rem;">Social App Clone</h1>
    </header>

    <router-outlet></router-outlet>

    <footer style="padding: 10px; text-align: center; font-size: 0.8rem; color: #666;">
      Angular Stories Feature
    </footer>
  `,
  styleUrl: './app.less'
})
export class App {
  protected readonly title = signal('storyFeature');
}
