# Breakfast333 Menu

A modern breakfast menu website built with Deno and Vue 3.

## Features

- 🦕 Built with Deno and Vue 3
- 🎨 Modern and responsive design
- 🔍 Filter menu items by category
- 📱 Mobile-friendly layout
- 🚀 Deployable to GitHub Pages

## Prerequisites

- [Deno](https://deno.land/) v1.35.0 or higher

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/breakfast333-menu.git
cd breakfast333-menu
```

2. Start the development server:

```bash
deno task dev
```

This will start the development server at http://localhost:5173/

## Building for Production

To build the project for production:

```bash
deno task build
```

This will generate static files in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
deno task preview
```

## Serving Static Files

To serve the static files using Deno's file server:

```bash
deno task serve
```

## Deployment to GitHub Pages

This project includes a GitHub Actions workflow that automatically builds and deploys the site to GitHub Pages when changes are pushed to the main branch.

To set up GitHub Pages deployment:

1. Push your code to a GitHub repository
2. Go to your repository settings
3. Navigate to the "Pages" section
4. Set the source to "GitHub Actions"

The site will be automatically deployed when you push to the main branch.

## License
MIT
