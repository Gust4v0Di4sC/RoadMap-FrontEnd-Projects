# 🌐 Mini Internet Project

Uma simulação completa de internet usando máquinas virtuais, incluindo servidor DNS/Web e navegador customizado.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do VirtualBox](#configuração-do-virtualbox)
- [Configuração do Servidor](#configuração-do-servidor)
- [Configuração do Cliente](#configuração-do-cliente)
- [Navegador Mini Internet](#navegador-mini-internet)
- [Testes e Validação](#testes-e-validação)
- [Solução de Problemas](#solução-de-problemas)
- [Expansões Futuras](#expansões-futuras)
- [Contribuições](#contribuições)
- [Licença](#licença)

## 🎯 Visão Geral

O **Mini Internet Project** é uma simulação educativa de uma rede completa que replica o funcionamento da internet em escala reduzida. O projeto inclui:

- **Servidor DNS** (BIND9) para resolução de nomes
- **Servidor Web** (Apache2) com múltiplos sites virtuais
- **Cliente** Ubuntu para navegação
- **Navegador customizado** desenvolvido em Python
- **Rede isolada** para simulação realística

### 🌟 Características Principais

- ✅ Resolução DNS local completa
- ✅ Múltiplos sites virtuais configurados
- ✅ Navegador desktop personalizado
- ✅ Rede completamente isolada
- ✅ Interface gráfica amigável
- ✅ Histórico e favoritos funcionais

## 🏗️ Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────┐
│                    MINI INTERNET                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐         ┌─────────────────┐       │
│  │   SERVIDOR      │         │    CLIENTE      │       │
│  │   10.0.0.1      │◄────────┤   10.0.0.2      │       │
│  │                 │         │                 │       │
│  │ • BIND9 (DNS)   │         │ • Mini Browser  │       │
│  │ • Apache2 (Web) │         │ • Firefox       │       │
│  │ • Sites Virtuais│         │ • SSH Client    │       │
│  └─────────────────┘         └─────────────────┘       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 Rede Interna: 10.0.0.0/24              │
└─────────────────────────────────────────────────────────┘
```

### 🌍 Sites Disponíveis

| Domínio | IP | Descrição |
|---------|-------|-----------|
| `miniinternet.local` | 10.0.0.1 | Página principal |
| `servidor.miniinternet.local` | 10.0.0.1 | Info do servidor |
| `site1.miniinternet.local` | 10.0.0.1 | Site empresarial |
| `blog.miniinternet.local` | 10.0.0.1 | Blog pessoal |
| `loja.miniinternet.local` | 10.0.0.1 | Loja virtual |

## 📋 Pré-requisitos

### Software Necessário

- **VirtualBox** 6.0+ ou **VMware Workstation**
- **Ubuntu 24.04.03 LTS** (2 instâncias)
- **Python 3.8+** (para o navegador)
- **4GB RAM** mínimo (2GB por VM)
- **20GB** espaço em disco

### Conhecimentos Recomendados

- Conceitos básicos de redes
- Linux/Ubuntu básico
- Configuração de DNS
- Noções de HTTP/Web

## ⚙️ Configuração do VirtualBox

### 1. Criação das Máquinas Virtuais

#### VM Servidor
```bash
Nome: Ubuntu-Servidor
Tipo: Linux
Versão: Ubuntu (64-bit)
RAM: 2048 MB
Disco: 20 GB (dinâmico)
```

#### VM Cliente
```bash
Nome: Ubuntu-Cliente
Tipo: Linux
Versão: Ubuntu (64-bit)
RAM: 2048 MB
Disco: 20 GB (dinâmico)
```

### 2. Configuração de Rede

#### Para ambas as VMs:

1. **Vá em Configurações → Rede**
2. **Adaptador 1:**
   - ✅ Habilitar Placa de Rede
   - **Conectado a:** `Rede Interna`
   - **Nome:** `mini-internet`

#### Configuração Opcional (para instalação de pacotes):

3. **Adaptador 2 (temporário):**
   - ✅ Habilitar Placa de Rede
   - **Conectado a:** `Placa em modo Bridge`
   - **Nome:** Sua placa física

> **Nota:** O Adaptador 2 pode ser desabilitado após configuração completa.

### 3. Instalação dos Guest Additions

```bash
# No menu da VM: Dispositivos → Inserir imagem de CD dos Adicionais para Convidado
sudo apt update
sudo apt install build-essential dkms linux-headers-$(uname -r)
sudo mkdir /media/cdrom
sudo mount /dev/cdrom /media/cdrom
cd /media/cdrom
sudo ./VBoxLinuxAdditions.run
sudo reboot
```

## 🖥️ Configuração do Servidor

### 1. Configuração de Rede

#### Verificar Interface
```bash
ip addr show
# Anote o nome da interface (ex: enp0s3)
```

#### Configurar IP Estático
```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

```yaml
network:
  version: 2
  ethernets:
    enp0s3:  # Substitua pelo nome da sua interface
      dhcp4: false
      addresses:
        - 10.0.0.1/24
      nameservers:
        addresses:
          - 127.0.0.1
```

```bash
sudo netplan apply
```

### 2. Instalação dos Serviços

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Apache2 e BIND9
sudo apt install apache2 bind9 bind9utils bind9-doc -y

# Habilitar serviços
sudo systemctl enable apache2
sudo systemctl enable bind9
```

### 3. Configuração do BIND9 (DNS)

#### Configurar Opções Principais
```bash
sudo nano /etc/bind/named.conf.options
```

```bash
options {
    directory "/var/cache/bind";
    listen-on port 53 { 10.0.0.1; 127.0.0.1; };
    allow-query { 10.0.0.0/24; 127.0.0.1; };
    recursion yes;
    dnssec-validation auto;
    auth-nxdomain no;
};
```

#### Configurar Zonas Locais
```bash
sudo nano /etc/bind/named.conf.local
```

```bash
zone "miniinternet.local" {
    type master;
    file "/etc/bind/db.miniinternet.local";
};

zone "0.0.10.in-addr.arpa" {
    type master;
    file "/etc/bind/db.10.0.0";
};
```

#### Criar Arquivo de Zona Direta
```bash
sudo nano /etc/bind/db.miniinternet.local
```

```bash
$TTL    604800
@       IN      SOA     ns.miniinternet.local. admin.miniinternet.local. (
                              2024081401    ; Serial
                         604800           ; Refresh
                          86400           ; Retry
                        2419200           ; Expire
                         604800 )         ; Negative Cache TTL
;
@               IN      NS      ns.miniinternet.local.
@               IN      A       10.0.0.1
ns              IN      A       10.0.0.1
servidor        IN      A       10.0.0.1
www             IN      A       10.0.0.1
site1           IN      A       10.0.0.1
blog            IN      A       10.0.0.1
loja            IN      A       10.0.0.1
cliente         IN      A       10.0.0.2
```

#### Criar Arquivo de Zona Reversa
```bash
sudo nano /etc/bind/db.10.0.0
```

```bash
$TTL    604800
@       IN      SOA     ns.miniinternet.local. admin.miniinternet.local. (
                              2024081401    ; Serial
                         604800           ; Refresh
                          86400           ; Retry
                        2419200           ; Expire
                         604800 )         ; Negative Cache TTL
;
@       IN      NS      ns.miniinternet.local.
1       IN      PTR     servidor.miniinternet.local.
2       IN      PTR     cliente.miniinternet.local.
```

#### Ajustar Permissões e Testar
```bash
sudo chown root:bind /etc/bind/db.miniinternet.local
sudo chown root:bind /etc/bind/db.10.0.0
sudo chmod 644 /etc/bind/db.miniinternet.local
sudo chmod 644 /etc/bind/db.10.0.0

# Testar configuração
sudo named-checkconf
sudo named-checkzone miniinternet.local /etc/bind/db.miniinternet.local

# Reiniciar serviço
sudo systemctl restart bind9
sudo systemctl status bind9
```

### 4. Configuração do Apache2

#### Página Principal
```bash
sudo nano /var/www/html/index.html
```

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Mini Internet - Página Principal</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f0f0f0; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .info { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .links { margin-top: 20px; }
        .links a { display: block; margin: 10px 0; color: #0066cc; text-decoration: none; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .links a:hover { background: #e9ecef; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 Bem-vindo à Mini Internet!</h1>
        
        <div class="info">
            <p><strong>Servidor DNS/Web:</strong> 10.0.0.1</p>
            <p><strong>Data/Hora:</strong> <script>document.write(new Date().toLocaleString('pt-BR'));</script></p>
            <p><strong>Domínio:</strong> miniinternet.local</p>
        </div>
        
        <div class="links">
            <h3>🔗 Sites Disponíveis:</h3>
            <a href="http://site1.miniinternet.local">→ Site 1 - Empresa</a>
            <a href="http://blog.miniinternet.local">→ Blog Pessoal</a>
            <a href="http://loja.miniinternet.local">→ Loja Virtual</a>
        </div>
        
        <div class="info">
            <p><em>Esta é sua mini internet funcionando com DNS e Apache configurados!</em></p>
        </div>
    </div>
</body>
</html>
```

#### Configurar Sites Virtuais

##### Site 1
```bash
sudo mkdir /var/www/site1
sudo nano /var/www/site1/index.html
```

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Site 1 - Mini Internet</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #e8f4fd; }
        .container { background: white; padding: 30px; border-radius: 10px; border-left: 5px solid #007acc; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📘 Site 1 da Mini Internet</h1>
        <p>Este é o primeiro site virtual da nossa mini internet!</p>
        <p><strong>IP do Servidor:</strong> 10.0.0.1</p>
        <p><a href="http://miniinternet.local">← Voltar para página principal</a></p>
    </div>
</body>
</html>
```

```bash
sudo nano /etc/apache2/sites-available/site1.conf
```

```apache
<VirtualHost *:80>
    ServerName site1.miniinternet.local
    DocumentRoot /var/www/site1
    ErrorLog ${APACHE_LOG_DIR}/site1_error.log
    CustomLog ${APACHE_LOG_DIR}/site1_access.log combined
    
    <Directory /var/www/site1>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

```bash
sudo a2ensite site1.conf
```

##### Blog e Loja (processo similar)
```bash
# Blog
sudo mkdir /var/www/blog
echo "<h1>📝 Blog da Mini Internet</h1><p>Notícias do nosso pequeno mundo digital!</p><p><a href='http://miniinternet.local'>← Voltar</a></p>" | sudo tee /var/www/blog/index.html

# Loja
sudo mkdir /var/www/loja
echo "<h1>🛒 Loja Virtual</h1><p>Produtos da nossa mini internet!</p><p><a href='http://miniinternet.local'>← Voltar</a></p>" | sudo tee /var/www/loja/index.html

# Configurar virtual hosts
sudo cp /etc/apache2/sites-available/site1.conf /etc/apache2/sites-available/blog.conf
sudo cp /etc/apache2/sites-available/site1.conf /etc/apache2/sites-available/loja.conf

sudo sed -i 's/site1/blog/g' /etc/apache2/sites-available/blog.conf
sudo sed -i 's/site1/loja/g' /etc/apache2/sites-available/loja.conf

sudo a2ensite blog.conf
sudo a2ensite loja.conf
```

#### Reiniciar Apache
```bash
sudo systemctl reload apache2
sudo systemctl status apache2
```

### 5. Configurar SSH (opcional)
```bash
sudo apt install openssh-server -y
sudo systemctl enable ssh
sudo systemctl start ssh
```

## 💻 Configuração do Cliente

### 1. Configuração de Rede

```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

```yaml
network:
  version: 2
  ethernets:
    enp0s3:  # Substitua pelo nome da sua interface
      dhcp4: false
      addresses:
        - 10.0.0.2/24
      routes:
        - to: default
          via: 10.0.0.1
      nameservers:
        addresses:
          - 10.0.0.1
```

```bash
sudo netplan apply
```

### 2. Teste de Conectividade

```bash
# Testar conectividade
ping 10.0.0.1

# Testar DNS
nslookup miniinternet.local
nslookup servidor.miniinternet.local

# Testar HTTP
curl http://miniinternet.local
curl http://site1.miniinternet.local
```

### 3. Instalar Dependências do Navegador

```bash
sudo apt update
sudo apt install python3-tk python3-pip -y
```

## 🌐 Navegador Mini Internet

### 1. Instalação

Baixe o arquivo `mini_browser.py` deste repositório:

```bash
# Opção 1: Clonar repositório
git clone https://github.com/seu-usuario/mini-internet.git
cd mini-internet

# Opção 2: Download direto
wget https://raw.githubusercontent.com/seu-usuario/mini-internet/main/mini_browser.py
```

### 2. Executar Navegador

```bash
python3 mini_browser.py
```

### 3. Funcionalidades

- **Navegação básica**: Digite URLs na barra de endereços
- **Favoritos**: Clique em ⭐ para salvar sites
- **Histórico**: Use ◀ ▶ para navegar
- **Menu**: Clique em ☰ para acessar favoritos e configurações
- **Múltiplas abas**: Suporte a várias páginas simultaneamente

## ✅ Testes e Validação

### 1. Teste de DNS

```bash
# No cliente
nslookup miniinternet.local
nslookup site1.miniinternet.local
nslookup blog.miniinternet.local

# Deve retornar 10.0.0.1 para todos
```

### 2. Teste de Conectividade HTTP

```bash
# Teste com curl
curl -I http://miniinternet.local
curl -I http://site1.miniinternet.local
curl -I http://blog.miniinternet.local

# Deve retornar "200 OK"
```

### 3. Teste no Navegador

1. Abra o Mini Browser
2. Digite: `http://miniinternet.local`
3. Navegue pelos links dos sites
4. Teste favoritos e histórico

### 4. Teste de Performance

```bash
# Logs do Apache
sudo tail -f /var/log/apache2/access.log

# Logs do BIND
sudo tail -f /var/log/syslog | grep named

# Status dos serviços
sudo systemctl status apache2
sudo systemctl status bind9
```

## 🔧 Solução de Problemas

### DNS não resolve

```bash
# Verificar configuração
sudo named-checkconf
sudo named-checkzone miniinternet.local /etc/bind/db.miniinternet.local

# Reiniciar BIND9
sudo systemctl restart bind9

# Verificar se está escutando
sudo ss -tlnp | grep :53
```

### Apache não responde

```bash
# Verificar configuração
sudo apache2ctl configtest

# Verificar se está escutando
sudo ss -tlnp | grep :80

# Reiniciar Apache
sudo systemctl restart apache2
```

### Conectividade de rede

```bash
# Verificar IPs
ip addr show

# Testar ping
ping 10.0.0.1  # Do cliente para servidor
ping 10.0.0.2  # Do servidor para cliente

# Verificar rotas
ip route show
```

### Firewall

```bash
# Verificar firewall
sudo ufw status

# Permitir serviços se necessário
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 53/tcp
sudo ufw allow 53/udp
```

## 🚀 Expansões Futuras

### Funcionalidades Planejadas

- [ ] **Servidor de Email** (Postfix/Dovecot)
- [ ] **Servidor FTP** (vsftpd)
- [ ] **HTTPS** com certificados auto-assinados
- [ ] **Proxy/Cache** (Squid)
- [ ] **Monitoramento** (Nagios/Zabbix)
- [ ] **Load Balancer** (HAProxy)
- [ ] **Database Server** (MySQL/PostgreSQL)
- [ ] **Chat Server** (IRC/XMPP)

### Melhorias do Navegador

- [ ] **Suporte a CSS** básico
- [ ] **Download de arquivos**
- [ ] **Zoom da página**
- [ ] **Modo escuro**
- [ ] **Plugins/extensões**
- [ ] **Suporte a JavaScript** básico

### Expansão de Rede

- [ ] **Múltiplos servidores** (DNS secundário)
- [ ] **Roteamento** entre sub-redes
- [ ] **VPN** para conexão externa
- [ ] **DHCP Server** dinâmico
- [ ] **Simulação de latência**

## 📁 Estrutura do Projeto

```
mini-internet/
├── README.md
├── mini_browser.py
├── docs/
│   ├── network-diagram.png
│   ├── dns-configuration.md
│   └── apache-sites.md
├── configs/
│   ├── server/
│   │   ├── bind9/
│   │   │   ├── named.conf.options
│   │   │   ├── named.conf.local
│   │   │   ├── db.miniinternet.local
│   │   │   └── db.10.0.0
│   │   └── apache2/
│   │       ├── sites-available/
│   │       └── html/
│   └── client/
│       └── netplan/
├── scripts/
│   ├── setup-server.sh
│   ├── setup-client.sh
│   └── test-connectivity.sh
└── virtualbox/
    ├── vm-export/
    └── configuration-guide.md
```

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Diretrizes para Contribuição

- Mantenha o código limpo e documentado
- Teste todas as funcionalidades antes do PR
- Atualize a documentação quando necessário
- Siga as convenções de commit do projeto

## 📝 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.



## 🙏 Agradecimentos

- Comunidade Ubuntu pela documentação
- Projeto BIND9 e Apache Foundation
- VirtualBox pela virtualização
- Todos que contribuíram com feedback e sugestões



---

**🌐 Mini Internet Project** - *Simulando o mundo digital em escala educativa*