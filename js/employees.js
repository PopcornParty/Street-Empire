import { EMPLOYEE_ROLES } from "./data.js";
import { getState, patch, logActivity } from "./state.js";
import { staffSalary } from "./economy.js";
import { notify } from "./notifications.js";
import { sfx } from "./audio.js";
import { randomName, uid, pick } from "./utils.js";

export function hireCost(role) {
  return Math.floor(role.salary * 40 * (role.rarity === "legendary" ? 8 : role.rarity === "rare" ? 3.5 : role.rarity === "uncommon" ? 2 : 1));
}
export function hireEmployee(roleId) {
  const s = getState();
  const role = EMPLOYEE_ROLES.find((r) => r.id === roleId);
  if (!role) return false;
  const cost = hireCost(role);
  if (s.cash < cost) { notify("Not enough cash"); return false; }
  if (role.rarity === "legendary" && s.reputation < 80) { notify("Need 80 reputation for an Executive"); return false; }
  const emp = { id: uid(), name: randomName(), role: role.id, roleName: role.name, icon: role.icon, level: 1, salary: role.salary, bonus: role.bonus, rarity: role.rarity, assigned: null };
  patch((st) => { st.cash -= cost; st.stats.spent += cost; st.employees.push(emp); st.xp += 20; st.reputation += 1; logActivity(st, `Hired ${emp.name} as ${role.name}.`); });
  sfx("buy"); notify(`${emp.name} joined the team.`, "HIRED"); return emp;
}
export function assignEmployee(empId, bizId) {
  patch((s) => { const e = s.employees.find((x) => x.id === empId); if (!e) return; e.assigned = bizId || null; if (bizId) s.stats.assigned += 1; });
  notify(bizId ? "Employee assigned." : "Employee unassigned.");
}
export function trainEmployee(empId) {
  const s = getState(); const e = s.employees.find((x) => x.id === empId); if (!e) return false;
  if (e.level >= 10) { notify("Max staff level"); return false; }
  const cost = Math.floor(hireCost(EMPLOYEE_ROLES.find((r) => r.id === e.role)) * 0.35 * e.level);
  if (s.cash < cost) { notify("Not enough cash"); return false; }
  patch((st) => { st.cash -= cost; st.stats.spent += cost; st.employees.find((x) => x.id === empId).level += 1; st.xp += 10; });
  sfx("upgrade"); notify(`${e.name} trained to Lv ${e.level + 1}.`); return true;
}
export function fireEmployee(empId) { patch((s) => { s.employees = s.employees.filter((e) => e.id !== empId); }); notify("Contract ended."); }
export function payrollHour(s) { return s.employees.reduce((n, e) => n + staffSalary(e.salary, e.level), 0); }
export function grantRandomEmployee() {
  const role = pick(EMPLOYEE_ROLES.filter((r) => r.rarity !== "legendary"));
  const emp = { id: uid(), name: randomName(), role: role.id, roleName: role.name, icon: role.icon, level: 1, salary: role.salary, bonus: role.bonus, rarity: role.rarity, assigned: null };
  patch((s) => s.employees.push(emp)); notify(`${emp.name} (${role.name}) joined as a reward.`); return emp;
}
