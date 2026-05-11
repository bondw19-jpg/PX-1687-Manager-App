export const STORE_ID = 'store_1687';
export const ADMIN_EMAIL = 'bondw19@gmail.com';

export const ROLE_KEYS = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SHIFT_LEAD: 'shift_lead',
};

export const ROLE_OPTIONS = [
  {
    value: ROLE_KEYS.ADMIN,
    label: 'Admin / Main Manager',
    shortLabel: 'Admin',
    description: 'Full access, including settings, backups, restores, and user-role controls.',
    rank: 100,
  },
  {
    value: ROLE_KEYS.MANAGER,
    label: 'Manager',
    shortLabel: 'Manager',
    description: 'Full daily manager access for current store operations.',
    rank: 80,
  },
  {
    value: ROLE_KEYS.SHIFT_LEAD,
    label: 'Shift Lead',
    shortLabel: 'Shift Lead',
    description: 'Future limited access for shift-level tools without admin controls.',
    rank: 40,
  },
];

const ROLE_VALUES = new Set(ROLE_OPTIONS.map(role => role.value));

export function normalizeRole(role, email = '') {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (normalizedEmail === ADMIN_EMAIL) return ROLE_KEYS.ADMIN;

  const normalizedRole = String(role || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (normalizedRole === 'shiftlead' || normalizedRole === 'lead' || normalizedRole === 'shift_leader') {
    return ROLE_KEYS.SHIFT_LEAD;
  }
  if (normalizedRole === 'store_manager' || normalizedRole === 'assistant_manager') {
    return ROLE_KEYS.MANAGER;
  }
  if (ROLE_VALUES.has(normalizedRole)) return normalizedRole;
  return ROLE_KEYS.MANAGER;
}

export function getRoleMeta(role, email = '') {
  const value = normalizeRole(role, email);
  return ROLE_OPTIONS.find(option => option.value === value) || ROLE_OPTIONS[1];
}

export function getRoleLabel(role, email = '') {
  return getRoleMeta(role, email).label;
}

export function getRoleShortLabel(role, email = '') {
  return getRoleMeta(role, email).shortLabel;
}

export function normalizeUserProfile(user, previousUser = null) {
  if (!user) return null;
  const merged = { ...(previousUser || {}), ...user };
  const role = normalizeRole(merged.role, merged.email);
  const roleMeta = getRoleMeta(role, merged.email);
  return {
    ...merged,
    role,
    roleLabel: roleMeta.label,
    storeId: merged.storeId || STORE_ID,
    permissionsVersion: 1,
  };
}

export function isAdminUser(user) {
  return normalizeRole(user?.role, user?.email) === ROLE_KEYS.ADMIN;
}

export function isManagerUser(user) {
  return [ROLE_KEYS.ADMIN, ROLE_KEYS.MANAGER].includes(normalizeRole(user?.role, user?.email));
}

export function isShiftLeadUser(user) {
  return normalizeRole(user?.role, user?.email) === ROLE_KEYS.SHIFT_LEAD;
}

export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_ASSOCIATES: 'manage_associates',
  MANAGE_UNIFORMS: 'manage_uniforms',
  MANAGE_NOTES: 'manage_notes',
  MANAGE_TASKS: 'manage_tasks',
  MANAGE_CHECKLISTS: 'manage_checklists',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_BACKUPS: 'manage_backups',
  MANAGE_USERS: 'manage_users',
};

const ROLE_PERMISSION_MAP = {
  [ROLE_KEYS.ADMIN]: new Set(Object.values(PERMISSIONS)),
  [ROLE_KEYS.MANAGER]: new Set([
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_ASSOCIATES,
    PERMISSIONS.MANAGE_UNIFORMS,
    PERMISSIONS.MANAGE_NOTES,
    PERMISSIONS.MANAGE_TASKS,
    PERMISSIONS.MANAGE_CHECKLISTS,
  ]),
  [ROLE_KEYS.SHIFT_LEAD]: new Set([
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_NOTES,
    PERMISSIONS.MANAGE_TASKS,
    PERMISSIONS.MANAGE_CHECKLISTS,
  ]),
};

export function hasPermission(user, permission) {
  const role = normalizeRole(user?.role, user?.email);
  return ROLE_PERMISSION_MAP[role]?.has(permission) || false;
}
