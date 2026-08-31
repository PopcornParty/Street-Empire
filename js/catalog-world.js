export const GAME_VERSION = "1.0.0";
export const START_CASH = 10000;
export const OFFLINE_CAP_HOURS = 8;
export const TICK_MS = 1000;
export const AUTOSAVE_MS = 8000;
export const EMPIRE_RANKS = [
  { level: 1, name: "Beginner", xp: 0 }, { level: 2, name: "Entrepreneur", xp: 120 },
  { level: 3, name: "Business Owner", xp: 400 }, { level: 4, name: "Investor", xp: 900 },
  { level: 5, name: "Executive", xp: 1800 }, { level: 6, name: "Tycoon", xp: 3200 },
  { level: 7, name: "Mogul", xp: 5200 }, { level: 8, name: "Industry Leader", xp: 8000 },
  { level: 9, name: "Empire Builder", xp: 12000 }, { level: 10, name: "Business Legend", xp: 17500 },
  { level: 11, name: "City Magnate", xp: 25000 }, { level: 12, name: "National Icon", xp: 35000 },
  { level: 13, name: "Global Operator", xp: 48000 }, { level: 14, name: "Crown Investor", xp: 65000 },
  { level: 15, name: "Street Sovereign", xp: 90000 }
];
export const DISTRICTS = [
  { id: "downtown", name: "Downtown", order: 1, unlockCash: 0, unlockRep: 0, unlockLevel: 1, color: "#4de2c8", desc: "Busy streets and first storefronts." },
  { id: "suburbs", name: "Suburbs", order: 2, unlockCash: 25000, unlockRep: 15, unlockLevel: 2, color: "#8b7cff", desc: "Quiet neighborhoods and family shops." },
  { id: "industrial", name: "Industrial Yard", order: 3, unlockCash: 80000, unlockRep: 40, unlockLevel: 3, color: "#f5c14a", desc: "Workshops, warehouses and production." },
  { id: "harbour", name: "Harbourfront", order: 4, unlockCash: 180000, unlockRep: 70, unlockLevel: 4, color: "#4da6ff", desc: "Docks, cafes and logistics." },
  { id: "financial", name: "Ledger Row", order: 5, unlockCash: 450000, unlockRep: 110, unlockLevel: 5, color: "#53d48a", desc: "Banks, towers and boardrooms." },
  { id: "entertainment", name: "Neon Strip", order: 6, unlockCash: 900000, unlockRep: 160, unlockLevel: 6, color: "#ff6b8a", desc: "Cinemas, arenas and nightlife." },
  { id: "hills", name: "Vista Hills", order: 7, unlockCash: 2000000, unlockRep: 220, unlockLevel: 7, color: "#ffb36b", desc: "Luxury homes and boutique brands." },
  { id: "airport", name: "Skygate", order: 8, unlockCash: 5000000, unlockRep: 300, unlockLevel: 8, color: "#7ad0ff", desc: "Terminals and travel commerce." },
  { id: "tech", name: "Circuit Quarter", order: 9, unlockCash: 12000000, unlockRep: 400, unlockLevel: 9, color: "#b06bff", desc: "Campuses and research labs." },
  { id: "megacity", name: "Crown Spire", order: 10, unlockCash: 40000000, unlockRep: 550, unlockLevel: 11, color: "#f5c14a", desc: "The skyline of a finished empire." }
];
function B(id,name,icon,tier,district,price,income,opex,maxLevel,repReq,tags){return {id,name,icon,tier,district,price,income,opex,maxLevel,repReq,tags,desc:name};}
export const BUSINESSES = [
  B("food_stand","Corner Bites Cart","🌮",1,"downtown",2500,90,12,12,0,["food"]),
  B("cafe","Harbor Roast","☕",1,"downtown",6000,180,28,12,0,["food","cafe"]),
  B("convenience","Night Owl Mart","🏪",1,"downtown",9000,240,40,12,5,["retail"]),
  B("carwash","Sparkle Lane Wash","🚿",1,"downtown",12000,300,55,12,8,["auto","service"]),
  B("boutique","Thread & Co.","👕",1,"downtown",15000,340,60,12,10,["retail","fashion"]),
  B("bakery","Sunrise Oven","🥐",1,"suburbs",18000,380,70,14,12,["food"]),
  B("restaurant","Table Twelve","🍽️",2,"downtown",28000,620,140,14,18,["food","restaurant"]),
  B("gym","Iron Hour Gym","💪",2,"suburbs",32000,700,160,14,20,["service"]),
  B("electronics","Circuit Shelf","📱",2,"downtown",40000,860,190,14,25,["retail","tech"]),
  B("supermarket","Fresh Aisle","🛒",2,"suburbs",55000,1100,260,15,30,["retail","food"]),
  B("garage","Torque Works","🔧",2,"industrial",48000,980,210,14,28,["auto","service"]),
  B("inn","Lantern Inn","🛏️",2,"harbour",70000,1350,320,15,40,["hotel","travel"]),
  B("flower","Petal Market","💐",2,"suburbs",22000,480,90,12,16,["retail"]),
  B("mall","Arcade Exchange","🏬",3,"downtown",140000,2600,700,16,55,["retail","mall"]),
  B("offices","Northlight Offices","🏢",3,"financial",180000,3100,820,16,70,["office"]),
  B("factory","Riverline Works","🏭",3,"industrial",220000,3800,1100,16,80,["industry"]),
  B("fine_dining","Goldfork Hall","🥂",3,"hills",260000,4200,1300,16,90,["food","restaurant","luxury"]),
  B("dealership","Apex Motors","🚗",3,"industrial",300000,4600,1400,16,95,["auto","retail"]),
  B("cinema","Velvet Screen","🎬",3,"entertainment",240000,4000,1200,16,85,["entertainment"]),
  B("tower","Keystone Tower","🏙️",4,"financial",750000,9800,2800,18,140,["office","prestige"]),
  B("campus","Lumen Campus","🖥️",4,"tech",980000,12500,3600,18,180,["tech"]),
  B("grand_hotel","Crown Harbour Hotel","🏨",4,"harbour",1100000,14200,4200,18,190,["hotel","luxury","travel"]),
  B("stadium","River Bowl","🏟️",4,"entertainment",1600000,19000,6200,18,220,["entertainment","event"]),
  B("convention","Summit Hall","🎤",4,"financial",1300000,16000,5000,18,200,["event","office"]),
  B("distribution","Gridline Logistics","📦",4,"industrial",900000,11800,3400,18,170,["industry","delivery"]),
  B("bank_tower","Aegis Financial","🏦",5,"financial",3500000,38000,11000,20,280,["finance","prestige"]),
  B("terminal","Skygate Terminal A","✈️",5,"airport",4800000,50000,16000,20,320,["travel","airport"]),
  B("megamall","Horizon Galleria","🛍️",5,"megacity",5200000,54000,17000,20,340,["retail","mall"]),
  B("complex","Forge Complex","⚙️",5,"industrial",4000000,42000,14000,20,300,["industry"]),
  B("ent_district","Neon Commons","🎡",5,"entertainment",4500000,47000,15000,20,310,["entertainment"]),
  B("hq_biz","Empire Headquarters","🏛️",6,"megacity",12000000,110000,28000,20,450,["prestige","office"]),
  B("intl_air","Skygate International","🌐",6,"airport",18000000,160000,42000,20,500,["travel","airport"]),
  B("global_log","Atlas Exchange","🚢",6,"harbour",15000000,140000,38000,20,480,["industry","delivery"]),
  B("mega_tower","Crown Spire Tower","🗼",6,"megacity",25000000,220000,55000,20,550,["prestige","office"])
];
export const UPGRADE_CATS = [
  { id: "building", name: "Building", icon: "🧱", effect: "income", per: 0.08 },
  { id: "equipment", name: "Equipment", icon: "🛠️", effect: "income", per: 0.07 },
  { id: "staff", name: "Staff Desk", icon: "👥", effect: "opex", per: -0.06 },
  { id: "ads", name: "Advertising", icon: "📣", effect: "income", per: 0.09 },
  { id: "tech", name: "Technology", icon: "💻", effect: "efficiency", per: 0.05 },
  { id: "efficiency", name: "Efficiency", icon: "⚡", effect: "opex", per: -0.05 }
];
function P(id,name,icon,type,district,price,rent,repReq,slotBonus){return {id,name,icon,type,district,price,rent,repReq,slotBonus:slotBonus||0,desc:name};}
export const PROPERTIES = [
  P("studio","River Studio","🚪","apartment","downtown",18000,80,0),
  P("walkup","Elm Walk-up","🏠","house","suburbs",42000,160,10),
  P("shopunit","Market Unit","🔑","shop","downtown",35000,140,8,1),
  P("loft","Brick Loft","🪵","apartment","downtown",55000,200,18),
  P("cottage","Maple Cottage","🏡","house","suburbs",70000,240,22),
  P("office_suite","Suite 4B","🗂️","office","financial",120000,420,40,1),
  P("warehouse","Bay Warehouse","📦","warehouse","industrial",160000,380,50,1),
  P("plaza","Corner Plaza","🧱","commercial","downtown",220000,700,70,2),
  P("plot","River Plot","🌿","land","harbour",90000,40,30),
  P("villa","Vista Villa","🏞️","luxury","hills",480000,1400,120),
  P("penthouse","Keystone Penthouse","🌇","luxury","financial",720000,2100,160),
  P("campus_lot","Campus Lot","🗺️","land","tech",260000,200,140,1),
  P("hangar","Skygate Hangar","🛬","warehouse","airport",540000,1600,200,1),
  P("marina","North Pier Slip","⚓","luxury","harbour",390000,1100,130),
  P("townhouse","Garden Townhouse","🏘️","house","suburbs",150000,480,45),
  P("retail_row","Lantern Row","🏮","shop","entertainment",280000,860,90,2),
  P("datahall","Coolroom Hall","💾","commercial","tech",620000,1800,210,1),
  P("estate","Crown Estate","🏰","luxury","hills",1400000,3800,260),
  P("spire_floor","Spire Floor 88","🌆","office","megacity",2200000,6200,360,2),
  P("cargo_yard","Atlas Yard","🚚","warehouse","harbour",800000,2200,240,2),
  P("boutique_apt","Gallery Residences","🎨","apartment","entertainment",310000,980,100),
  P("air_suite","Skygate Suites","🧳","commercial","airport",980000,2600,280,1)
];
function V(id,name,icon,price,bonus,tags){return {id,name,icon,price,bonus,tags,desc:name};}
export const VEHICLES = [
  V("hatch","Metro Hatch","🚘",8000,0.01), V("van","Parcel Van","🚐",18000,0.02,["delivery"]),
  V("sedan","Ledger Sedan","🚗",32000,0.015), V("suv","Ridge SUV","🚙",48000,0.02),
  V("sport","Linea Sport","🏎️",90000,0.025), V("limo","Boardroom Limo","🚖",140000,0.03),
  V("super","Apex GT","🏁",280000,0.035), V("truck","Haulmaster","🚛",110000,0.03,["delivery"]),
  V("bike","Courier Bike","🛵",4500,0.008,["delivery"]), V("wagon","Market Wagon","🛻",22000,0.018),
  V("coach","Staff Coach","🚌",160000,0.028), V("yacht","Harbour Dayboat","🛥️",420000,0.04),
  V("heli","Skygate Shuttle","🚁",900000,0.05), V("fleet","Atlas Fleet Pack","🚚",350000,0.045,["delivery"]),
  V("classic","Goldline Classic","🚖",75000,0.022), V("ev","Quiet Current","⚡",68000,0.024)
];
export const EMPLOYEE_ROLES = [
  { id: "cashier", name: "Cashier", icon: "🧾", salary: 18, bonus: 0.04, rarity: "common" },
  { id: "driver", name: "Driver", icon: "🔑", salary: 22, bonus: 0.05, rarity: "common" },
  { id: "security", name: "Security", icon: "🛡️", salary: 24, bonus: 0.03, rarity: "common" },
  { id: "marketing", name: "Marketing Specialist", icon: "📈", salary: 36, bonus: 0.08, rarity: "uncommon" },
  { id: "engineer", name: "Engineer", icon: "🛠️", salary: 40, bonus: 0.07, rarity: "uncommon" },
  { id: "accountant", name: "Accountant", icon: "🧮", salary: 38, bonus: 0.06, rarity: "uncommon" },
  { id: "developer", name: "Developer", icon: "💻", salary: 48, bonus: 0.09, rarity: "rare" },
  { id: "manager", name: "Manager", icon: "📋", salary: 55, bonus: 0.12, rarity: "rare" },
  { id: "executive", name: "Executive", icon: "💼", salary: 90, bonus: 0.22, rarity: "legendary" }
];
export const HQ_STAGES = [
  { id: 0, name: "Small Office", icon: "🪑", cost: 0 },
  { id: 1, name: "Modern Office", icon: "🖥️", cost: 40000 },
  { id: 2, name: "Corporate Office", icon: "🏢", cost: 180000 },
  { id: 3, name: "Luxury Headquarters", icon: "🏛️", cost: 750000 },
  { id: 4, name: "Empire Tower", icon: "🗼", cost: 4000000 }
];
