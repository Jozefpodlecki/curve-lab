# Curve Lab

Curve Lab is a desktop application for visualizing and exploring mathematical curves, built with [Tauri](https://tauri.app/), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/). The app provides interactive visualizations for several famous curves, including:

- **Butterfly Curve**
- **Rose Curve**
- **Lissajous Curve**
- **Fractal**

## Features

- Interactive sidebar navigation for selecting different curve types
- Real-time parameter adjustment for each curve (e.g., points, scale, mode)
- Responsive canvas rendering
- Modern UI styled with [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Rust](https://www.rust-lang.org/) (for Tauri backend)

### Install dependencies

```sh
cd web
npm install
```

### Run the development server

```sh
npm run dev
```

### Build for production

```sh
npm run build
```

## Project Structure

- [`web/`](web/): Frontend React app (UI, curve rendering, navigation)
- [`app/`](app/): Tauri backend (Rust)

## License

MIT

---

> This project is a template for experimenting with mathematical curve visualizations in a modern desktop app.

## Credits

<a href="https://www.flaticon.com/free-icons/geometry" title="geometry icons">Geometry icons created by Chattapat - Flaticon</a>