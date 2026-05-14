/**
 * dailyPlanData.js
 * 5 Point 7 Action (5P7A) daily operations constants for PX Store #1687
 *
 * 5 Points — apply every single day regardless of day of week
 * 7 Actions — rotate by day of week (0=Sunday through 6=Saturday)
 *
 * DT / Drive-Thru references are intentionally excluded — this store
 * does not have a drive-thru.
 */

// ── 5 POINTS ─────────────────────────────────────────────────────────────────
// Each point has a key, a display label, and an array of sub-item strings.
export const FIVE_POINTS = [
  {
    key: 'outside',
    label: 'Outside',
    subItems: [
      'Parking lot is clean and free of trash/debris',
      'Entrance doors and glass are clean and streak-free',
      'Exterior signage is lit and undamaged',
      'Sidewalks and entryway are swept and clear',
      'Trash/recycling cans emptied and lined',
    ],
  },
  {
    key: 'hospitality',
    label: 'Hospitality',
    subItems: [
      'All team members greet guests with a smile and eye contact',
      'Team is using the Warm & Welcomes script',
      'Associates are attentive and responsive to guest needs',
      'Thank every guest and invite them to return',
      'Manager is visible on the floor during peak hours',
    ],
  },
  {
    key: 'lobby',
    label: 'Lobby',
    subItems: [
      'Tables are clean, wiped, and free of crumbs',
      'Chairs and benches are clean and properly positioned',
      'Floors are swept and mopped — no sticky spots',
      'Trash cans are emptied and liners replaced as needed',
      'Condiment/sauce station is stocked and clean',
      'High chairs and booster seats are sanitized',
      'Restrooms are clean, stocked (soap, paper towels, TP), and odor-free',
    ],
  },
  {
    key: 'serving_line',
    label: 'Serving Line',
    subItems: [
      'All food wells are fully stocked to par levels',
      'Food temperatures are in compliance (hot ≥ 135°F, cold ≤ 41°F)',
      'Serving utensils are clean and properly positioned',
      'Food presentation meets brand standards — no overflow or mixing',
      'Sneeze guards and line panels are clean and smudge-free',
      'Wok stations are clean and free of grease buildup',
      'Price boards and menu display are accurate and lit',
    ],
  },
  {
    key: 'sharing',
    label: 'Sharing',
    subItems: [
      'Team daily huddle completed (goals, specials, any 86\'d items)',
      'Manager has communicated shift assignments and break schedule',
      'Any coaching, recognition, or policy reminders delivered',
      'Opening/closing critical info passed to next manager on duty',
    ],
  },
];

// ── 7 ACTIONS (per day of week) ───────────────────────────────────────────────
// Key: 0 = Sunday, 1 = Monday, … 6 = Saturday
// Each day has a foh (Front of House) array and a boh (Back of House) array.
// Each item: { id, task, detail }
export const SEVEN_ACTIONS = {
  0: {
    dayLabel: 'Sunday',
    foh: [
      { id: 'sun_foh_0', task: 'Deep clean lobby seating area', detail: 'Move chairs, scrub baseboards and chair legs, sanitize table bases.' },
      { id: 'sun_foh_1', task: 'Clean and sanitize all dining tables', detail: 'Use approved sanitizer; allow to air-dry before resetting.' },
      { id: 'sun_foh_2', task: 'Clean interior windows and glass panels', detail: 'Use streak-free glass cleaner on all interior-facing glass.' },
      { id: 'sun_foh_3', task: 'Sanitize condiment/sauce station surfaces', detail: 'Wipe down and refill all sauce pumps; check expiration dates.' },
      { id: 'sun_foh_4', task: 'Scrub and sanitize beverage station', detail: 'Clean nozzles, drip trays, and ice chute. Sanitize exterior.' },
      { id: 'sun_foh_5', task: 'Dust and clean lobby light fixtures and vents', detail: 'Use damp cloth; check for any burned-out bulbs and report.' },
      { id: 'sun_foh_6', task: 'Inspect and clean POS terminals and kiosk screens', detail: 'Sanitize touch screens and card reader pads with approved wipes.' },
    ],
    boh: [
      { id: 'sun_boh_0', task: 'Deep clean wok station walls and hood filters', detail: 'Remove grease buildup from wok splash guards and ventilation hood filters.' },
      { id: 'sun_boh_1', task: 'Clean and sanitize all prep surfaces', detail: 'Degrease counters, cutting boards, and prep tables. Sanitize after.' },
      { id: 'sun_boh_2', task: 'Scrub walk-in cooler door gaskets and thresholds', detail: 'Check gasket seal integrity; report any tears or gaps to manager.' },
      { id: 'sun_boh_3', task: 'Clean beneath and behind all equipment', detail: 'Pull out fryers and steamers where possible; remove grease and debris.' },
      { id: 'sun_boh_4', task: 'Sanitize all storage shelving units', detail: 'Wipe down all shelf surfaces in dry storage and walk-ins.' },
      { id: 'sun_boh_5', task: 'Check and document all food temperatures', detail: 'Log hot hold, cold hold, and walk-in temperatures on food safety log.' },
      { id: 'sun_boh_6', task: 'Inspect waste/recycling area — clean and clear', detail: 'Empty bins, replace liners, clean floor around waste station.' },
    ],
  },
  1: {
    dayLabel: 'Monday',
    foh: [
      { id: 'mon_foh_0', task: 'Wipe down and sanitize all menu board frames', detail: 'Use damp cloth on frames; avoid spraying directly on digital boards.' },
      { id: 'mon_foh_1', task: 'Clean and restock service trays and tray liners', detail: 'Wash all reusable trays; replace liner paper and stock tray station.' },
      { id: 'mon_foh_2', task: 'Clean serving line sneeze guards — inside and out', detail: 'Use approved glass cleaner both sides; dry with lint-free towel.' },
      { id: 'mon_foh_3', task: 'Wipe baseboards in lobby area', detail: 'Damp-wipe all visible baseboards and trim in guest seating area.' },
      { id: 'mon_foh_4', task: 'Clean and inspect restroom thoroughly', detail: 'Scrub toilets, sinks, mirrors, and floors. Replace soap and paper products.' },
      { id: 'mon_foh_5', task: 'Sanitize high chairs and booster seats', detail: 'Use food-safe sanitizer on all seat surfaces and tray/strap areas.' },
      { id: 'mon_foh_6', task: 'Sweep and mop entire lobby — front to back', detail: 'Move all chairs; pay extra attention to corners and entry mat area.' },
    ],
    boh: [
      { id: 'mon_boh_0', task: 'Clean and inspect fryer units', detail: 'Skim and filter oil; wipe exterior surfaces; check baskets for damage.' },
      { id: 'mon_boh_1', task: 'Scrub and sanitize floor drains', detail: 'Clear debris, scrub drain covers, apply drain cleaner per schedule.' },
      { id: 'mon_boh_2', task: 'Organize and FIFO-rotate walk-in cooler', detail: 'Confirm all items labeled and dated. Move older stock to front.' },
      { id: 'mon_boh_3', task: 'Clean steam tables and warmer wells', detail: 'Drain, scrub, and sanitize all food wells and lids.' },
      { id: 'mon_boh_4', task: 'Wipe down all BOH walls around cooking area', detail: 'Degrease tile and stainless panels near wok and fryer stations.' },
      { id: 'mon_boh_5', task: 'Inspect and clean oven / warmer interiors', detail: 'Remove racks, wipe interior walls; check seals and door hinges.' },
      { id: 'mon_boh_6', task: 'Complete and file weekly inventory spot-check', detail: 'Count and document top 10 high-usage ingredients for waste control.' },
    ],
  },
  2: {
    dayLabel: 'Tuesday',
    foh: [
      { id: 'tue_foh_0', task: 'Clean exterior windows and entrance glass', detail: 'Use streak-free glass cleaner on all exterior-facing guest entry glass.' },
      { id: 'tue_foh_1', task: 'Wipe down and organize the beverage station', detail: 'Sanitize all touch points; refill cups, lids, and straws to par.' },
      { id: 'tue_foh_2', task: 'Sanitize lobby trash receptacles inside and out', detail: 'Empty bins, spray interior, wipe exterior, replace liner.' },
      { id: 'tue_foh_3', task: 'Mop lobby and inspect floor grout lines', detail: 'Use color-coded mop; report damaged or stained grout to manager.' },
      { id: 'tue_foh_4', task: 'Wipe down and sanitize POS counter surfaces', detail: 'Sanitize register counters, handoff ledge, and all guest-touch areas.' },
      { id: 'tue_foh_5', task: 'Clean and restock napkin dispensers', detail: 'Disassemble, wipe interior, and refill to full. Check expiry on packets.' },
      { id: 'tue_foh_6', task: 'Inspect serving line food labels for accuracy', detail: 'Confirm all items have correct name tags and allergen information.' },
    ],
    boh: [
      { id: 'tue_boh_0', task: 'Organize and clean dry storage room', detail: 'Sweep floor, wipe shelves, check for pests or moisture. Verify FIFO.' },
      { id: 'tue_boh_1', task: 'Deep clean wok burners and grates', detail: 'Remove grates, soak in degreaser, scrub, and rinse thoroughly.' },
      { id: 'tue_boh_2', task: 'Sanitize all BOH prep utensils and tool rack', detail: 'Run all small wares through dish machine or hand-sanitize and air-dry.' },
      { id: 'tue_boh_3', task: 'Clean walk-in cooler interior shelves', detail: 'Remove items section-by-section; wipe shelves with sanitizer solution.' },
      { id: 'tue_boh_4', task: 'Scrub and sanitize mop sink and surrounding area', detail: 'Scrub basin, wipe handles and walls around mop sink station.' },
      { id: 'tue_boh_5', task: 'Inspect all food containers and lids for wear', detail: 'Remove any cracked, stained, or damaged containers from service.' },
      { id: 'tue_boh_6', task: 'Check equipment temperature logs are current', detail: 'Verify walk-in, hot hold, and cold hold logs are complete through today.' },
    ],
  },
  3: {
    dayLabel: 'Wednesday',
    foh: [
      { id: 'wed_foh_0', task: 'Detail-clean dining chairs and seat cushions', detail: 'Scrub chair backs, legs, and all upholstered or hard seat surfaces.' },
      { id: 'wed_foh_1', task: 'Sanitize and restock self-serve utensil station', detail: 'Wipe down dispenser, refill forks/spoons/knives to par level.' },
      { id: 'wed_foh_2', task: 'Clean lobby ceiling vents and light diffusers', detail: 'Use extension duster; wipe grilles with damp cloth. Log any issues.' },
      { id: 'wed_foh_3', task: 'Scrub and sanitize entrance mat and entryway', detail: 'Shake or vacuum mat, mop entryway tile, replace mat properly.' },
      { id: 'wed_foh_4', task: 'Wipe serving line end caps and frame rail', detail: 'Degrease and sanitize the full perimeter rail and decorative panels.' },
      { id: 'wed_foh_5', task: 'Inspect and clean lobby ADA access areas', detail: 'Confirm clear path, clean any rail or grab-bar surfaces.' },
      { id: 'wed_foh_6', task: 'Review and update FOH FIFO rotation records', detail: 'Confirm all dated items in cold display and service areas are within date.' },
    ],
    boh: [
      { id: 'wed_boh_0', task: 'Deep clean fryer filter system and oil disposal', detail: 'Perform full filter cycle; document oil quality; schedule oil change if needed.' },
      { id: 'wed_boh_1', task: 'Scrub and sanitize BOH floor — full sweep and mop', detail: 'Sweep all debris; use color-coded mop with approved sanitizer solution.' },
      { id: 'wed_boh_2', task: 'Inspect and clean range hood and exhaust fan', detail: 'Wipe interior hood surfaces; check fan operation and blade condition.' },
      { id: 'wed_boh_3', task: 'Organize walk-in freezer — FIFO check', detail: 'Confirm all frozen items labeled and dated. Report any frost buildup.' },
      { id: 'wed_boh_4', task: 'Sanitize all cutting boards — front and back', detail: 'Scrub with brush and sanitizer; inspect for deep cuts that harbor bacteria.' },
      { id: 'wed_boh_5', task: 'Test and log sanitizer bucket concentrations', detail: 'Use test strips on all active sanitizer buckets; adjust as needed.' },
      { id: 'wed_boh_6', task: 'Check and refill BOH hand-washing stations', detail: 'Verify soap, paper towels, and signage present at every hand-sink.' },
    ],
  },
  4: {
    dayLabel: 'Thursday',
    foh: [
      { id: 'thu_foh_0', task: 'Clean and polish stainless counter surfaces', detail: 'Use stainless steel polish on all visible stainless surfaces in FOH.' },
      { id: 'thu_foh_1', task: 'Deep-clean beverage nozzles and ice dispenser', detail: 'Remove, soak, scrub, and sanitize all fountain drink nozzles and splash plates.' },
      { id: 'thu_foh_2', task: 'Sanitize and wipe all lobby doors — handles and frames', detail: 'Wipe push plates, pull handles, door frames, and kick plates.' },
      { id: 'thu_foh_3', task: 'Sweep and spot-mop lobby — check for scuffs', detail: 'Use floor eraser on any scuff marks; mop all areas near trash and entry.' },
      { id: 'thu_foh_4', task: 'Restock and organize sauce/condiment station', detail: 'Refill all sauces, napkins, and utensils; wipe pump handles and labels.' },
      { id: 'thu_foh_5', task: 'Inspect and clean all serving line lamps and warmers', detail: 'Wipe lamp fixtures; ensure all warming lamps are functioning.' },
      { id: 'thu_foh_6', task: 'Verify FOH team in proper uniform and appearance', detail: 'Check hats, aprons, name tags, and non-slip footwear for all FOH staff.' },
    ],
    boh: [
      { id: 'thu_boh_0', task: 'Clean and inspect all wok rings and burner heads', detail: 'Remove, soak in degreaser, scrub ports clear, reassemble and test.' },
      { id: 'thu_boh_1', task: 'Sanitize all interior walk-in cooler walls and ceiling', detail: 'Wipe all surfaces, check for mold or condensation issues, report concerns.' },
      { id: 'thu_boh_2', task: 'Organize and label BOH chemicals and cleaning supplies', detail: 'Verify all containers labeled; segregate food and non-food chemicals.' },
      { id: 'thu_boh_3', task: 'Perform full dish machine cleaning and inspection', detail: 'Run cleaning cycle; check wash and rinse temperatures; clean spray arms.' },
      { id: 'thu_boh_4', task: 'Degrease and clean behind/under cooking equipment', detail: 'Pull equipment where possible; scrub floor and walls behind fryers and woks.' },
      { id: 'thu_boh_5', task: 'Complete BOH food safety walkthrough', detail: 'Confirm all items covered, dated, and stored above floor. Document findings.' },
      { id: 'thu_boh_6', task: 'Check CO2 tank levels for beverage system', detail: 'Inspect tank gauge and connections; notify manager if below 20%.' },
    ],
  },
  5: {
    dayLabel: 'Friday',
    foh: [
      { id: 'fri_foh_0', task: 'High-traffic prep: fully stock all FOH supplies before rush', detail: 'Bring all cups, lids, straws, trays, napkins to max par before lunch.' },
      { id: 'fri_foh_1', task: 'Pre-shift lobby detail clean', detail: 'Sweep, spot-mop, and wipe all tables before 11 AM peak window.' },
      { id: 'fri_foh_2', task: 'Clean serving line glass and sneeze guards', detail: 'Polish both sides of sneeze guards; wipe down the full service glass panel.' },
      { id: 'fri_foh_3', task: 'Sanitize and restock condiment station for weekend volume', detail: 'Double-check sauce levels and napkin stock; wipe all surfaces.' },
      { id: 'fri_foh_4', task: 'Inspect FOH restrooms and assign hourly check log', detail: 'Full restroom clean before open; set up timed sign-off sheet for team.' },
      { id: 'fri_foh_5', task: 'Verify all POS terminals functioning correctly', detail: 'Test each register; confirm kiosk is online; report any issues immediately.' },
      { id: 'fri_foh_6', task: 'Brief team on expected volume and hospitality focus', detail: 'Review weekend goals, speed-of-service targets, and 5-Star service priorities.' },
    ],
    boh: [
      { id: 'fri_boh_0', task: 'Confirm full par prep for Friday/weekend volume', detail: 'Review prep sheets; ensure proteins, sides, and sauces are fully prepped.' },
      { id: 'fri_boh_1', task: 'Check and rotate all perishables in cooler and freezer', detail: 'Move items near date to front; pull and use or document any near-date items.' },
      { id: 'fri_boh_2', task: 'Clean and sanitize all prep table surfaces', detail: 'Degrease, sanitize, and air-dry all work surfaces before morning prep.' },
      { id: 'fri_boh_3', task: 'Inspect all cooking equipment prior to high-volume shift', detail: 'Test each burner, fryer, and steamer; confirm temps are correct at open.' },
      { id: 'fri_boh_4', task: 'Refill and organize all BOH holding containers', detail: 'Label and date all containers; restock inserts in hot hold wells.' },
      { id: 'fri_boh_5', task: 'Verify adequate supply of sanitizer and cleaning chemicals', detail: 'Check stock of sanitizer, dish detergent, and gloves. Reorder if needed.' },
      { id: 'fri_boh_6', task: 'BOH equipment deep-clean before weekend rush', detail: 'Degrease wok hoods, wipe fryer exteriors, scrub all wall panels around cooking.' },
    ],
  },
  6: {
    dayLabel: 'Saturday',
    foh: [
      { id: 'sat_foh_0', task: 'Full lobby detail clean before opening', detail: 'Sweep, mop, wipe all tables and chairs. Set lobby to peak presentation.' },
      { id: 'sat_foh_1', task: 'Stock all stations to weekend max par', detail: 'Cups, lids, napkins, utensils, trays — fill everything to max before open.' },
      { id: 'sat_foh_2', task: 'Deep-clean exterior entrance and sidewalk area', detail: 'Sweep and hose down (or power-broom) all exterior entry paths and signage.' },
      { id: 'sat_foh_3', task: 'Polish and inspect serving line sneeze guards', detail: 'Full clean inside and outside; confirm all panels are secure and clean.' },
      { id: 'sat_foh_4', task: 'Inspect and sanitize all self-service and condiment areas', detail: 'Wipe and restock utensils, sauce pumps, and napkin dispensers.' },
      { id: 'sat_foh_5', task: 'Confirm team uniform compliance for weekend crew', detail: 'Review hats, aprons, name tags, and footwear for all associates on clock.' },
      { id: 'sat_foh_6', task: 'Conduct FOH restroom full clean and set up hourly log', detail: 'Full scrub before open; hourly check-off sheet assigned to designated associate.' },
    ],
    boh: [
      { id: 'sat_boh_0', task: 'Full BOH prep review for Saturday volume', detail: 'Walk prep list with BOH team; confirm all items prepped and par met.' },
      { id: 'sat_boh_1', task: 'Deep-clean and sanitize all wok stations', detail: 'Degrease wok rings, burner grates, splash guards, and surrounding wall panels.' },
      { id: 'sat_boh_2', task: 'Clean walk-in cooler floor and door threshold', detail: 'Sweep and mop cooler floor; scrub threshold drain and check floor seal.' },
      { id: 'sat_boh_3', task: 'Scrub and sanitize fryer baskets and exterior', detail: 'Soak baskets in degreaser solution; wipe all fryer exteriors and handles.' },
      { id: 'sat_boh_4', task: 'Verify all date labels and food rotation in storage', detail: 'Walk all shelves; confirm every container has a date label. Discard expired items.' },
      { id: 'sat_boh_5', task: 'Inspect BOH floor for cleanliness and safety', detail: 'Sweep and mop all BOH floor areas; ensure no wet floors without signage.' },
      { id: 'sat_boh_6', task: 'Complete end-of-week food safety documentation', detail: 'File all temperature logs, sanitizer logs, and waste tracking sheets.' },
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
