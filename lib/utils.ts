// /**
//  * Formats a file name to a shorter, user-friendly version (e.g., truncates long names).
//  */
// export function formatFileName(name: string, maxLength = 30): string {
//   if (name.length <= maxLength) return name;
//   const ext = name.includes(".") ? "." + name.split(".").pop() : "";
//   return name.slice(0, maxLength - ext.length - 3) + "..." + ext;
// }

// /**
//  * Stub: Calculates a match score between two strings (e.g., resume and JD).
//  * Returns a number between 0 and 100.
//  */
// export function calculateMatchScore(_resume: string, _jd: string): number {
//   // TODO: Implement real logic
//   return Math.floor(Math.random() * 101); // Random for now
// }

// /**
//  * Capitalizes the first letter of a string.
//  */
// export function capitalize(str: string): string {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }
