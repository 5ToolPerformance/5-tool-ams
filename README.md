# Next.js Starter Template 🚀

A modern, opinionated starter template for building robust and scalable Next.js applications. This template integrates essential tools and configurations to streamline your development workflow. This was an educational project completed by following a tutorial from Syntax on [YouTube](https://www.youtube.com/watch?v=dLRKV-bajS4&t)

## 📦 Features

- **Next.js 15** with the App Router and React 18
- **TypeScript** for static typing
- **Tailwind CSS 3** for utility-first styling
- **ESLint** and **Prettier** for code quality and formatting
- **Husky** and **lint-staged** for Git hooks and pre-commit checks
- **Absolute Imports** using the `@` prefix
- **pnpm** as the package manager for faster installs and disk space efficiency

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [pnpm](https://pnpm.io/) (v7 or later)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/JSakuraa/nextjs-starter.git
   cd nextjs-starter
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🧪 Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to analyze code for potential errors.
- `pnpm format`: Formats code using Prettier.

## 📁 Project Structure

```
├── public/             # Static assets
├── src/                # Application source code
│   ├── app/            # Next.js App Router pages
│   ├── components/     # Reusable UI components
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions
├── .eslintrc.json      # ESLint configuration
├── .prettierrc         # Prettier configuration
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project metadata and scripts
```

## 🎨 Styling

This template uses **Tailwind CSS** for styling. You can customize the design by editing the `tailwind.config.js` file and adding your styles in the `src/styles` directory.

## ✅ Linting and Formatting

- **ESLint** is configured to analyze your code for potential errors and enforce coding standards.
- **Prettier** is set up to automatically format your code for consistency.
- **Husky** and **lint-staged** run linting and formatting checks before each commit.

## 📦 Absolute Imports

The project uses absolute imports with the `@` prefix:

```tsx
import Header from '@/components/Header';
```

This simplifies import paths and improves code readability.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize this template to suit your needs. Happy coding! 🎉
```
