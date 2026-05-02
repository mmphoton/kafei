import { describe,it,expect } from 'vitest';
import { generateAdvice } from '../lib/recommendation';
describe('feedback + export smoke',()=>{it('has deterministic output',()=>{expect(generateAdvice(['balanced'],15)[0].ruleKey).toBe('balanced');});});
