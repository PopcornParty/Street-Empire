export const CONTRACTS = [
  { id:"local_delivery", name:"Local Delivery Run", reqTag:"delivery", hours:2, reward:25000, xp:40, desc:"Move parcels across Downtown." },
  { id:"cafe_supply", name:"Roastery Supply", reqTag:"cafe", hours:3, reward:18000, xp:30, desc:"Keep Harbor Roast stocked." },
  { id:"restaurant_supply", name:"Kitchen Restock", reqTag:"restaurant", hours:4, reward:42000, xp:50, desc:"Fresh produce before service." },
  { id:"build_fit", name:"Fit-Out Crew", reqTag:"industry", hours:6, reward:90000, xp:80, desc:"Fit a new commercial floor." },
  { id:"transport", name:"City Shuttle Pact", reqTag:"travel", hours:5, reward:70000, xp:70, desc:"Move guests between sites." },
  { id:"tech_pilot", name:"Pilot Software Rollout", reqTag:"tech", hours:8, reward:160000, xp:120, desc:"Install systems across shops." },
  { id:"hotel_partner", name:"Stay Package", reqTag:"hotel", hours:10, reward:210000, xp:140, desc:"Bundle rooms with city tours." },
  { id:"city_event", name:"Civic Festival Stall", reqTag:"food", hours:3, reward:32000, xp:45, desc:"Feed the weekend festival." },
  { id:"shipping", name:"Harbour Charter", reqTag:"delivery", hours:12, reward:280000, xp:180, desc:"A full container rotation." },
  { id:"cinema_week", name:"Premiere Week", reqTag:"entertainment", hours:7, reward:150000, xp:110, desc:"Sold-out screens all week." },
  { id:"auto_fleet", name:"Fleet Service", reqTag:"auto", hours:6, reward:88000, xp:75, desc:"Maintain a courier fleet." },
  { id:"office_lease", name:"Floor Lease Blitz", reqTag:"office", hours:9, reward:190000, xp:130, desc:"Fill empty office floors." },
  { id:"mall_season", name:"Holiday Hall", reqTag:"mall", hours:8, reward:175000, xp:125, desc:"Seasonal tenants and lights." },
  { id:"luxury_gala", name:"Vista Gala", reqTag:"luxury", hours:5, reward:240000, xp:150, desc:"Cater a hillside evening." },
  { id:"airport_retail", name:"Airside Pop-up", reqTag:"airport", hours:6, reward:260000, xp:160, desc:"Travel retail for a week." },
  { id:"factory_run", name:"Night Shift Run", reqTag:"industry", hours:10, reward:200000, xp:140, desc:"Keep the line moving overnight." },
  { id:"finance_close", name:"Quarter Close", reqTag:"finance", hours:4, reward:320000, xp:200, desc:"Support a tower close cycle." },
  { id:"ad_blitz", name:"Citywide Ads", reqTag:"retail", hours:3, reward:54000, xp:55, desc:"Blank the buses in your colors." },
  { id:"sports_night", name:"Bowl Night Catering", reqTag:"event", hours:4, reward:120000, xp:100, desc:"Feed 20,000 fans." },
  { id:"global_route", name:"Atlas Route Trial", reqTag:"delivery", hours:16, reward:480000, xp:260, desc:"A trial international lane." },
  { id:"campus_demo", name:"Campus Open Day", reqTag:"tech", hours:5, reward:210000, xp:150, desc:"Show the labs to partners." }
];
export const EVENTS = [
  { id:"boom", name:"Business Boom", minutes:30, mult:1.25, tags:null, desc:"The whole city spends a little more." },
  { id:"tourists", name:"Tourist Season", minutes:40, mult:1.5, tags:["hotel","restaurant","travel"], desc:"Hotels and kitchens overflow." },
  { id:"roadworks", name:"Roadworks", minutes:25, mult:0.8, tags:["retail","food"], desc:"Street shops lose some footfall." },
  { id:"techboom", name:"Circuit Surge", minutes:35, mult:1.45, tags:["tech"], desc:"Tech campuses hum overnight." },
  { id:"festival", name:"City Festival", minutes:30, mult:1.5, tags:["entertainment","food"], desc:"Neon Strip does not sleep." },
  { id:"payday", name:"Payday Weekend", minutes:20, mult:1.2, tags:["retail"], desc:"Wallets open across the aisles." },
  { id:"storm", name:"Harbour Storm", minutes:20, mult:0.75, tags:["travel","delivery"], desc:"Boats stay tied up." },
  { id:"fair", name:"Suburb Fair", minutes:24, mult:1.35, tags:["food"], desc:"Stalls and bakeries sell out." },
  { id:"launch", name:"Product Launch", minutes:28, mult:1.4, tags:["retail","tech"], desc:"Queues outside Circuit Shelf." },
  { id:"conference", name:"Ledger Conference", minutes:36, mult:1.3, tags:["office","hotel"], desc:"Badge lanyards everywhere." },
  { id:"heatwave", name:"Heatwave", minutes:22, mult:1.25, tags:["cafe","food"], desc:"Cold drinks vanish." },
  { id:"matchday", name:"Match Day", minutes:18, mult:1.6, tags:["entertainment","event"], desc:"The Bowl is packed." },
  { id:"sale", name:"City Sale", minutes:26, mult:1.3, tags:["retail","mall","fashion"], desc:"Discount signs in every window." },
  { id:"delay", name:"Flight Wave", minutes:20, mult:1.4, tags:["airport","hotel"], desc:"Overnight guests fill rooms." },
  { id:"greenweek", name:"Green Week", minutes:30, mult:1.15, tags:["service","auto"], desc:"People maintain what they own." },
  { id:"investors", name:"Investor Walk", minutes:16, mult:1.2, tags:["prestige","finance"], desc:"Tours of the nicer towers." },
  { id:"rain", name:"Soft Rain", minutes:14, mult:1.1, tags:["cafe","mall"], desc:"People duck indoors." },
  { id:"parade", name:"Harbour Parade", minutes:22, mult:1.35, tags:["entertainment","food"], desc:"Floats and street food." },
  { id:"nightmarket", name:"Night Market", minutes:20, mult:1.4, tags:["food","retail"], desc:"Lanterns and late trade." },
  { id:"clearskies", name:"Clear Skies", minutes:40, mult:1.1, tags:null, desc:"A calm, profitable day." }
];
export const DAILY = [
  { day:1, type:"cash", value:2500, label:"Starter Cash" },
  { day:2, type:"xp", value:80, label:"Field Notes" },
  { day:3, type:"boost", value:1.25, label:"Upgrade Boost" },
  { day:4, type:"cash", value:8000, label:"Payroll Float" },
  { day:5, type:"employee", value:1, label:"Temp Hire" },
  { day:6, type:"boost", value:1.4, label:"Premium Hours" },
  { day:7, type:"cash", value:25000, label:"Weekly Vault" }
];
export const DEMO_LEADERBOARD = [
  { name:"Alex Vale", worth:48200000000, level:15 },
  { name:"Jordan Hayes", worth:36700000000, level:14 },
  { name:"Sam Brooks", worth:21400000000, level:13 },
  { name:"Taylor West", worth:14900000000, level:12 },
  { name:"Riley Cole", worth:9800000000, level:11 },
  { name:"Casey Lane", worth:6100000000, level:10 },
  { name:"Quinn Park", worth:2400000000, level:9 },
  { name:"Morgan Reed", worth:880000000, level:8 }
];
export const AVATARS = ["🙂","😎","🤓","😊","🤠","🧠","🎯","🌟"];
export const THEMES = ["dark", "midnight", "system"];
export const CAR_COLORS = ["#4de2c8","#f5c14a","#8b7cff","#ff6b8a","#4da6ff","#53d48a","#ffffff","#222833"];
