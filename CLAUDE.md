## CLAUDE.md: Hackathon Frontend Project (React + Next.js)

This document provides guidelines for Claude to quickly and consistently develop the **React and Next.js**-based frontend project during the hackathon.

---

### 1. Project Goal & Context

* **Objective:** To rapidly prototype an idea and build a demonstrable web application within the hackathon timeframe.
* **User:** The primary developer is a beginner in frontend development. If you write complex concepts or code, please add comments or explanations to make them easy to understand.
* **Core Principle:** **"Completion over perfection."** Development speed is the top priority. Do not focus on production-level optimization or code quality for now.

---

### 2. Tech Stack

* **Framework:** **Next.js** (Based on React)
* **Language:** **TypeScript**
* **Styling:** **Tailwind CSS**. All styling should be handled using Tailwind CSS utility classes. Avoid writing separate CSS files.
* **Package Manager:** Use `yarn`.
* **Linting & Formatting:** **Biome** (replaces ESLint and Prettier)
* **Git Hooks:** **Husky** with **lint-staged** for automatic linting on commit

---

### 3. Project Structure (Based on Next.js App Router)

* **`app/`**: This is the core directory where the application's source code is located.
    * **`layout.tsx`**: The top-level layout component that applies to all pages.
    * **`page.tsx`**: Page components that define the default UI for a specific route.
    * **`api/`**: You can define API routes here to handle backend logic.
* **`components/`**: A directory for storing reusable React components. (Please create it if it doesn't exist.)
    * All UI elements (buttons, cards, modals, etc.) should be created here with filenames in `PascalCase`.
* **`public/`**: The place to store static assets like images and fonts.

---

### 4. Key Commands

* **Run development server:** `yarn dev`
* **Create production build:** `yarn build`
* **Start production server:** `yarn start`
* **Run linter:** `yarn lint`
* **Fix linting issues:** `yarn lint:fix`
* **Format code:** `yarn format`

---

### 5. Coding Style & Rules

* **Components:**
    * All components should be written as functional components using Hooks (`useState`, `useEffect`, etc.).
* **File and Folder Naming Conventions:**
    * **Component files:** `PascalCase.tsx` (e.g., `MyButton.tsx`)
* **API Requests:**
    * For client-side data fetching, using libraries like `SWR` or `React Query` is recommended.
    * Simple backend functionality can be implemented directly using API Routes in the `app/api/` folder.
* **State Management:**
    * For simple state, use `useState`. If complex state management across multiple components is needed, use the `Context API` or `Zustand`.
* **Environment Variables:**
    * Sensitive information like API keys should be stored in a `.env.local` file. Variables that need to be accessed on the client side must start with the `NEXT_PUBLIC_` prefix.

---

### 6. UI Component Library (Optional)

* For rapid UI development, consider using a component library that integrates well with Tailwind CSS.
* **Recommendation:** **shadcn/ui**. It's not a traditional component library, but a collection of reusable components that you can copy and paste into your project.
* **Installation:** `npx shadcn-ui@latest init`

---
