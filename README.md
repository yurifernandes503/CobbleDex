# 📱 CobbleDex

<div align="center">

### Companion App para jogadores de Cobblemon

Aplicativo mobile desenvolvido em React Native para auxiliar jogadores com informações de Pokémon, spawns, biomas, favoritos e montagem de equipes.

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

</div>

---

## 📖 Sobre o Projeto

O CobbleDex é um companion app desenvolvido para jogadores de Cobblemon.

O objetivo do aplicativo é centralizar informações importantes sobre Pokémon em uma interface moderna e intuitiva, permitindo consultas rápidas durante a gameplay.

O sistema foi desenvolvido como projeto acadêmico da disciplina **Programação Para Dispositivos Móveis em Android**, utilizando React Native e Expo.

---

## ✨ Funcionalidades

### 🔍 Pokédex

- Consulta de Pokémon
- Busca por nome
- Informações detalhadas
- Visualização de tipos

### 🌎 Informações de Spawn

- Bioma
- Dimensão
- Horário
- Raridade
- Ambiente de spawn

### ⭐ Favoritos

- Adicionar Pokémon favoritos
- Persistência local
- Organização personalizada

### ⚔️ Team Builder

- Montagem de equipes
- Análise de composição
- Avaliação de cobertura de tipos

### 🌐 Internacionalização

- Português (Brasil)
- Inglês

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Finalidade |
|------------|------------|
| React Native | Desenvolvimento Mobile |
| Expo | Ambiente de execução |
| TypeScript | Tipagem e organização |
| AsyncStorage | Persistência local |
| React Navigation | Navegação entre telas |

---

## 📂 Estrutura do Projeto

```txt
src/
│
├── components/
│   ├── ui/
│   └── cards/
│
├── screens/
│   ├── Home
│   ├── Pokedex
│   ├── PokemonDetail
│   ├── Favorites
│   └── TeamBuilder
│
├── context/
│
├── services/
│
├── data/
│
├── utils/
│
└── styles/
```

---

## 📱 Principais Telas

### Home

Tela inicial com atalhos rápidos e destaques.

### Pokédex

Consulta completa dos Pokémon disponíveis.

### Pokémon Detail

Informações detalhadas:

- Tipos
- Status
- Spawn
- Evoluções
- Golpes

### Team Builder

Montagem estratégica de equipes.

---

## 💾 Persistência de Dados

O aplicativo utiliza AsyncStorage para armazenar:

- Favoritos
- Idioma selecionado
- Equipes criadas

Isso permite que as informações permaneçam disponíveis mesmo após fechar o aplicativo.

---

## 🚀 Como Executar

### Instalar dependências

```bash
npm install
```

### Executar projeto

```bash
npx expo start
```

### Executar com limpeza de cache

```bash
npx expo start --clear
```

---

## 🧪 Testes

Os testes foram realizados utilizando:

- Expo Go
- Android
- Ambiente local de desenvolvimento

Foram validados:

- Navegação
- Persistência
- Busca
- Favoritos
- Team Builder

---

## 🎯 Aprendizados

Durante o desenvolvimento foram estudados:

- Desenvolvimento Mobile
- React Native
- Estruturação de Componentes
- Navegação entre Telas
- Persistência Local
- Design Mobile First
- Organização de Projetos

---

## 🔮 Melhorias Futuras

- APK próprio
- Login de usuário
- API dedicada
- Mais gerações de Pokémon
- Sistema online
- Banco de dados remoto

---

## 👨‍💻 Autor

**Yuri de Jesus Fernandes Mendes**

Projeto desenvolvido para a disciplina:

**Programação Para Dispositivos Móveis em Android**  
**UNIRUY / Wyden**  
**Professor Enderson Santos**

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos.
