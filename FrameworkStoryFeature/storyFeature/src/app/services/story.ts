// src/app/services/story.service.ts
import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Story } from '../models/story.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private readonly STORAGE_KEY = 'my_stories_app';
  private readonly EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
  private platformId = inject(PLATFORM_ID);
  
  // Variável privada que armazena o status do ambiente
  private isBrowser = isPlatformBrowser(this.platformId);

  // Inicializa com uma lista vazia. O carregamento ocorre no construtor.
  private stories = signal<Story[]>([]); 
  stories$ = this.stories.asReadonly(); 

  constructor() {
    // 1. Carrega o estado apenas no browser
    if (this.isBrowser) {
      this.stories.set(this.loadStories());
    }
    // O comentário sobre 'Injector' pode ser removido, pois não é mais necessário
    // graças à inicialização do signal com [] e o uso de .set() no construtor.
  }

  /**
   * Métodos Auxiliares para LocalStorage
   * A lógica de proteção do browser é encapsulada aqui.
   */
  private loadStories(): Story[] {
    // Apenas carrega se estiver no browser (já garantido no construtor)
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    const allStories: Story[] = JSON.parse(data);
    const now = Date.now();
    
    // Filtra e verifica a expiração
    const validStories = allStories.filter(story => (now - story.timestamp) < this.EXPIRATION_MS);
    
    // Se o array mudou (stories expiraram), salva a versão limpa
    if (validStories.length !== allStories.length) {
      this.saveStories(validStories);
    }
    return validStories;
  }

  private saveStories(stories: Story[]): void {
    if (!this.isBrowser) return; // Guarda de browser, mas deve ser acessado por métodos internos seguros
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
  }


  /**
   * 💡 Método Público Principal: Adiciona um novo story.
   */
  async addStory(file: File) {
    if (!this.isBrowser) return; 

    try {
      // 1. Processa a imagem (converte e comprime)
      const base64Image = await this.processImage(file);
      
      const newStory: Story = {
        id: crypto.randomUUID(),
        imageUrl: base64Image,
        timestamp: Date.now()
      };
      
      // 2. Atualiza o Signal e o LocalStorage atomicamente
      this.stories.update(currentStories => {
        const updatedStories = [...currentStories, newStory];
        this.saveStories(updatedStories); // Atualiza o storage
        return updatedStories;
      });
      
    } catch (error) {
      console.error('Erro ao adicionar story:', error);
      // Opcional: Notificar o usuário
    }
  }

  /**
   * Utilitário para converter File -> Base64 (com Redimensionamento)
   * Agora aceita o 'File' diretamente e não base64
   */
  public processImage(file: File): Promise<string> {
    // A verificação do browser já está em addStory, mas mantemos para segurança
    if (!this.isBrowser) {
       return Promise.reject('API de arquivo não disponível no servidor.');
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Criação do canvas e lógica de redimensionamento...
          const elem = document.createElement('canvas');
          const maxWidth = 1080;
          const scaleFactor = maxWidth / img.width;
          elem.width = maxWidth;
          elem.height = img.height * scaleFactor;
          
          const ctx = elem.getContext('2d');
          ctx?.drawImage(img, 0, 0, elem.width, elem.height);
          
          resolve(ctx?.canvas.toDataURL('image/jpeg', 0.7) || '');
        };
      };
      reader.onerror = error => reject(error);
    });
  }
}