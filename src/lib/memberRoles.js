import { serverTimestamp, doc, getDoc, setDoc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import { getFirebaseModules } from './firebase';
import { ADMIN_EMAIL, STORE_ID, ROLE_KEYS, normalizeRole, normalizeUserProfile } from './roles';

const memberRef = (db, uid) => doc(db, 'stores', STORE_ID, 'members', uid);
const presenceRef = (db, uid) => doc(db, 'stores', STORE_ID, 'presence', uid);

function authUserToBaseProfile(authUser, fallback = {}) {
  const email = authUser?.email || fallback.email || '';
  const role = normalizeRole(fallback.role, email);
  return normalizeUserProfile({
    uid: authUser?.uid || fallback.uid,
    email,
    name: authUser?.displayName || fallback.name || email.split('@')[0] || 'Unknown User',
    role,
    storeId: STORE_ID,
    status: fallback.status || 'active',
    disabled: fallback.disabled === true,
  });
}

export async function loadOrCreateMemberProfile(authUser, fallback = {}) {
  if (!authUser?.uid || authUser.uid === 'demo_user') {
    return authUserToBaseProfile(authUser, fallback);
  }

  const { db } = await getFirebaseModules();
  const ref = memberRef(db, authUser.uid);
  const snap = await getDoc(ref);
  const baseProfile = authUserToBaseProfile(authUser, fallback);
  let profile;

  if (snap.exists()) {
    profile = normalizeUserProfile({
      ...baseProfile,
      ...snap.data(),
      uid: authUser.uid,
      email: authUser.email || snap.data().email || baseProfile.email,
      name: snap.data().name || authUser.displayName || baseProfile.name,
      lastLoginAt: new Date().toISOString(),
    });
  } else {
    profile = normalizeUserProfile({
      ...baseProfile,
      role: normalizeRole(baseProfile.role || ROLE_KEYS.MANAGER, baseProfile.email),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    });
  }

  if (profile.disabled === true || profile.status === 'disabled') {
    const err = new Error('account-disabled');
    err.code = 'account-disabled';
    throw err;
  }

  const writableProfile = {
    uid: profile.uid,
    email: profile.email,
    name: profile.name,
    role: normalizeRole(profile.role, profile.email),
    roleLabel: profile.roleLabel,
    storeId: STORE_ID,
    status: profile.status || 'active',
    disabled: profile.disabled === true,
    lastLoginAt: profile.lastLoginAt,
    updatedAt: new Date().toISOString(),
    updatedAtServer: serverTimestamp(),
  };

  await setDoc(ref, {
    ...writableProfile,
    createdAt: profile.createdAt || new Date().toISOString(),
  }, { merge: true });

  await setDoc(presenceRef(db, profile.uid), {
    uid: profile.uid,
    email: profile.email,
    name: profile.name,
    role: writableProfile.role,
    roleLabel: profile.roleLabel,
    storeId: STORE_ID,
    status: writableProfile.status,
    disabled: writableProfile.disabled,
    lastSeen: new Date().toISOString(),
    online: true,
    updatedAtServer: serverTimestamp(),
  }, { merge: true });

  return profile;
}

export async function updateMemberRole(uid, role, updatedBy = null) {
  const { db } = await getFirebaseModules();
  const normalizedRole = normalizeRole(role);
  const update = {
    role: normalizedRole,
    roleLabel: normalizeUserProfile({ role: normalizedRole }).roleLabel,
    updatedAt: new Date().toISOString(),
    updatedAtServer: serverTimestamp(),
    updatedBy: updatedBy ? { uid: updatedBy.uid, email: updatedBy.email, name: updatedBy.name } : null,
  };
  await updateDoc(memberRef(db, uid), update);
  await setDoc(presenceRef(db, uid), update, { merge: true });
}

export async function updateMemberStatus(uid, disabled, updatedBy = null) {
  const { db } = await getFirebaseModules();
  const update = {
    disabled: disabled === true,
    status: disabled ? 'disabled' : 'active',
    updatedAt: new Date().toISOString(),
    updatedAtServer: serverTimestamp(),
    updatedBy: updatedBy ? { uid: updatedBy.uid, email: updatedBy.email, name: updatedBy.name } : null,
  };
  await updateDoc(memberRef(db, uid), update);
  await setDoc(presenceRef(db, uid), update, { merge: true });
}

export async function syncMemberFromPresence(uid, presenceData = {}) {
  const { db } = await getFirebaseModules();
  const profile = normalizeUserProfile({ uid, ...presenceData });
  if (!profile?.uid) return null;
  await setDoc(memberRef(db, uid), {
    uid: profile.uid,
    email: profile.email || '',
    name: profile.name || profile.email?.split('@')[0] || 'Unknown User',
    role: normalizeRole(profile.role, profile.email),
    roleLabel: profile.roleLabel,
    storeId: STORE_ID,
    status: presenceData.status || (presenceData.disabled ? 'disabled' : 'active'),
    disabled: presenceData.disabled === true,
    migratedFromPresence: true,
    updatedAt: new Date().toISOString(),
    updatedAtServer: serverTimestamp(),
  }, { merge: true });
  return profile;
}

export async function subscribeMembers(callback, onError) {
  const { db } = await getFirebaseModules();
  return onSnapshot(collection(db, 'stores', STORE_ID, 'members'), snap => {
    callback(snap.docs.map(d => normalizeUserProfile({ uid: d.id, ...d.data() })));
  }, onError);
}

export function canManageRole(targetUser, actingUser) {
  const actingRole = normalizeRole(actingUser?.role, actingUser?.email);
  const targetRole = normalizeRole(targetUser?.role, targetUser?.email);
  if (actingRole !== ROLE_KEYS.ADMIN) return false;
  if (String(targetUser?.email || '').toLowerCase() === ADMIN_EMAIL) return false;
  return targetRole !== ROLE_KEYS.ADMIN;
}
