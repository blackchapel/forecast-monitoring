<div align="center">
  <h1>Wind Generation Project</h1>
</div>

## Description

**Wind Generation Forecast Monitor** is an interactive web application that analyzes UK wind power generation forecasts versus actual generation data. It enables energy grid operators, planners, and analysts to visualize forecast accuracy and understand prediction reliability across different time horizons.

### Table of Contents

- [Description](#description)
  - [Table of Contents](#table-of-contents)
- [Project Structure](#project-structure)
  - [Directory Overview](#directory-overview)
- [Launch Project](#launch-project)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Build for Production](#build-for-production)
  - [Running the Analysis](#running-the-analysis)
  - [Available Scripts](#available-scripts)
- [Deployed Project Link](#deployed-project-link)

## Project Structure

```
wind-generation/
├── README.md
├── analysis/
│   └── wind_forecast_analysis.ipynb
└── app/
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README.md
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── public/
    └── src/
        ├── App.tsx
        ├── index.css
        ├── main.tsx
        ├── apis/
        │   └── index.ts
        ├── components/
        │   └── Chart.tsx
        ├── hooks/
        │   ├── useData.ts
        │   └── useDebounce.ts
        ├── types/
        │   └── index.ts
        └── utils/
            └── dataProcessor.ts
```

## Directory Overview

| Folder/File           | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `analysis/`           | Data analysis and forecasting notebooks                         |
| `app/`                | Main application directory with Vite + React + TypeScript setup |
| `app/src/`            | Source code for the application                                 |
| `app/src/apis/`       | API integration modules                                         |
| `app/src/components/` | React components                                                |
| `app/src/hooks/`      | Custom React hooks                                              |
| `app/src/types/`      | TypeScript type definitions                                     |
| `app/src/utils/`      | Utility functions and helpers                                   |
| `app/public/`         | Static public assets                                            |

## Launch Project

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository** (if not already done)

   ```bash
   cd wind-generation
   ```

2. **Install dependencies**

   ```bash
   cd app
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

```bash
npm run preview
```

The production build will be available at `http://localhost:4173`

### Running the Analysis

To explore the statistical analysis and data insights:

1. Navigate to the analysis folder and open the jupyter notebook
   ```bash
   cd analysis
   wind_forecast_analysis.ipynb
   ```

### Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint code quality checks

## Deployed Project Link

https://forecast-monitoring-xi.vercel.app/
