# Isosketches

Isosketches is an Astro-based project that integrates React and p5.js to create animated, isometric sketches. The project demonstrates how to use Astro with modern front-end technologies to build interactive, visually engaging web experiences.

This is mostly a test project to test the capabilities of various AI models at creating graphics and animations. The following models have been used:

-   OpenAI 03-mini
-   Claude 3.5 Sonnet

## Overview

This repository includes:

-   **Astro Setup:** A basic Astro project structure with a custom layout and integrated Tailwind CSS for styling.
-   **React Components:** Including a welcome component and a layout component that manage the overall look and feel.
-   **p5.js Sketches:** A dynamic p5.js sketch that generates animated isometric diamond grids. The sketch is encapsulated in a React component to leverage Astro's client-side interactivity.

## Running Locally

### Prerequisites

-   Node.js (v14+ recommended)
-   Yarn (v4.6.0 as specified in the repository)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/isosketches.git
cd isosketches
```

2. **Install dependencies:**

```bash
yarn install
```

### Development Server

To start the development server, run:

```bash
yarn dev
```

This command starts the Astro development server. Open your browser and navigate to `http://localhost:3000` to view the project.

### Building for Production

To build the project for production, run:

```bash
yarn build
```

After the build completes, you can preview the production build locally:

```bash
yarn preview
```

## Project Structure

-   `src/components/`: Contains the React components used in the application.
-   `src/layouts/`: Contains layout templates for consistent page structure.
-   `src/pages/`: Includes the main pages. For example, the `index.astro` file serves as the homepage and `1.astro` loads the p5.js sketch.
-   `src/sketches/`: Contains the p5.js sketches wrapped in React components.
-   `src/styles/`: Global styles, including Tailwind CSS integration.
