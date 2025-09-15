#!/usr/bin/env python3
"""
Mini Internet Browser
Navegador simples para a Mini Internet usando Python + Tkinter
"""

import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
import urllib.request
import urllib.parse
import urllib.error
import html
import re
import json
import os
from datetime import datetime
import threading
import webbrowser

class MiniBrowser:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Mini Internet Browser")
        self.root.geometry("1000x700")
        self.root.minsize(800, 600)
        
        # Variáveis
        self.current_url = tk.StringVar()
        self.loading = False
        self.history = []
        self.history_index = -1
        self.favorites = self.load_favorites()
        
        # Sites pré-definidos da mini internet
        self.default_sites = [
            "http://miniinternet.local",
            "http://servidor.miniinternet.local",
            "http://site1.miniinternet.local",
            "http://blog.miniinternet.local",
            "http://loja.miniinternet.local",
            "http://10.0.0.1"
        ]
        
        self.setup_ui()
        self.load_homepage()
        
    def setup_ui(self):
        """Configura a interface do usuário"""
        
        # Frame principal
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Barra de ferramentas
        toolbar = ttk.Frame(main_frame)
        toolbar.pack(fill=tk.X, pady=(0, 5))
        
        # Botões de navegação
        nav_frame = ttk.Frame(toolbar)
        nav_frame.pack(side=tk.LEFT)
        
        self.back_btn = ttk.Button(nav_frame, text="◀", command=self.go_back, width=3)
        self.back_btn.pack(side=tk.LEFT, padx=(0, 2))
        
        self.forward_btn = ttk.Button(nav_frame, text="▶", command=self.go_forward, width=3)
        self.forward_btn.pack(side=tk.LEFT, padx=(0, 5))
        
        self.refresh_btn = ttk.Button(nav_frame, text="🔄", command=self.refresh, width=3)
        self.refresh_btn.pack(side=tk.LEFT, padx=(0, 5))
        
        self.home_btn = ttk.Button(nav_frame, text="🏠", command=self.load_homepage, width=3)
        self.home_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        # Barra de endereços
        url_frame = ttk.Frame(toolbar)
        url_frame.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))
        
        self.url_entry = ttk.Entry(url_frame, textvariable=self.current_url, font=("Arial", 10))
        self.url_entry.pack(fill=tk.X)
        self.url_entry.bind('<Return>', lambda e: self.navigate_to_url())
        
        # Botões adicionais
        action_frame = ttk.Frame(toolbar)
        action_frame.pack(side=tk.RIGHT)
        
        self.go_btn = ttk.Button(action_frame, text="Ir", command=self.navigate_to_url)
        self.go_btn.pack(side=tk.LEFT, padx=(0, 5))
        
        self.fav_btn = ttk.Button(action_frame, text="⭐", command=self.add_favorite, width=3)
        self.fav_btn.pack(side=tk.LEFT, padx=(0, 2))
        
        self.menu_btn = ttk.Button(action_frame, text="☰", command=self.show_menu, width=3)
        self.menu_btn.pack(side=tk.LEFT)
        
        # Frame de conteúdo com abas
        content_frame = ttk.Frame(main_frame)
        content_frame.pack(fill=tk.BOTH, expand=True)
        
        # Notebook para abas
        self.notebook = ttk.Notebook(content_frame)
        self.notebook.pack(fill=tk.BOTH, expand=True)
        
        # Primeira aba
        self.create_new_tab("Página Inicial")
        
        # Barra de status
        self.status_bar = ttk.Label(main_frame, text="Pronto", relief=tk.SUNKEN)
        self.status_bar.pack(fill=tk.X, pady=(5, 0))
        
        # Atualizar estado dos botões
        self.update_button_states()
        
    def create_new_tab(self, title="Nova Aba"):
        """Cria uma nova aba"""
        tab_frame = ttk.Frame(self.notebook)
        
        # Text widget para mostrar conteúdo
        text_frame = ttk.Frame(tab_frame)
        text_frame.pack(fill=tk.BOTH, expand=True)
        
        text_widget = tk.Text(text_frame, wrap=tk.WORD, font=("Arial", 11), 
                             bg="white", fg="black", padx=10, pady=10)
        scrollbar = ttk.Scrollbar(text_frame, orient=tk.VERTICAL, command=text_widget.yview)
        text_widget.configure(yscrollcommand=scrollbar.set)
        
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        text_widget.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        self.notebook.add(tab_frame, text=title)
        tab_frame.text_widget = text_widget
        
        return tab_frame
        
    def get_current_tab(self):
        """Retorna a aba atual"""
        current_tab_id = self.notebook.select()
        if current_tab_id:
            return self.notebook.nametowidget(current_tab_id)
        return None
        
    def navigate_to_url(self, url=None):
        """Navega para uma URL"""
        if url is None:
            url = self.current_url.get().strip()
            
        if not url:
            return
            
        # Adicionar http:// se não tiver protocolo
        if not url.startswith(('http://', 'https://')):
            url = 'http://' + url
            
        self.current_url.set(url)
        self.load_page(url)
        
    def load_page(self, url):
        """Carrega uma página"""
        if self.loading:
            return
            
        self.loading = True
        self.status_bar.config(text=f"Carregando {url}...")
        
        # Executar em thread separada para não travar a interface
        thread = threading.Thread(target=self._load_page_thread, args=(url,))
        thread.daemon = True
        thread.start()
        
    def _load_page_thread(self, url):
        """Thread para carregar página"""
        try:
            # Fazer requisição
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mini Internet Browser 1.0'
            })
            
            with urllib.request.urlopen(req, timeout=10) as response:
                content = response.read().decode('utf-8', errors='ignore')
                content_type = response.headers.get('content-type', '')
                
            # Atualizar UI na thread principal
            self.root.after(0, self._display_content, url, content, content_type)
            
        except urllib.error.HTTPError as e:
            error_msg = f"Erro HTTP {e.code}: {e.reason}"
            self.root.after(0, self._display_error, url, error_msg)
            
        except urllib.error.URLError as e:
            error_msg = f"Erro de conexão: {e.reason}"
            self.root.after(0, self._display_error, url, error_msg)
            
        except Exception as e:
            error_msg = f"Erro: {str(e)}"
            self.root.after(0, self._display_error, url, error_msg)
            
    def _display_content(self, url, content, content_type):
        """Exibe o conteúdo carregado"""
        current_tab = self.get_current_tab()
        if not current_tab:
            return
            
        text_widget = current_tab.text_widget
        
        # Limpar conteúdo anterior
        text_widget.delete(1.0, tk.END)
        
        if 'html' in content_type.lower():
            # Processar HTML básico
            processed_content = self.process_html(content)
        else:
            # Exibir como texto plano
            processed_content = content
            
        # Inserir conteúdo
        text_widget.insert(1.0, processed_content)
        text_widget.mark_set(tk.INSERT, 1.0)
        
        # Adicionar ao histórico
        self.add_to_history(url)
        
        # Atualizar título da aba
        title = self.extract_title(content) or url.split('/')[-1] or "Página"
        tab_id = self.notebook.select()
        self.notebook.tab(tab_id, text=title[:20] + "..." if len(title) > 20 else title)
        
        self.status_bar.config(text=f"Carregado: {url}")
        self.loading = False
        self.update_button_states()
        
    def _display_error(self, url, error_msg):
        """Exibe erro de carregamento"""
        current_tab = self.get_current_tab()
        if not current_tab:
            return
            
        text_widget = current_tab.text_widget
        text_widget.delete(1.0, tk.END)
        
        error_content = f"""
🚫 ERRO AO CARREGAR PÁGINA

URL: {url}
Erro: {error_msg}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Sugestões:
• Verifique se o endereço está correto
• Certifique-se de que o servidor está funcionando
• Tente acessar: {url.replace('https://', 'http://')}

🌐 Sites disponíveis na Mini Internet:
• http://miniinternet.local
• http://servidor.miniinternet.local  
• http://site1.miniinternet.local
• http://10.0.0.1
        """
        
        text_widget.insert(1.0, error_content)
        
        self.status_bar.config(text=f"Erro: {error_msg}")
        self.loading = False
        self.update_button_states()
        
    def process_html(self, html_content):
        """Processa HTML para exibição em texto"""
        # Extrair título
        title_match = re.search(r'<title[^>]*>(.*?)</title>', html_content, re.IGNORECASE | re.DOTALL)
        title = title_match.group(1) if title_match else "Página sem título"
        
        # Remover scripts e styles
        html_content = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.IGNORECASE | re.DOTALL)
        html_content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.IGNORECASE | re.DOTALL)
        
        # Extrair texto do body
        body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.IGNORECASE | re.DOTALL)
        if body_match:
            body_content = body_match.group(1)
        else:
            body_content = html_content
            
        # Substituir tags HTML básicas
        body_content = re.sub(r'<h[1-6][^>]*>', '\n━━━ ', body_content, flags=re.IGNORECASE)
        body_content = re.sub(r'</h[1-6]>', ' ━━━\n', body_content, flags=re.IGNORECASE)
        body_content = re.sub(r'<p[^>]*>', '\n', body_content, flags=re.IGNORECASE)
        body_content = re.sub(r'<br[^>]*/?>', '\n', body_content, flags=re.IGNORECASE)
        body_content = re.sub(r'<div[^>]*>', '\n', body_content, flags=re.IGNORECASE)
        body_content = re.sub(r'<a[^>]*href=["\']([^"\']*)["\'][^>]*>', r' [LINK: \1] ', body_content, flags=re.IGNORECASE)
        
        # Remover tags restantes
        body_content = re.sub(r'<[^>]+>', '', body_content)
        
        # Decodificar entidades HTML
        body_content = html.unescape(body_content)
        
        # Limpar espaços em branco excessivos
        body_content = re.sub(r'\n\s*\n', '\n\n', body_content)
        body_content = re.sub(r'[ \t]+', ' ', body_content)
        
        return f"📄 {title}\n{'='*50}\n\n{body_content.strip()}"
        
    def extract_title(self, html_content):
        """Extrai título da página HTML"""
        title_match = re.search(r'<title[^>]*>(.*?)</title>', html_content, re.IGNORECASE | re.DOTALL)
        if title_match:
            return html.unescape(title_match.group(1).strip())
        return None
        
    def add_to_history(self, url):
        """Adiciona URL ao histórico"""
        if not self.history or self.history[self.history_index] != url:
            # Remove histórico futuro se estamos no meio da lista
            if self.history_index < len(self.history) - 1:
                self.history = self.history[:self.history_index + 1]
            
            self.history.append(url)
            self.history_index = len(self.history) - 1
            
    def go_back(self):
        """Volta na história"""
        if self.history_index > 0:
            self.history_index -= 1
            url = self.history[self.history_index]
            self.current_url.set(url)
            self.load_page(url)
            
    def go_forward(self):
        """Avança na história"""
        if self.history_index < len(self.history) - 1:
            self.history_index += 1
            url = self.history[self.history_index]
            self.current_url.set(url)
            self.load_page(url)
            
    def refresh(self):
        """Atualiza a página atual"""
        url = self.current_url.get()
        if url:
            self.load_page(url)
            
    def update_button_states(self):
        """Atualiza estado dos botões"""
        self.back_btn.config(state=tk.NORMAL if self.history_index > 0 else tk.DISABLED)
        self.forward_btn.config(state=tk.NORMAL if self.history_index < len(self.history) - 1 else tk.DISABLED)
        
    def load_homepage(self):
        """Carrega página inicial"""
        current_tab = self.get_current_tab()
        if not current_tab:
            return
            
        text_widget = current_tab.text_widget
        text_widget.delete(1.0, tk.END)
        
        homepage_content = f"""
🌐 MINI INTERNET BROWSER
{'='*50}

Bem-vindo ao navegador da sua Mini Internet!

📡 SERVIDOR DNS/WEB: 10.0.0.1
🕐 DATA/HORA: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 SITES DISPONÍVEIS:

• miniinternet.local - Página principal
• servidor.miniinternet.local - Servidor
• site1.miniinternet.local - Site 1
• blog.miniinternet.local - Blog
• loja.miniinternet.local - Loja

💡 COMO USAR:
1. Digite o endereço na barra acima
2. Pressione Enter ou clique em 'Ir'
3. Use os botões ◀ ▶ para navegar
4. Clique em ⭐ para adicionar aos favoritos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ RECURSOS:
• Navegação com histórico
• Suporte a múltiplas abas  
• Sistema de favoritos
• Processamento básico de HTML
• Interface simples e intuitiva

🎯 DICA: Comece visitando http://miniinternet.local
        """
        
        text_widget.insert(1.0, homepage_content)
        self.current_url.set("mini://homepage")
        self.status_bar.config(text="Página inicial carregada")
        
    def add_favorite(self):
        """Adiciona site aos favoritos"""
        url = self.current_url.get()
        if url and url != "mini://homepage":
            name = simpledialog.askstring("Adicionar Favorito", 
                                        "Nome do favorito:", 
                                        initialvalue=url.split('/')[-1] or url)
            if name:
                self.favorites[name] = url
                self.save_favorites()
                messagebox.showinfo("Favorito", f"'{name}' adicionado aos favoritos!")
                
    def show_menu(self):
        """Mostra menu de opções"""
        menu_window = tk.Toplevel(self.root)
        menu_window.title("Menu")
        menu_window.geometry("400x500")
        menu_window.resizable(False, False)
        
        # Centralizar janela
        menu_window.transient(self.root)
        menu_window.grab_set()
        
        notebook = ttk.Notebook(menu_window)
        notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Aba Favoritos
        fav_frame = ttk.Frame(notebook)
        notebook.add(fav_frame, text="Favoritos")
        
        fav_label = ttk.Label(fav_frame, text="Favoritos Salvos:", font=("Arial", 12, "bold"))
        fav_label.pack(anchor=tk.W, pady=(10, 5))
        
        fav_listbox = tk.Listbox(fav_frame, height=10)
        fav_listbox.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        for name, url in self.favorites.items():
            fav_listbox.insert(tk.END, f"{name} - {url}")
            
        def visit_favorite():
            selection = fav_listbox.curselection()
            if selection:
                name = list(self.favorites.keys())[selection[0]]
                url = self.favorites[name]
                menu_window.destroy()
                self.navigate_to_url(url)
                
        def delete_favorite():
            selection = fav_listbox.curselection()
            if selection:
                name = list(self.favorites.keys())[selection[0]]
                del self.favorites[name]
                self.save_favorites()
                fav_listbox.delete(selection[0])
                
        fav_btn_frame = ttk.Frame(fav_frame)
        fav_btn_frame.pack(fill=tk.X, padx=10, pady=5)
        
        ttk.Button(fav_btn_frame, text="Visitar", command=visit_favorite).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(fav_btn_frame, text="Excluir", command=delete_favorite).pack(side=tk.LEFT)
        
        # Aba Histórico
        hist_frame = ttk.Frame(notebook)
        notebook.add(hist_frame, text="Histórico")
        
        hist_label = ttk.Label(hist_frame, text="Histórico de Navegação:", font=("Arial", 12, "bold"))
        hist_label.pack(anchor=tk.W, pady=(10, 5))
        
        hist_listbox = tk.Listbox(hist_frame, height=15)
        hist_listbox.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        for url in self.history:
            hist_listbox.insert(tk.END, url)
            
        def visit_history():
            selection = hist_listbox.curselection()
            if selection:
                url = self.history[selection[0]]
                menu_window.destroy()
                self.navigate_to_url(url)
                
        hist_btn_frame = ttk.Frame(hist_frame)
        hist_btn_frame.pack(fill=tk.X, padx=10, pady=5)
        
        ttk.Button(hist_btn_frame, text="Visitar", command=visit_history).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(hist_btn_frame, text="Limpar Histórico", 
                  command=lambda: (setattr(self, 'history', []), 
                                 setattr(self, 'history_index', -1),
                                 hist_listbox.delete(0, tk.END))).pack(side=tk.LEFT)
        
        # Aba Sobre
        about_frame = ttk.Frame(notebook)
        notebook.add(about_frame, text="Sobre")
        
        about_text = tk.Text(about_frame, wrap=tk.WORD, height=20, width=40)
        about_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        about_content = """
🌐 MINI INTERNET BROWSER v1.0

Um navegador simples criado especialmente para navegar na sua Mini Internet!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 RECURSOS:
• Navegação básica HTTP
• Suporte a HTML simples
• Sistema de favoritos
• Histórico de navegação
• Interface com múltiplas abas
• Barra de endereços inteligente

🛠️ TECNOLOGIAS:
• Python 3
• Tkinter (Interface)
• urllib (Requisições HTTP)
• Threading (Carregamento assíncrono)

🎯 CRIADO PARA:
Demonstrar conceitos de redes, DNS, HTTP e desenvolvimento de aplicações desktop.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 DICAS:
• Use Ctrl+T para nova aba (em desenvolvimento)
• Clique em ⭐ para salvar favoritos
• O navegador processa HTML básico
• Funciona melhor com sites simples

🚀 PRÓXIMAS VERSÕES:
• Suporte a CSS básico
• Download de arquivos
• Zoom da página
• Modo escuro
        """
        
        about_text.insert(1.0, about_content)
        about_text.config(state=tk.DISABLED)
        
    def load_favorites(self):
        """Carrega favoritos do arquivo"""
        try:
            if os.path.exists('browser_favorites.json'):
                with open('browser_favorites.json', 'r') as f:
                    return json.load(f)
        except:
            pass
        return {}
        
    def save_favorites(self):
        """Salva favoritos no arquivo"""
        try:
            with open('browser_favorites.json', 'w') as f:
                json.dump(self.favorites, f, indent=2)
        except:
            pass
            
    def run(self):
        """Inicia o navegador"""
        self.root.mainloop()

def main():
    """Função principal"""
    print("🌐 Iniciando Mini Internet Browser...")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("📋 Recursos disponíveis:")
    print("  • Navegação HTTP básica")
    print("  • Processamento de HTML")
    print("  • Sistema de favoritos")
    print("  • Histórico de navegação")
    print("  • Interface com abas")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    
    try:
        browser = MiniBrowser()
        browser.run()
    except KeyboardInterrupt:
        print("\n🛑 Navegador fechado pelo usuário")
    except Exception as e:
        print(f"❌ Erro ao iniciar navegador: {e}")

if __name__ == "__main__":
    main()