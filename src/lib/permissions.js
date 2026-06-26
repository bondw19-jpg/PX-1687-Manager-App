import { ROLE_KEYS, normalizeRole } from './roles';

export const SHIFT_LEAD_PATHS = new Set([
  '/',
  '/checklist',
  '/daily-plan',
  '/tasks',
  '/announcements',
  '/interviews',
]);

export function canAccessPath(user, path) {
  const role = normalizeRole(user?.role, user?.email);
  if (role !== ROLE_KEYS.SHIFT_LEAD) return true;
  return SHIFT_LEAD_PATHS.has(path);
}

export const SHIFT_LEAD_FIRST_PATH = '/checklist';
