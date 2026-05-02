import { describe,it,expect } from 'vitest';
import { generateAdvice, positionFromTags } from '../lib/recommendation';
describe('recommendation engine',()=>{it('maps sour thin to extract more',()=>{const adv=generateAdvice(['sour','thin'],16);expect(adv[0].ruleKey).toBe('sour_watery');});it('returns compass point',()=>{const p=positionFromTags(['bitter','heavy'],14);expect(p.x).toBeGreaterThan(0);});});
