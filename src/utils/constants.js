export const C = {
  bg:"#ede0d4", bg2:"#e6d5c5", bg3:"#dfc9b5",
  brown:"#6b4c3b", brownL:"#9c7b6a", brownD:"#4a2e1e",
  text:"#2c1a10", textDim:"#5a3e30", textFaint:"#8a6a58",
  white:"#1e0f07", gold:"#a0622a",
};

export const F = {
  cin: "'Cinzel',serif",
  cor: "'Cormorant Garamond',serif",
  ral: "'Raleway',sans-serif"
};

export const genId = (ch) =>
  `AET-${Math.floor(1000 + Math.random() * 8999)}-${["I","II","III","IV","V"][ch] || "I"}`;