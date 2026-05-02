export type Compass={x:number;y:number};
export type Advice={variable:string;direction:string;stepSize:string;reasoning:string;expectedMovement:string;ruleKey:string};
export function positionFromTags(tags:string[], ratio:number): Compass {
  let x=0,y=0; const s=new Set(tags);
  ['sour','sharp','salty'].forEach(t=>s.has(t)&&(x-=0.25)); ['bitter','dry','astringent','harsh'].forEach(t=>s.has(t)&&(x+=0.25));
  ['watery','thin','dilute'].forEach(t=>s.has(t)&&(y-=0.25)); ['heavy','thick','syrupy'].forEach(t=>s.has(t)&&(y+=0.25));
  if (ratio>17) y-=0.2; if (ratio<14) y+=0.2;
  return {x:Math.max(-1,Math.min(1,x)), y:Math.max(-1,Math.min(1,y))};
}
export function generateAdvice(tags:string[], ratio:number): Advice[] {
  const s=new Set(tags); const out:Advice[]=[];
  if ((s.has('sour')||s.has('sharp')) && (s.has('watery')||s.has('thin'))) out.push({variable:'grind size',direction:'finer',stepSize:'1-2 clicks',reasoning:'Sour + thin suggests under-extraction and weakness.',expectedMovement:'right and up',ruleKey:'sour_watery'});
  if ((s.has('bitter')||s.has('harsh')) && (s.has('dry')||s.has('astringent'))) out.push({variable:'grind size',direction:'coarser',stepSize:'1-2 clicks',reasoning:'Bitter + dry indicates over-extraction.',expectedMovement:'left and down',ruleKey:'bitter_dry'});
  if ((s.has('heavy')||s.has('robust')) && (s.has('sour')||s.has('salty'))) out.push({variable:'dose/ratio',direction:'less coffee or more output',stepSize:'increase ratio by 0.5-1',reasoning:'Strong but sharp cups need more extraction with less concentration.',expectedMovement:'right and down',ruleKey:'strong_sour'});
  if ((s.has('heavy')||s.has('robust')) && (s.has('bitter')||s.has('harsh'))) out.push({variable:'dose/ratio',direction:'less coffee or more output',stepSize:'increase ratio by 0.5-1',reasoning:'Strong and bitter cups are likely too concentrated and over-extracted.',expectedMovement:'left and down',ruleKey:'strong_bitter'});
  if ((s.has('watery')||s.has('thin')) && !s.has('sour')) out.push({variable:'dose/ratio',direction:'use more coffee or reduce output',stepSize:'decrease ratio by 0.5-1',reasoning:'Weak body without sourness often needs higher concentration.',expectedMovement:'up',ruleKey:'weak_no_sour'});
  if (s.has('balanced')||s.has('pleasant')) out.push({variable:'stability',direction:'hold recipe',stepSize:'change one variable only',reasoning:'Cup is balanced; avoid unnecessary changes.',expectedMovement:'center',ruleKey:'balanced'});
  if(!out.length) out.push({variable:'temperature',direction:'increase slightly',stepSize:'+1°C',reasoning:'No strong rule triggered; make a small controlled adjustment.',expectedMovement:'slight right/up',ruleKey:'fallback'});
  return out;
}
