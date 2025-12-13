// src/app/components/story-list/story-list.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa diretivas comuns
import { StoryService } from '../../services/story';
import { StoryViewerComponent } from '../story-viewerv2/story-viewerv2'; // Importa o viewer

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [CommonModule, StoryViewerComponent], // Importa módulos/componentes usados
  templateUrl: './story-listv2.html',
  styleUrls: ['./story-listv2.less']
})
export class StoryListComponent {
  // 1. Injeção moderna (funciona no constructor, mas o inject() é preferido fora dele no contexto de Signals)
  private storyService = inject(StoryService);
  
  // 2. Acessando o Signal diretamente. Não precisamos mais do async pipe!
  stories = this.storyService.stories$; 

  isViewerOpen = false;
  selectedIndex = 0;

  // Lógica de Upload permanece a mesma, mas usa o Signal Service
  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
    
      this.storyService.addStory(file);
    }
  }

  openViewer(index: number) {
    this.selectedIndex = index;
    this.isViewerOpen = true;
  }

  closeViewer() {
    this.isViewerOpen = false;
  }
}