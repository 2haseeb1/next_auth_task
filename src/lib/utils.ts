// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns"; 
/**
 * A utility function to conditionally join Tailwind CSS classes.
 * Uses `clsx` for conditional classes and `tailwind-merge` for resolving conflicts.
 * @param inputs ClassValue[] - An array of class names, objects, or arrays.
 * @returns string - The merged string of class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object or date string into a human-readable string.
 * Provides sensible defaults and allows custom options.
 * @param dateInput The date to format (Date object, ISO string, or undefined/null).
 * @param options Intl.DateTimeFormatOptions for customizing the output.
 * @returns Formatted date string, 'N/A' for null/undefined, or 'Invalid Date' for unparseable input.
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return format(date, "MMM dd,PPPP hh:mm a"); // Example format. Changed PPPP for full date if needed.
  } catch (e) {
    console.error("Invalid date for formatDate:", dateString, e);
    return "Invalid Date";
  }
}

/**
 * Capitalizes the first letter of a string.
 * @param str The input string.
 * @returns The string with its first letter capitalized, or an empty string if input is null/undefined.
 */
export function capitalizeFirstLetter(str: string | null | undefined): string {
  if (!str) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Debounces a function, delaying its execution until after a certain
 * amount of time has passed since the last invocation.
 * Useful for optimizing event handlers that fire frequently (e.g., input, scroll).
 *
 * @param func The function to debounce.
 * @param delay The delay in milliseconds.
 * @returns A debounced version of the function.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    // Removed: const context = this;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      // Use 'this' directly, as the arrow function for setTimeout captures it lexically
      func.apply(this, args);
      timeoutId = null; // Clear timeoutId after function execution
    }, delay);
  };
}

/**
 * Copies text to the user's clipboard.
 * Provides a simple way to implement "copy to clipboard" functionality.
 * Requires the Clipboard API, which is available in modern browsers.
 * @param text The text string to copy.
 * @returns Promise<boolean> - Resolves to true if successful, false otherwise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy text using Clipboard API:", err);
      return false;
    }
  } else {
    // Fallback for older browsers or non-secure contexts
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch (err) {
      console.error("Failed to copy text using execCommand:", err);
      document.body.removeChild(textarea);
      return false;
    }
  }
}

/**
 * Gets a specific query parameter value from the current URL.
 * Requires `useSearchParams` from `next/navigation` in the component.
 * @param paramName The name of the query parameter.
 * @param searchParams The result of `useSearchParams()`.
 * @returns The value of the query parameter, or null if not found.
 */
export function getQueryParam(
  paramName: string,
  searchParams: URLSearchParams
): string | null {
  return searchParams.get(paramName);
}

/**
 * Creates a new URLSearchParams object with an updated or added query parameter.
 * Useful for building new URLs for navigation or API calls.
 * @param currentSearchParams The current URLSearchParams object.
 * @param paramName The name of the parameter to set.
 * @param paramValue The value to set the parameter to. If null or empty string, the parameter is removed.
 * @returns A new URLSearchParams object.
 */
export function setQueryParam(
  currentSearchParams: URLSearchParams,
  paramName: string,
  paramValue: string | null | undefined
): URLSearchParams {
  const newSearchParams = new URLSearchParams(currentSearchParams.toString());
  if (paramValue === null || paramValue === undefined || paramValue === "") {
    newSearchParams.delete(paramName);
  } else {
    newSearchParams.set(paramName, paramValue);
  }
  return newSearchParams;
}
