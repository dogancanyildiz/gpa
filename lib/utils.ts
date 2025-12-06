import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Round a number up to 2 decimal places
 * @param value The number to round up
 * @returns The rounded up value formatted to 2 decimal places
 */
export function roundUp(value: number): string {
  return (Math.ceil(value * 100) / 100).toFixed(2)
}

/**
 * Round a number up to the nearest integer
 * @param value The number to round up
 * @returns The rounded up integer value as a string
 */
export function roundUpToInteger(value: number): string {
  return Math.ceil(value).toString()
}
