import { Routes } from '@angular/router';
import { StoryListComponent } from './components/story-listv2/story-listv2';

export const routes: Routes = [
    { 
    path: '', 
    component: StoryListComponent // Usamos a lista de stories como a página inicial,
                                 // ou você pode aninhá-la em outro componente.
  },
];
