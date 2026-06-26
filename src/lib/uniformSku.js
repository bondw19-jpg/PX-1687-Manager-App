// Canonical uniform identity helpers.
//
// The SKU key must be computed identically everywhere it is used (store
// create/update actions, the persisted-store migration, and the Uniforms page
// dedupe), so the same physical uniform always resolves to exactly one row.
// Keeping the color list and key logic in one place prevents those call sites
// from drifting apart and silently splitting one uniform into two rows.

export const ITEM_COLORS = {
  'Shirt': ['Red', 'Black'],
  'Other': ['Black', 'Red', 'White', 'Gray', 'Khaki', 'Navy', 'Other'],
};

// Items that actually have color options. Everything else ignores color entirely,
// so a colorless "Hat" and a "Hat · Black" never become two different SKUs.
export const colorOptionsFor = (item) => ITEM_COLORS[item] || [];

const norm = (v) => String(v || '').trim().toLowerCase();

// Stable SKU key from normalized item + size (+ color only when the item has
// color options). Case- and whitespace-insensitive so capitalization or stray
// spaces never split one uniform into two rows.
export const uniformSkuKey = (o) =>
  colorOptionsFor(o?.item).length > 0
    ? `${norm(o?.item)}||${norm(o?.size)}||${norm(o?.color)}`
    : `${norm(o?.item)}||${norm(o?.size)}`;
