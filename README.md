# 🌤️ Weather Forecast

Uma aplicação moderna e elegante de previsão do tempo construída com Next.js 16, React 19 e Tailwind CSS 4.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)

## ✨ Features

- 🔍 **Busca por cidade** - Pesquise qualquer cidade do mundo
- 📍 **Geolocalização** - Use sua localização atual automaticamente
- 🌡️ **Clima atual** - Temperatura, sensação térmica, condições climáticas
- 📊 **Detalhes completos** - Umidade, vento, pressão, visibilidade, nuvens
- 🌅 **Horários solares** - Nascer e pôr do sol
- ⏰ **Previsão horária** - Próximas 24 horas
- 📅 **Previsão estendida** - Próximos 5 dias
- 🎨 **Gradientes dinâmicos** - Fundo muda de acordo com o clima
- 💫 **Animações suaves** - Interface fluida e responsiva
- 📱 **Design responsivo** - Funciona em qualquer dispositivo

## 🖼️ Preview

A interface apresenta:
- Efeitos de glassmorphism (vidro fosco)
- Ícones animados do clima
- Cards interativos com hover effects
- Transições suaves entre estados

## 🚀 Começando

### Pré-requisitos

- Node.js 18.17 ou superior
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/weather-forecast.git
cd weather-forecast
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a API key:

Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_WEATHER_API_KEY=sua_chave_aqui
```

> 📝 Obtenha sua chave gratuita em [WeatherAPI.com](https://www.weatherapi.com/)

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
app/
├── components/
│   ├── CurrentWeather.tsx    # Exibição do clima atual
│   ├── Forecast.tsx          # Previsão horária e diária
│   ├── SearchBar.tsx         # Barra de busca
│   ├── WeatherDetails.tsx    # Cards de detalhes
│   └── WeatherStates.tsx     # Estados de loading/erro/welcome
├── services/
│   └── weatherApi.ts         # Integração com WeatherAPI
├── types/
│   └── weather.ts            # Tipos TypeScript
├── globals.css               # Estilos e animações
├── layout.tsx                # Layout principal
└── page.tsx                  # Página inicial
```

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Cria a build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o linter |

## 🔧 Tecnologias

- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca UI
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utilitário
- **[React Icons](https://react-icons.github.io/react-icons/)** - Biblioteca de ícones
- **[WeatherAPI](https://www.weatherapi.com/)** - API de dados climáticos

## 🌈 Gradientes por Clima

| Clima | Gradiente |
|-------|-----------|
| ☀️ Ensolarado | Amarelo → Laranja → Rosa |
| ☁️ Nublado | Cinza claro → Cinza → Cinza escuro |
| 🌧️ Chuva | Azul → Azul escuro → Cinza |
| ⛈️ Tempestade | Roxo → Cinza escuro → Preto |
| ❄️ Neve | Azul claro → Azul → Branco |
| 🌫️ Névoa | Cinza claro → Cinza médio |

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

Desenvolvido com ❤️ usando Next.js e WeatherAPI
