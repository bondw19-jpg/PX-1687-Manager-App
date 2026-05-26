/**
 * dailyPlanData.js
 * 5 Point 7 Action (5P7A) daily operations constants for PX Store #1687
 *
 * 5 Points — apply every single day regardless of day of week
 * 7 Actions — rotate by day of week (0=Sunday through 6=Saturday)
 *   Each day has fohTitle / bohTitle (the focus area) and
 *   foh / boh arrays of individual checklist items.
 */

// ── 5 POINTS ─────────────────────────────────────────────────────────────────
export const FIVE_POINTS = [
  {
    key: 'outside',
    label: 'Outside',
    subItems: [
      'Building (stains, paint)',
      'Awning, lighting',
      'DT area',
      'Landscaping, dumpster area',
      'Parking lot, sidewalk',
      'Back door and front door',
      'Patio',
      'Scrub and pressurwash',
      'Outside storage',
    ],
  },
  {
    key: 'hospitality',
    label: 'Hospitality',
    subItems: [
      'Team smile, eye contact',
      'Welcome and thank you',
      'Table touch',
      'Store environment',
      'Uniform',
      "Associate's habit",
    ],
  },
  {
    key: 'lobby',
    label: 'Lobby',
    subItems: [
      'Lobby cleanliness',
      'Door frame',
      'Drink station',
      'Menu board alignment',
      'Char/booth',
      'Light fixtures, windows',
      'Restroom',
      'Trash can',
      'Highchair',
      'Ceiling vent/tiles',
      'Interior walls',
      'Interior storage',
    ],
  },
  {
    key: 'serving_line',
    label: 'Serving Line',
    subItems: [
      'Serving line layout alignment',
      'Big woks and C4 190°F',
      'Small woks 180°F',
      'No food on wok rim',
      'Spatula',
      'PCB 1 batch',
      'Retail station fortune cookie bag',
      'SSSP',
      'Sneeze guard and slats',
      'Food quality',
    ],
  },
  {
    key: 'sharing',
    label: 'Sharing',
    subItems: [
      'Self-introduction (personal and professional, NWOB/PIL)',
      'Business acumen (knowledge of 5-mile radius, sales building)',
      'Conversation with associate',
      'Panda Expressed Podcast',
    ],
  },
];

// ── 7 ACTIONS (per day of week) ───────────────────────────────────────────────
// 0 = Sunday … 6 = Saturday
// fohTitle / bohTitle = the focus area for that day
// foh / boh = individual checklist items { id, task }
export const SEVEN_ACTIONS = {
  0: {
    dayLabel: 'Sunday',
    fohTitle: 'Scrub dining room floor, Entrances, Doors',
    foh: [
      { id: 'sun_foh_0', task: 'Lobby floor/grout, including all metal part and ledges' },
      { id: 'sun_foh_1', task: 'Windows and door frame' },
      { id: 'sun_foh_2', task: 'Spider web' },
      { id: 'sun_foh_3', task: 'Under drink station' },
    ],
    bohTitle: 'Cook range',
    boh: [
      { id: 'sun_boh_0', task: 'Hoods, lights, globes, ansul poles and tips' },
      { id: 'sun_boh_1', task: 'Faucets, blancher, wok rings' },
      { id: 'sun_boh_2', task: 'Under cooking range, pipes, drains' },
    ],
  },
  1: {
    dayLabel: 'Monday',
    fohTitle: 'Serving line, DT area',
    foh: [
      { id: 'mon_foh_0', task: 'Serving line shelves, induction unit, heat lamps, condiment cart/shelf, rice warmer' },
      { id: 'mon_foh_1', task: 'Drink station, ice chute, cabinet, DT window, walls, Ironman sign' },
      { id: 'mon_foh_2', task: 'Register, behind/under registers, order taker screen and cables, phones' },
    ],
    bohTitle: 'Prep cooler (MAIN), Reach-in freezer',
    boh: [
      { id: 'mon_boh_0', task: 'Deep clean and polish, gaskets, wheels, vent, cables' },
      { id: 'mon_boh_1', task: 'Doors, hinges, cover panel, meat drawers and sliders' },
    ],
  },
  2: {
    dayLabel: 'Tuesday',
    fohTitle: 'Restrooms',
    foh: [
      { id: 'tue_foh_0', task: 'Restroom door frames, doors, tow kick' },
      { id: 'tue_foh_1', task: 'Walls cleaned with wet towel, baseboards, vents, lights cleaned' },
      { id: 'tue_foh_2', task: 'Underside of toilet and sink' },
    ],
    bohTitle: 'Prep cooler (SIDE), Rice cabinet, Condiment cart',
    boh: [
      { id: 'tue_boh_0', task: 'Deep clean and polish, gaskets, wheels, vent, cables, doors, hinges, cover panel' },
      { id: 'tue_boh_1', task: 'Remove warmer metal parts, clean, replace' },
      { id: 'tue_boh_2', task: "Deep clean cook's condiment cart" },
      { id: 'tue_boh_3', task: 'Deep clean thawing cabinet' },
    ],
  },
  3: {
    dayLabel: 'Wednesday',
    fohTitle: 'Drive Thru Area (Exterior), Dumpster area, Parking lot',
    foh: [
      { id: 'wed_foh_0', task: 'Canopy, metal part above the drive thru window, splatter on building' },
      { id: 'wed_foh_1', task: 'Oil and tire marks, dumpster, sweep leaves and dirt' },
      { id: 'wed_foh_2', task: 'No clutter, scrub concrete, remove oil stains' },
    ],
    bohTitle: 'Prep & Dishwashing sink',
    boh: [
      { id: 'wed_boh_0', task: 'Clean top to bottom, under shelves, pipes, drains' },
      { id: 'wed_boh_1', task: 'Rice bin, 3 compartment bin' },
    ],
  },
  4: {
    dayLabel: 'Thursday',
    fohTitle: 'Lobby drink station',
    foh: [
      { id: 'thu_foh_0', task: 'Ice bin/chute, detail drink station, tea machine, under tea machine' },
      { id: 'thu_foh_1', task: 'Cutlery holders cleaned, drink station drain, floor drain' },
      { id: 'thu_foh_2', task: 'Cabinet doors and feet' },
    ],
    bohTitle: 'Buff floors/Walk-in freezer/cooler',
    boh: [
      { id: 'thu_boh_0', task: 'Grout, baseboards, all BOH floors' },
      { id: 'thu_boh_1', task: 'Sweep & dry mop freezer floor, buff walk-in cooler floor' },
      { id: 'thu_boh_2', task: 'Clean plastic curtains, gaskets, veggie display doors, doorframe' },
      { id: 'thu_boh_3', task: 'Shelves wiped clean with rag' },
    ],
  },
  5: {
    dayLabel: 'Friday',
    fohTitle: 'Manager station, Air vents/ducts, Chairs, Tables',
    foh: [
      { id: 'fri_foh_0', task: 'Remove clutter, organize manager station, polish, keyboard, mouse, monitor' },
      { id: 'fri_foh_1', task: 'Lobby vents, airducts wipe clean with wet rag' },
      { id: 'fri_foh_2', task: 'Lobby chairs, highchairs, tables, table legs' },
    ],
    bohTitle: 'Walls, Storage, Mop sink, Lockers',
    boh: [
      { id: 'fri_boh_0', task: 'Clean walls, back door, air curtain, organize shelves' },
      { id: 'fri_boh_1', task: 'Clean and organize mop sink area' },
      { id: 'fri_boh_2', task: 'Clean lockers (only personal items, no food or drink)' },
    ],
  },
  6: {
    dayLabel: 'Saturday',
    fohTitle: 'Buff serving table floors, DT floors, Drains',
    foh: [
      { id: 'sat_foh_0', task: 'Baseboards, legs, detail clean drains, grout' },
      { id: 'sat_foh_1', task: 'Buff floor, under serving table, walls' },
    ],
    bohTitle: 'Detail Grill Station, Oil filter machine, Fryers',
    boh: [
      { id: 'sat_boh_0', task: 'Including table, bottom of grill, back wall and side' },
      { id: 'sat_boh_1', task: 'Deep clean both fryers inside and outside & fryer doors' },
      { id: 'sat_boh_2', task: 'Filter machine clean top to bottom' },
    ],
  },
};

/**
 * Returns the 7 Action data for the given Date object (or today if omitted).
 */
export function getActionsForDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const dow = d.getDay(); // 0=Sun … 6=Sat
  return SEVEN_ACTIONS[dow];
}

/**
 * Format a JS Date as YYYY-MM-DD (local time, no UTC shift).
 */
export function toDateString(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string into a local-time Date object.
 */
export function fromDateString(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}
