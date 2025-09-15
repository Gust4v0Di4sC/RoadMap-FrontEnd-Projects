# 🔐 Autoridade Certificadora (CA) Própria - Guia Completo

Este guia ensina como criar e configurar uma Autoridade Certificadora (CA) própria no Ubuntu para gerar certificados SSL/TLS válidos para sua rede local ou laboratório.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Configuração do Servidor (CA)](#configuração-do-servidor-ca)
- [Configuração dos Clientes](#configuração-dos-clientes)
- [Uso Prático](#uso-prático)
- [Scripts Auxiliares](#scripts-auxiliares)
- [Troubleshooting](#troubleshooting)
- [Comandos Úteis](#comandos-úteis)

---

## 🚀 Pré-requisitos

### Sistema Operacional
- Ubuntu Server/Desktop (testado em 20.04+)
- Acesso root ou sudo
- OpenSSL instalado

### Instalação das dependências
```bash
sudo apt update
sudo apt install openssl -y
```

### Verificar versão do OpenSSL
```bash
openssl version
# Saída esperada: OpenSSL 1.1.1f ou superior
```

---

## 🏗️ Configuração do Servidor (CA)

### Passo 1: Criar Estrutura de Diretórios

```bash
# Criar diretório principal da CA
sudo mkdir -p /etc/ssl/ca/{certs,crl,newcerts,private}

# Definir permissões seguras
sudo chmod 700 /etc/ssl/ca/private
sudo chmod 755 /etc/ssl/ca/certs

# Criar arquivos de controle
sudo touch /etc/ssl/ca/index.txt
echo 1000 | sudo tee /etc/ssl/ca/serial
echo 1000 | sudo tee /etc/ssl/ca/crlnumber
```

### Passo 2: Configurar OpenSSL

Criar arquivo de configuração personalizado:

```bash
sudo nano /etc/ssl/ca/openssl.cnf
```

**Conteúdo do arquivo `/etc/ssl/ca/openssl.cnf`:**

```ini
[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = /etc/ssl/ca
certs             = $dir/certs
crl_dir           = $dir/crl
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
serial            = $dir/serial
RANDFILE          = $dir/private/.rand

private_key       = $dir/private/ca.key.pem
certificate       = $dir/certs/ca.cert.pem

crlnumber         = $dir/crlnumber
crl               = $dir/crl/ca.crl.pem
crl_extensions    = crl_ext
default_crl_days  = 30

default_md        = sha256
name_opt          = ca_default
cert_opt          = ca_default
default_days      = 375
preserve          = no
policy            = policy_strict

[ policy_strict ]
countryName             = match
stateOrProvinceName     = match
organizationName        = match
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional

[ policy_loose ]
countryName             = optional
stateOrProvinceName     = optional
localityName            = optional
organizationName        = optional
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional

[ req ]
default_bits        = 2048
distinguished_name  = req_distinguished_name
string_mask         = utf8only
default_md          = sha256
x509_extensions     = v3_ca

[ req_distinguished_name ]
countryName                     = Country Name (2 letter code)
stateOrProvinceName             = State or Province Name
localityName                    = Locality Name
0.organizationName              = Organization Name
organizationalUnitName          = Organizational Unit Name
commonName                      = Common Name
emailAddress                    = Email Address

[ v3_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ v3_intermediate_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ usr_cert ]
basicConstraints = CA:FALSE
nsCertType = client, email
nsComment = "OpenSSL Generated Client Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth, emailProtection

[ server_cert ]
basicConstraints = CA:FALSE
nsCertType = server
nsComment = "OpenSSL Generated Server Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[ crl_ext ]
authorityKeyIdentifier=keyid:always

[ ocsp ]
basicConstraints = CA:FALSE
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, digitalSignature
extendedKeyUsage = critical, OCSPSigning
```

### Passo 3: Gerar Chave Privada da CA

```bash
# Gerar chave privada da CA (4096 bits para maior segurança)
sudo openssl genrsa -aes256 -out /etc/ssl/ca/private/ca.key.pem 4096

# Definir permissões restritivas
sudo chmod 400 /etc/ssl/ca/private/ca.key.pem
```

> **⚠️ IMPORTANTE:** Guarde bem a senha da chave privada! Você precisará dela sempre que criar novos certificados.

### Passo 4: Criar Certificado Raiz da CA

```bash
# Criar certificado auto-assinado da CA (válido por 20 anos)
sudo openssl req -config /etc/ssl/ca/openssl.cnf \
    -key /etc/ssl/ca/private/ca.key.pem \
    -new -x509 -days 7300 -sha256 -extensions v3_ca \
    -out /etc/ssl/ca/certs/ca.cert.pem
```

**Exemplo de preenchimento:**
```
Country Name (2 letter code) [AU]: BR
State or Province Name (full name) [Some-State]: Rio de Janeiro
Locality Name (eg, city) []: Rio de Janeiro
Organization Name (eg, company) [Internet Widgits Pty Ltd]: Lab CA
Organizational Unit Name (eg, section) []: TI
Common Name (e.g. server FQDN or YOUR name) []: Lab Root CA
Email Address []: admin@lab.local
```

### Passo 5: Verificar Certificado da CA

```bash
# Verificar certificado criado
sudo openssl x509 -noout -text -in /etc/ssl/ca/certs/ca.cert.pem | head -20

# Verificar datas de validade
sudo openssl x509 -noout -dates -in /etc/ssl/ca/certs/ca.cert.pem
```

### Passo 6: Instalar CA no Servidor Ubuntu

```bash
# Copiar certificado da CA para diretório de CAs confiáveis
sudo cp /etc/ssl/ca/certs/ca.cert.pem /usr/local/share/ca-certificates/lab-ca.crt

# Atualizar lista de CAs confiáveis
sudo update-ca-certificates
```

**Saída esperada:**
```
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
```

---

## 🔧 Geração de Certificados para Sites

### Criar Certificado para um Site/Domínio

```bash
# Criar diretório para certificados dos sites
sudo mkdir -p /etc/ssl/sites

# Exemplo para site1.local
DOMAIN="site1.local"

# 1. Gerar chave privada do site
sudo openssl genrsa -out /etc/ssl/sites/$DOMAIN.key.pem 2048

# 2. Gerar requisição de certificado (CSR)
sudo openssl req -config /etc/ssl/ca/openssl.cnf \
    -key /etc/ssl/sites/$DOMAIN.key.pem \
    -new -sha256 -out /etc/ssl/sites/$DOMAIN.csr.pem \
    -subj "/C=BR/ST=Rio de Janeiro/L=Rio de Janeiro/O=Lab CA/CN=$DOMAIN"

# 3. Assinar certificado com a CA
sudo openssl ca -config /etc/ssl/ca/openssl.cnf \
    -extensions server_cert -days 365 -notext -md sha256 \
    -in /etc/ssl/sites/$DOMAIN.csr.pem \
    -out /etc/ssl/sites/$DOMAIN.cert.pem \
    -batch

# 4. Verificar certificado
sudo openssl x509 -noout -text -in /etc/ssl/sites/$DOMAIN.cert.pem | grep -A2 "Subject:"
```

---

## 💻 Configuração dos Clientes

### Ubuntu/Linux (Cliente)

```bash
# Método 1: Copiar certificado via SCP
scp usuario@servidor-ca:/etc/ssl/ca/certs/ca.cert.pem ~/ca.cert.pem

# Instalar no sistema
sudo cp ~/ca.cert.pem /usr/local/share/ca-certificates/lab-ca.crt
sudo update-ca-certificates

# Verificar instalação
ls /etc/ssl/certs/ | grep lab-ca
```

### Windows (Cliente)

**Método Interface Gráfica:**

1. Copie o arquivo `ca.cert.pem` para o Windows
2. Renomeie para `ca.crt`
3. **Clique duplo** no arquivo → **Instalar Certificado**
4. Selecione **"Máquina Local"** → **Avançar**
5. Escolha **"Colocar todos os certificados no repositório a seguir"**
6. Clique **"Procurar"** → **"Autoridades de Certificação Raiz Confiáveis"**
7. **Finalizar** → **Sim**

**Método PowerShell (como Administrador):**
```powershell
Import-Certificate -FilePath "C:\caminho\ca.cert.pem" -CertStoreLocation "Cert:\LocalMachine\Root"
```

### macOS (Cliente)

```bash
# Via terminal
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ca.cert.pem
```

**Método Interface:**
1. Duplo clique no `ca.cert.pem`
2. Abre o **Acesso às Chaves**
3. Encontre o certificado → clique duplo
4. Em **Confiança** → **"Sempre confiar"**

### Firefox (Qualquer OS)

Firefox usa repositório próprio de certificados:

1. **Firefox** → **Configurações** (about:preferences)
2. Busque por **"certificados"**
3. **Ver Certificados** → Aba **Autoridades**
4. **Importar** → Selecione `ca.cert.pem`
5. Marque **"Confiar nesta CA para identificar sites"**
6. **OK**

---

## 🌐 Uso Prático

### Exemplo: Configurar Apache com SSL

```bash
# Instalar Apache
sudo apt install apache2 -y

# Habilitar SSL
sudo a2enmod ssl
sudo systemctl restart apache2

# Configurar site com SSL
sudo nano /etc/apache2/sites-available/site1-ssl.conf
```

**Conteúdo do arquivo:**
```apache
<VirtualHost *:443>
    ServerName site1.local
    DocumentRoot /var/www/html
    
    SSLEngine on
    SSLCertificateFile /etc/ssl/sites/site1.local.cert.pem
    SSLCertificateKeyFile /etc/ssl/sites/site1.local.key.pem
    SSLCertificateChainFile /etc/ssl/ca/certs/ca.cert.pem
</VirtualHost>
```

```bash
# Ativar site
sudo a2ensite site1-ssl.conf
sudo systemctl reload apache2

# Adicionar ao /etc/hosts (servidor e cliente)
echo "192.168.1.100 site1.local" | sudo tee -a /etc/hosts
```

### Exemplo: Configurar Nginx com SSL

```bash
# Instalar Nginx
sudo apt install nginx -y

# Configurar site
sudo nano /etc/nginx/sites-available/site1-ssl
```

**Conteúdo:**
```nginx
server {
    listen 443 ssl;
    server_name site1.local;
    root /var/www/html;
    
    ssl_certificate /etc/ssl/sites/site1.local.cert.pem;
    ssl_certificate_key /etc/ssl/sites/site1.local.key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/site1-ssl /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

---

## 🛠️ Scripts Auxiliares

### Script para Gerar Certificados Automaticamente

```bash
#!/bin/bash
# Salvar como: /usr/local/bin/gerar-certificado.sh

if [ $# -ne 1 ]; then
    echo "Uso: $0 nome-do-dominio.local"
    exit 1
fi

DOMAIN=$1
CERT_DIR="/etc/ssl/sites"
CA_CONFIG="/etc/ssl/ca/openssl.cnf"

echo "🔐 Gerando certificado para: $DOMAIN"

# Verificar se diretório existe
if [ ! -d "$CERT_DIR" ]; then
    sudo mkdir -p "$CERT_DIR"
fi

# Gerar chave privada
echo "1/3 Gerando chave privada..."
sudo openssl genrsa -out $CERT_DIR/$DOMAIN.key.pem 2048

# Gerar CSR
echo "2/3 Gerando requisição de certificado..."
sudo openssl req -config $CA_CONFIG \
    -key $CERT_DIR/$DOMAIN.key.pem \
    -new -sha256 -out $CERT_DIR/$DOMAIN.csr.pem \
    -subj "/C=BR/ST=Rio de Janeiro/L=Rio de Janeiro/O=Lab CA/CN=$DOMAIN"

# Assinar certificado
echo "3/3 Assinando certificado..."
sudo openssl ca -config $CA_CONFIG \
    -extensions server_cert -days 365 -notext -md sha256 \
    -in $CERT_DIR/$DOMAIN.csr.pem \
    -out $CERT_DIR/$DOMAIN.cert.pem \
    -batch

echo ""
echo "✅ Certificado gerado com sucesso!"
echo "📁 Arquivos criados em $CERT_DIR/:"
echo "   - $DOMAIN.key.pem (chave privada)"
echo "   - $DOMAIN.cert.pem (certificado)"
echo ""
echo "🔍 Para verificar:"
echo "   openssl x509 -noout -text -in $CERT_DIR/$DOMAIN.cert.pem"
```

```bash
# Tornar executável
sudo chmod +x /usr/local/bin/gerar-certificado.sh

# Usar:
sudo gerar-certificado.sh meusite.local
```

### Script para Distribuir CA nos Clientes

```bash
#!/bin/bash
# Salvar como: /usr/local/bin/instalar-ca-clientes.sh

# Lista de clientes Linux (IPs ou hostnames)
CLIENTS=("192.168.1.10" "192.168.1.11" "user@192.168.1.12")
CA_CERT="/etc/ssl/ca/certs/ca.cert.pem"
USERNAME="usuario"  # Ajustar conforme necessário

if [ ! -f "$CA_CERT" ]; then
    echo "❌ Certificado da CA não encontrado: $CA_CERT"
    exit 1
fi

echo "🚀 Distribuindo certificado da CA para clientes Linux..."

for client in "${CLIENTS[@]}"; do
    echo "📤 Instalando CA em $client..."
    
    # Copiar certificado
    scp $CA_CERT $client:/tmp/ca.cert.pem
    
    # Instalar no cliente
    ssh $client "
        sudo cp /tmp/ca.cert.pem /usr/local/share/ca-certificates/lab-ca.crt
        sudo update-ca-certificates
        sudo rm /tmp/ca.cert.pem
        echo '✅ CA instalado com sucesso em $client'
    "
done

echo ""
echo "🎉 Distribuição concluída!"
echo "🔍 Teste acessando: https://seusite.local"
```

---

## 🧪 Testes e Verificação

### Testar Certificado SSL

```bash
# Testar conexão SSL
openssl s_client -connect site1.local:443 -CAfile /etc/ssl/ca/certs/ca.cert.pem

# Verificar certificado de um site
echo | openssl s_client -connect site1.local:443 2>/dev/null | openssl x509 -noout -text

# Testar com curl
curl -v https://site1.local
```

### Verificar se CA está confiável

```bash
# No Ubuntu
openssl verify -CAfile /etc/ssl/ca/certs/ca.cert.pem /etc/ssl/sites/site1.local.cert.pem

# Saída esperada: /etc/ssl/sites/site1.local.cert.pem: OK
```

### Testar no Navegador

1. Acesse `https://seusite.local`
2. ✅ **Sucesso:** Cadeado verde, sem avisos
3. ❌ **Erro:** Aviso de "conexão insegura" = CA não está instalada no cliente

---

## 🆘 Troubleshooting

### Problema: "certificate verify failed"

**Causa:** CA não está instalada no cliente

**Solução:**
```bash
# Instalar CA no cliente
sudo cp ca.cert.pem /usr/local/share/ca-certificates/lab-ca.crt
sudo update-ca-certificates
```

### Problema: "unable to load CA private key"

**Causa:** Problemas com senha da chave privada

**Solução:**
```bash
# Verificar chave
sudo openssl rsa -noout -text -in /etc/ssl/ca/private/ca.key.pem

# Se necessário, recriar sem senha (menos seguro)
sudo openssl rsa -in /etc/ssl/ca/private/ca.key.pem -out /etc/ssl/ca/private/ca.key.pem
```

### Problema: Firefox não aceita certificados

**Causa:** Firefox usa repositório próprio

**Solução:** Importar manualmente no Firefox (ver seção Firefox acima)

### Problema: "failed to update database"

**Causa:** Problemas com arquivo index.txt

**Solução:**
```bash
# Recriar arquivo de banco
sudo rm /etc/ssl/ca/index.txt*
sudo touch /etc/ssl/ca/index.txt
sudo touch /etc/ssl/ca/index.txt.attr
```

---

## 📚 Comandos Úteis

### Gerenciamento de Certificados

```bash
# Listar todos os certificados emitidos
sudo cat /etc/ssl/ca/index.txt

# Ver detalhes de um certificado
openssl x509 -noout -text -in certificado.pem

# Ver datas de validade
openssl x509 -noout -dates -in certificado.pem

# Ver apenas o subject
openssl x509 -noout -subject -in certificado.pem

# Ver apenas o issuer
openssl x509 -noout -issuer -in certificado.pem
```

### Verificações de Segurança

```bash
# Verificar se certificado combina com chave privada
openssl x509 -noout -modulus -in cert.pem | openssl md5
openssl rsa -noout -modulus -in key.pem | openssl md5
# Os hashes devem ser iguais

# Verificar cadeia de certificados
openssl verify -CAfile ca.cert.pem certificado.pem

# Testar conectividade SSL
openssl s_client -connect servidor:443 -servername dominio.local
```

### Revogação de Certificados

```bash
# Revogar um certificado
sudo openssl ca -config /etc/ssl/ca/openssl.cnf -revoke /caminho/do/certificado.pem

# Gerar lista de certificados revogados (CRL)
sudo openssl ca -config /etc/ssl/ca/openssl.cnf -gencrl -out /etc/ssl/ca/crl/ca.crl.pem

# Ver lista de revogados
openssl crl -noout -text -in /etc/ssl/ca/crl/ca.crl.pem
```

---

## 🔐 Segurança e Boas Práticas

### Permissões de Arquivos

```bash
# Verificar permissões corretas
ls -la /etc/ssl/ca/private/    # Deve ser 700
ls -la /etc/ssl/ca/certs/      # Deve ser 755

# Corrigir permissões se necessário
sudo chmod 700 /etc/ssl/ca/private/
sudo chmod 400 /etc/ssl/ca/private/ca.key.pem
sudo chmod 644 /etc/ssl/ca/certs/ca.cert.pem
```

### Backup da CA

```bash
# Fazer backup completo da CA
sudo tar -czf ca-backup-$(date +%Y%m%d).tar.gz -C /etc/ssl ca/

# Restaurar backup
sudo tar -xzf ca-backup-YYYYMMDD.tar.gz -C /etc/ssl/
```

### Recomendações

- ✅ Use senhas fortes para a chave privada da CA
- ✅ Faça backup regular dos arquivos da CA
- ✅ Mantenha o servidor da CA isolado da rede
- ✅ Use certificados com prazo de validade curto (1 ano)
- ✅ Monitor certificados próximos do vencimento
- ❌ Nunca compartilhe a chave privada da CA
- ❌ Não reutilize certificados em múltiplos domínios

---

## 📞 Suporte

### Logs para Debugging

```bash
# Logs do Apache
sudo tail -f /var/log/apache2/error.log

# Logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Logs do sistema
sudo journalctl -f
```

### Informações do Sistema

```bash
# Versão do OpenSSL
openssl version -a

# Certificados instalados no sistema
ls -la /usr/local/share/ca-certificates/

# Status dos serviços
sudo systemctl status apache2
sudo systemctl status nginx
```

---

## 📝 Changelog

- **v1.0** - Versão inicial do guia
- **v1.1** - Adicionados scripts auxiliares e troubleshooting
- **v1.2** - Melhorias na seção de clientes Windows/macOS

---

**🎯 Meta:** Este README deve ser suficiente para qualquer pessoa configurar uma CA própria completa e funcional.

**📧 Dúvidas?** Documente problemas encontrados e soluções para melhorar este guia.