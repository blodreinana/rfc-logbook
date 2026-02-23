# 📝 Diário de Bordo - Programa de Estágio

## 1. Sobre o Projeto
Este repositório contém uma aplicação web simples e estilizada, desenvolvida para registrar minhas atividades diárias, aprendizados e desafios técnicos ao longo do meu programa de estágio. A ideia principal é manter um histórico organizado e de fácil acesso, rodando de forma leve diretamente no navegador.

## 2. Objetivos

### Objetivo Geral
Criar um espaço prático e agradável para documentar o progresso diário, facilitando o acompanhamento das tarefas e a comunicação nas reuniões de alinhamento da equipe.

### Objetivos Específicos
* **Organização e Histórico:** Manter um registro claro do desenvolvimento do projeto para apoiar a elaboração dos relatórios de estágio.
* **Estudo de Front-End:** Explorar HTML e CSS para criar uma interface criativa no estilo "Retro-Futurista", tornando o ato de documentar mais dinâmico.
* **Praticidade Técnica:** Utilizar tecnologias simples no lado do cliente (Client-Side), sem a necessidade de configurar servidores ou bancos de dados para uma rotina de anotações.

## 3. Tecnologias Utilizadas
O projeto foi construído de forma nativa e sem frameworks externos, utilizando:
* **HTML5:** Estruturação semântica da página.
* **CSS3:** Estilização da interface, com suporte dinâmico a temas (claro/escuro) e efeitos visuais inspirados em terminais clássicos.
* **JavaScript (Vanilla):** Lógica de navegação entre datas (calendário) e rotina de salvamento automático utilizando a API de `localStorage` do navegador.

## 4. Estrutura de Arquivos
A aplicação foi modularizada em uma pasta dedicada (`rfc`) para separar o logbook dos demais arquivos de dados e engenharia do projeto.

```text
rfc/
├── index.html     <-- Estrutura principal da página e interface
├── script.js      <-- Lógica de paginação e persistência de dados
└── style.css      <-- Regras de design e variáveis de tema
