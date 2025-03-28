import { BlogPost } from '../types/blog';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React in 2024',
    slug: 'getting-started-with-react-2024',
    excerpt: 'Learn how to build modern web applications with React in 2024. This guide covers everything from setup to advanced patterns.',
    content: `
# Getting Started with React in 2024

React continues to be one of the most popular JavaScript libraries for building user interfaces. Whether you're just starting out or looking to refresh your knowledge, this guide will help you get up to speed with React in 2024.

## Setting Up Your Development Environment

To get started with React, you'll need Node.js and a package manager like npm or Yarn. Here's how to set up a new React project:

\`\`\`bash
# Using npm
npm create vite@latest my-react-app -- --template react-ts

# Using Yarn
yarn create vite my-react-app --template react-ts
\`\`\`

Vite provides a faster and leaner development experience compared to Create React App, which was the standard for many years.

## Key Concepts

### Components

Components are the building blocks of React applications. They are reusable pieces of code that can be composed together to build complex UIs.

\`\`\`jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

### Hooks

Hooks let you use state and other React features without writing classes. The most commonly used hooks are useState and useEffect.

\`\`\`jsx
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Modern React Patterns

React has evolved over the years, and there are several modern patterns worth learning:

- **Component Composition**: Compose components together to build complex UIs
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Context API**: Share state across components without prop drilling
- **Suspense**: Handle loading states declaratively

## Conclusion

React continues to evolve, but the core concepts remain the same. By understanding components, hooks, and modern patterns, you'll be well on your way to building great applications with React in 2024.
    `,
    publishedDate: new Date('2024-01-15'),
    coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'React',
    tags: ['React', 'JavaScript', 'Web Development']
  },
  {
    id: '2',
    title: 'Understanding TypeScript with React',
    slug: 'understanding-typescript-with-react',
    excerpt: 'TypeScript adds static typing to JavaScript, making your React applications more robust and easier to maintain.',
    content: `
# Understanding TypeScript with React

TypeScript has become an essential tool for React developers. By adding static types to JavaScript, it helps catch errors earlier in the development process and improves the developer experience.

## Why Use TypeScript with React?

- **Type Safety**: Catch type-related errors at compile time rather than runtime
- **Better IDE Support**: Enhanced autocomplete, navigation, and refactoring
- **Improved Documentation**: Types serve as documentation for your code
- **Safer Refactoring**: Make changes with confidence

## Getting Started

To create a new React project with TypeScript, you can use Vite:

\`\`\`bash
npm create vite@latest my-react-ts-app -- --template react-ts
\`\`\`

## Type Definitions for React Components

When using TypeScript with React, you'll define types for your component props:

\`\`\`tsx
interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

function Button({ text, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
\`\`\`

## Typing Hooks

TypeScript works well with React hooks:

\`\`\`tsx
interface User {
  id: string;
  name: string;
  email: string;
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user');
        const data: User = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
\`\`\`

## Best Practices

- Use interfaces for objects that have a specific shape
- Use type for unions, intersections, and mapped types
- Leverage TypeScript's type inference when possible
- Avoid using "any" as it defeats the purpose of TypeScript

## Conclusion

TypeScript adds a valuable layer of type safety to React applications. While there is a learning curve, the benefits in terms of code quality and developer experience make it well worth the investment.
    `,
    publishedDate: new Date('2024-02-02'),
    coverImage: 'https://images.unsplash.com/photo-1610986603166-f78428624e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'TypeScript',
    tags: ['TypeScript', 'React', 'JavaScript']
  },
  {
    id: '3',
    title: 'Building a Blog with React and Tailwind CSS',
    slug: 'building-blog-react-tailwind',
    excerpt: 'Learn how to create a beautiful, responsive blog using React and Tailwind CSS. This step-by-step guide covers everything you need to know.',
    content: `
# Building a Blog with React and Tailwind CSS

Creating a blog with React and Tailwind CSS is a great way to learn both technologies while building something useful. In this guide, we'll walk through the process of creating a responsive blog with modern design principles.

## Setting Up the Project

We'll start by creating a new React project with Vite and adding Tailwind CSS:

\`\`\`bash
# Create a new React project
npm create vite@latest react-blog -- --template react

# Navigate to the project directory
cd react-blog

# Install dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## Configure Tailwind CSS

Update the tailwind.config.js file:

\`\`\`js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

Add the Tailwind directives to your CSS file:

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

## Creating the Blog Components

Let's build the main components for our blog:

### Layout Component

\`\`\`jsx
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation content */}
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-white">
        {/* Footer content */}
      </footer>
    </div>
  );
}
\`\`\`

### Blog Card Component

\`\`\`jsx
function BlogCard({ title, excerpt, date, author, image }) {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-lg">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h2>

        <p className="text-gray-600 mb-4">
          {excerpt}
        </p>

        <div className="flex items-center justify-between">
          <span>{author}</span>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
      </div>
    </article>
  );
}
\`\`\`

## Styling with Tailwind

Tailwind CSS makes it easy to create responsive, beautiful designs without writing custom CSS. Here are some key Tailwind concepts used in our blog:

- **Utility-First**: Compose designs by applying utility classes directly in your markup
- **Responsive Design**: Use responsive modifiers (sm, md, lg, xl) to apply styles at different breakpoints
- **Flexbox & Grid**: Easily create layouts with Tailwind's flexbox and grid utilities
- **Customization**: Extend the default theme in tailwind.config.js

## Adding Functionality

To make our blog functional, we'll need to:

1. Set up routing with React Router
2. Create a data source for blog posts (this could be a CMS, API, or local files)
3. Implement features like search, filtering by category, and pagination

## Deployment

Once your blog is ready, you can deploy it to platforms like Vercel, Netlify, or GitHub Pages.

## Conclusion

Building a blog with React and Tailwind CSS is a rewarding project that showcases the power and flexibility of these technologies. By following this guide, you now have a foundation for creating your own customized blog.
    `,
    publishedDate: new Date('2024-02-20'),
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Web Design',
    tags: ['React', 'Tailwind CSS', 'Web Development', 'Design']
  },
  {
    id: '4',
    title: 'State Management in React: A Comprehensive Guide',
    slug: 'state-management-react-comprehensive-guide',
    excerpt: 'Explore different state management solutions in React, from built-in hooks to third-party libraries like Redux and Zustand.',
    content: `
# State Management in React: A Comprehensive Guide

State management is one of the most important aspects of building React applications. As your app grows, managing state becomes more complex. This guide explores various state management options in React and helps you choose the right one for your project.

## Local State with useState

The useState hook is perfect for managing local component state:

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

## Complex Local State with useReducer

When state logic becomes complex, useReducer provides a more structured approach:

\`\`\`jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
\`\`\`

## Sharing State with Context API

React's Context API allows you to share state across components without prop drilling:

\`\`\`jsx
// Create a context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer component
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      className={\`btn-\${theme}\`}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      Toggle Theme
    </button>
  );
}
\`\`\`

## Third-Party State Management Libraries

### Redux

Redux is a predictable state container with a centralized store:

\`\`\`jsx
// Store setup
import { createStore } from 'redux';

function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore(counterReducer);

// Component with Redux
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}
\`\`\`

### Zustand

Zustand is a minimalistic state management solution:

\`\`\`jsx
import create from 'zustand';

const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
}));

function Counter() {
  const { count, increment, decrement } = useStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
\`\`\`

## Server State Management

For data fetching and server state, consider libraries like React Query or SWR:

\`\`\`jsx
import { useQuery } from 'react-query';

function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery(['user', userId],
    () => fetch(\`/api/users/\${userId}\`).then(res => res.json())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
\`\`\`

## Choosing the Right Solution

Here's a guide to help you choose:

- **Small App**: useState and useReducer
- **Medium App**: Context API or Zustand
- **Large App**: Redux (or Redux Toolkit) or Recoil
- **Server State**: React Query or SWR

## Conclusion

State management in React has evolved significantly over the years. The best approach depends on your specific requirements, team familiarity, and project size. Remember that simpler solutions are often better until proven otherwise.
    `,
    publishedDate: new Date('2024-03-05'),
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'React',
    tags: ['React', 'State Management', 'Redux', 'Context API']
  },
  {
    id: '5',
    title: 'Creating Accessible Web Applications',
    slug: 'creating-accessible-web-applications',
    excerpt: 'Learn how to build web applications that are accessible to everyone, including people with disabilities.',
    content: `
# Creating Accessible Web Applications

Web accessibility ensures that websites and applications are usable by everyone, including people with disabilities. This guide explores key principles and practical techniques for building accessible React applications.

## Why Accessibility Matters

- **Inclusive Design**: Ensure your application can be used by as many people as possible
- **Legal Requirements**: Many countries have laws requiring digital accessibility
- **SEO Benefits**: Many accessibility practices also improve search engine optimization
- **Better UX for Everyone**: Accessible designs often lead to better user experiences for all users

## Key Accessibility Principles

### 1. Semantic HTML

Use the right HTML elements for their intended purpose:

\`\`\`jsx
// Bad - not semantic
<div className="button" onClick={handleClick}>Click Me</div>

// Good - semantic
<button onClick={handleClick}>Click Me</button>
\`\`\`

### 2. Keyboard Navigation

Ensure all interactive elements can be accessed and used with a keyboard:

\`\`\`jsx
function AccessibleButton() {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      className={isActive ? 'active' : ''}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsActive(!isActive);
        }
      }}
      onClick={() => setIsActive(!isActive)}
    >
      Toggle
    </button>
  );
}
\`\`\`

### 3. Focus Management

Properly manage focus for a better keyboard navigation experience:

\`\`\`jsx
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the modal when it opens
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    </div>
  );
}
\`\`\`

### 4. ARIA Attributes

Use ARIA (Accessible Rich Internet Applications) attributes when necessary:

\`\`\`jsx
function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            id={\`tab-\${index}\`}
            aria-selected={activeTab === index}
            aria-controls={\`panel-\${index}\`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          id={\`panel-\${index}\`}
          aria-labelledby={\`tab-\${index}\`}
          hidden={activeTab !== index}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
\`\`\`

### 5. Color and Contrast

Ensure sufficient color contrast for text and interactive elements:

\`\`\`jsx
// Good contrast example
<button className="bg-blue-800 text-white">
  Submit
</button>

// Bad contrast example
<button className="bg-blue-200 text-gray-300">
  Submit
</button>
\`\`\`

## Tools for Testing Accessibility

- **Automated Testing**: Use tools like Axe, Lighthouse, or WAVE
- **Screen Reader Testing**: Test with screen readers like NVDA, JAWS, or VoiceOver
- **Keyboard Testing**: Navigate your application using only the keyboard

## React-Specific Accessibility Tips

- Use React's built-in support for aria-* and data-* attributes
- Consider using libraries like react-aria or @react-aria/focus for complex interactions
- Implement focus management for modal dialogs and similar components
- Use CSS-in-JS or utility classes to ensure consistent styling for focus states

## Conclusion

Building accessible applications is not just the right thing to do—it's essential for creating truly inclusive digital experiences. By incorporating these practices into your development workflow, you'll ensure that your React applications can be used by the widest possible audience.
    `,
    publishedDate: new Date('2024-03-15'),
    coverImage: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Accessibility',
    tags: ['Accessibility', 'React', 'Web Development', 'UX']
  }
];
