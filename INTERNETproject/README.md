# Projeto Mini Internet

Este projeto tem como objetivo simular uma mini internet utilizando máquinas virtuais. Ele permite a criação de uma rede local composta por múltiplas VMs, possibilitando a configuração de serviços de rede, roteamento, DNS, servidores web, firewall, entre outros componentes essenciais para o funcionamento de uma infraestrutura de internet em pequena escala.

## Funcionalidades

- Criação e configuração de múltiplas máquinas virtuais
- Simulação de roteadores e switches virtuais
- Implementação de serviços de rede (DNS, DHCP, HTTP, etc.)
- Testes de conectividade e roteamento entre as VMs
- Configuração de regras de firewall e NAT
- Documentação dos experimentos e topologias de rede

## Tecnologias Utilizadas

- VirtualBox / VMware / QEMU (para virtualização)
- Linux (sistemas operacionais das VMs)
- Ferramentas de rede: iptables, bind9, apache/nginx, etc.
- Scripts de automação (bash, python, etc.)

## Como Executar

1. Clone este repositório.
2. Siga as instruções do arquivo `mini_internet_readme.md` para criar e configurar as máquinas virtuais.
3. Siga as instruções do arquivo `ca_complete_readme.md` para criar e ajustar uma autoridade certificadora que emite certificados ssl validos.
4. Instale o mini_browser no cliente caso queira ver a implementação de um browser simples usando python.
5. Realize testes de conectividade e serviços entre as VMs.

## Objetivos de Aprendizagem

- Compreender o funcionamento básico da internet e seus principais serviços
- Praticar a configuração de redes e serviços em ambientes virtualizados
- Aprender sobre segurança de redes e segmentação de tráfego

## Contribuição

Sinta-se à vontade para contribuir com melhorias, sugestões ou correções através de pull requests.

---

Desenvolvido para fins educacionais e de experimentação em redes de computadores.