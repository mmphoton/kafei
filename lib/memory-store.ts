import { randomUUID } from 'crypto';

type Coffee = { id: string; name: string; type?: string | null; origin?: string | null; roastLevel?: string | null; createdAt: Date };
type Grinder = { id: string; name: string; minSetting: number; maxSetting: number; unit: string; finerDirection: string; helperText: string };
type Brew = { id: string; coffeeId: string; grinderId: string; brewMethod: string; grinderSetting: number; doseG: number; beverageOutputG: number; waterInputG: number; brewRatio: number; waterTempC: number; brewTimeSec: number; tastingNotes?: string; rating: number; notes?: string; followedPreviousAdvice: boolean; previousBrewId?: string | null; x: number; y: number; tastedAt: Date };
type Rec = { id: string; brewId: string; variable: string; direction: string; stepSize: string };
type Feedback = { id: string; currentBrewId: string; previousBrewId: string; value: string; followedStatus: string; note?: string; createdAt: Date };

type Store = { coffees: Coffee[]; grinders: Grinder[]; brews: Brew[]; recs: Rec[]; feedback: Feedback[] };

const g = globalThis as unknown as { __kafeiStore?: Store };
if (!g.__kafeiStore) g.__kafeiStore = { coffees: [], grinders: [], brews: [], recs: [], feedback: [] };

export const mem = g.__kafeiStore;
export const uid = () => randomUUID();
