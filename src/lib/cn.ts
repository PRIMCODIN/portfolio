/** Une clases ignorando los valores vacíos o condicionales. */
export function cn(...clases: (string | false | null | undefined)[]): string {
  return clases.filter(Boolean).join(" ");
}
