# React Blog

A modern, responsive blog website built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design
- 📝 Article display with Markdown support
- 🔍 Search and filter functionality for articles
- 🌙 Clean and accessible UI

## Tech Stack

- **React**: Frontend library for building user interfaces
- **TypeScript**: Static type-checking for improved developer experience
- **React Router**: Routing and navigation
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast, modern frontend build tool
- **Marked**: Markdown parser for rendering blog content
- **date-fns**: Date utility library
- **React Icons**: Icon library

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/react-blog.git
   cd react-blog
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Start the development server
   ```bash
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
react-blog/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable components
│   │   ├── layout/     # Layout components
│   │   └── ui/         # UI components
│   ├── data/           # Mock data
│   ├── features/       # Feature-specific components
│   │   └── blog/       # Blog-specific components
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── index.html          # HTML template
└── package.json        # Project dependencies and scripts
```

## Building for Production

To build the app for production, run:

```bash
bun run build
```

This will create a `dist` folder with all the optimized assets.

## Deployment

This project is configured for easy deployment on Netlify. Simply push to your GitHub repository and connect it to Netlify.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Unsplash for the beautiful images
- Tailwind CSS team for the amazing framework
- React team for the powerful library
