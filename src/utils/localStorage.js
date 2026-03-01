export const lsGet = (k) => {
  try { return JSON.parse(localStorage.getItem(k)); }
  catch { return null; }
};

export const lsSet = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); }
  catch {}
};