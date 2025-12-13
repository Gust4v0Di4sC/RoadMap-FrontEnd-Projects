// src/app/components/story-viewer/story-viewer.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import { Story } from '../../models/story.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-story-viewer',
  standalone: true,
  imports: [CommonModule], // Importa diretivas comuns
  templateUrl: './story-viewerv2.html',
  styleUrls: ['./story-viewerv2.less']
})
export class StoryViewerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) stories: Story[] = [];
  @Input({ required: true }) startIndex: number = 0;
  @Output() close = new EventEmitter<void>();

  // Usando Signals para estado local para reatividade otimizada
  currentIndex = signal(0);
  progress = signal(0); 

  intervalId: any;
  touchStartX: number = 0;

  ngOnInit() {
    this.currentIndex.set(this.startIndex);
    this.startTimer();
  }

  // 1. Método de Saída
  closeViewer() {
    this.close.emit(); // Emite o evento 'close'
  }
  
  // 2. Método de Swipe (Início)
  // O tipo 'TouchEvent' deve ser importado se o linter reclamar do tipo, mas
  // para compatibilidade básica, usar 'any' pode resolver rapidamente.
  onTouchStart(e: TouchEvent | any) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  // 3. Método de Swipe (Fim)
  onTouchEnd(e: TouchEvent | any) {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = this.touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) this.next(); // Swipe Left (Próximo)
      else this.prev();          // Swipe Right (Anterior)
    }
  }

  clearTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  get currentStory(): Story {
    // Pega o valor do Signal.
    return this.stories[this.currentIndex()]; 
  }

  startTimer() {
    this.clearTimer();
    this.progress.set(0); // Reinicia o progresso

    this.intervalId = setInterval(() => {
      // Atualiza o Signal
      this.progress.update(p => p + 1); 
      
      if (this.progress() >= 100) {
        this.next();
      }
    }, 30); // 30ms * 100 = 3000ms (3 segundos)
  }

  // ... (clearTimer, closeViewer, onTouchStart, onTouchEnd permanecem iguais)

  // Navegação: Atualiza o Signal
  next() {
    if (this.currentIndex() < this.stories.length - 1) {
      this.currentIndex.update(i => i + 1);
      this.startTimer();
    } else {
      this.closeViewer();
    }
  }

  trackById(index: number, story: Story): string {
    return story.id;
  }

  prev() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
      this.startTimer();
    } else {
      this.progress.set(0); // Reinicia o story atual
    }
  }

  // Lógica da Barra de Progresso Visual
  getProgress(index: number): number {
    const current = this.currentIndex(); // Pega o valor
    if (index < current) return 100;
    if (index > current) return 0;
    return this.progress(); // Pega o valor
  }
}