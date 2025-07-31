/**
 * Normalizes user type from TypeORM entity names to our expected format
 * e.g., "UniversityAdmin" -> "university_admin"
 */
export function normalizeUserType(type: string): string {
  // If already in correct format, return as is
  if (type.includes('_')) {
    return type.toLowerCase();
  }
  
  // Convert from PascalCase to snake_case
  return type
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Gets the normalized user type for comparisons
 */
export function getUserType(user: { type: string } | null): string | null {
  if (!user) return null;
  return normalizeUserType(user.type);
}
