# 📦 GB WMS — Warehouse Management System

Sistema web de gerenciamento de estoque desenvolvido para simular e organizar operações logísticas de um armazém.

O **GB WMS** centraliza o controle de produtos, estoque, fornecedores, movimentações, inventários, transferências e indicadores operacionais em uma interface web responsiva e organizada.

> Projeto desenvolvido para aplicação prática de conceitos de desenvolvimento web e processos de logística/WMS.

---
## 🖥️ Preview do sistema

![Dashboard do GB WMS](assets/dashboard.png)

## 🌐 Demonstração online

🚀 **[Acessar o GB WMS](https://gabrielrabello879.github.io/GB-WMS/)**

O sistema pode ser testado diretamente pelo navegador, sem necessidade de instalação.

## 🚀 Funcionalidades

### 📊 Dashboard
- Visão geral da operação
- Indicadores de estoque
- Acompanhamento de movimentações
- Visualização gráfica de dados operacionais
- Identificação de itens em situação crítica

### 📦 Produtos
- Cadastro de produtos
- Controle por SKU
- Categoria e unidade de medida
- Endereçamento de estoque
- Definição de estoque mínimo
- Ativação e inativação de produtos
- Bloqueio de SKUs duplicados
- Identificação automática do status do estoque

### 🏭 Controle de Estoque
- Registro de entradas
- Registro de saídas
- Ajustes de estoque
- Atualização automática do saldo
- Validação de estoque disponível
- Previsão do saldo após cada operação

### 🚚 Fornecedores
- Cadastro de fornecedores
- CNPJ
- Razão social e nome fantasia
- Informações de contato
- Ativação e inativação
- Associação do fornecedor aos recebimentos

### 🔄 Movimentações
- Histórico de entradas
- Histórico de saídas
- Ajustes de estoque
- Registro de produto e quantidade
- Saldo anterior e saldo posterior
- Documento da operação
- Data e hora
- Responsável pela movimentação

### 🔁 Transferências
- Movimentação de mercadorias entre endereços
- Preservação do saldo total do estoque
- Registro da movimentação para rastreabilidade

### 📋 Inventário
- Contagem física de produtos
- Comparação entre estoque sistêmico e estoque físico
- Identificação de divergências
- Geração de código de inventário
- Registro e acompanhamento das contagens

### 📈 Relatórios
- Análise de estoque
- Movimentações
- Inventários
- Indicadores operacionais

---

## 🛠️ Tecnologias utilizadas

- **HTML5**
- **CSS3**
- **JavaScript**
- **LocalStorage**
- **Chart.js**
- **Git**
- **GitHub**

---

## 💾 Persistência de dados

Nesta versão, o sistema utiliza o **LocalStorage do navegador** para persistência dos dados.

São armazenadas localmente informações relacionadas a:

- Produtos
- Fornecedores
- Movimentações
- Inventários

Isso permite utilizar e testar o sistema diretamente no navegador sem necessidade de configuração de banco de dados ou servidor.

---

## 🎯 Objetivo do projeto

O GB WMS foi desenvolvido com o objetivo de aplicar conceitos de desenvolvimento web a um cenário real de logística e gerenciamento de estoque.

O projeto trabalha conceitos como:

- Manipulação do DOM
- Estruturas de dados em JavaScript
- Validação de formulários
- Persistência local
- Regras de negócio
- Controle de estoque
- Rastreabilidade de operações
- Interface orientada a sistemas administrativos

---

## 🖥️ Executando o projeto

Clone o repositório:

```bash
git clone https://github.com/gabrielrabello879/GB-WMS.git
```

Acesse a pasta:

```bash
cd GB-WMS
```

Depois, abra o arquivo:

```text
index.html
```

em seu navegador.

Também é possível executar o projeto utilizando a extensão **Live Server** no Visual Studio Code.

---

## 🔮 Próximas melhorias

Algumas evoluções planejadas para o projeto:

- Backend dedicado
- Banco de dados
- Sistema de autenticação
- Perfis e níveis de acesso
- API para gerenciamento das operações
- Deploy completo da aplicação
- Testes automatizados

---

## 👨‍💻 Autor

**Gabriel Rabello Peres**

Desenvolvedor Web

GitHub: **@gabrielrabello879**