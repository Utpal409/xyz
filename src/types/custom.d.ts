// Custom type declarations for missing libraries
declare module 'tailwindcss-animate' {
  const content: any;
  export default content;
}

declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}

// Add missing JSX namespace if needed
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
} 