import { PrismaClient } from '@prisma/client';
import { tagGroups } from '../lib/constants';

const prisma = new PrismaClient();

type GrinderSeed = {
  name: string;
  minSetting: number;
  maxSetting: number;
  unit: string;
  finerDirection: string;
  helperText: string;
};

const grinders: GrinderSeed[] = [
  { name: '1Zpresso J-Max', minSetting: 80, maxSetting: 220, unit: 'clicks', finerDirection: 'lower=finer', helperText: 'External burr hand grinder' },
  { name: 'Comandante C40', minSetting: 10, maxSetting: 40, unit: 'clicks', finerDirection: 'lower=finer', helperText: 'Use Red Clix if available' },
  { name: 'Timemore C2/C3', minSetting: 6, maxSetting: 30, unit: 'clicks', finerDirection: 'lower=finer', helperText: 'Starter hand grinder' },
  { name: 'Fellow Ode', minSetting: 1, maxSetting: 11, unit: 'dial', finerDirection: 'lower=finer', helperText: 'Flat burr electric' },
  { name: 'Baratza Encore / Encore ESP', minSetting: 1, maxSetting: 40, unit: 'dial', finerDirection: 'lower=finer', helperText: 'Conical burr electric' },
  { name: 'Generic stepped grinder', minSetting: 1, maxSetting: 60, unit: 'step', finerDirection: 'lower=finer', helperText: 'Customize step scale' },
  { name: 'Generic stepless grinder', minSetting: 0, maxSetting: 100, unit: 'index', finerDirection: 'lower=finer', helperText: 'Use marker reference' },
];

async function main() {
  for (const grinder of grinders) {
    await prisma.grinder.upsert({
      where: { name: grinder.name },
      update: {},
      create: grinder,
    });
  }

  const existingCoffee = await prisma.coffee.findFirst({ where: { name: 'Ethiopia Kochere' } });
  if (!existingCoffee) {
    await prisma.coffee.create({
      data: { name: 'Ethiopia Kochere', type: 'Washed', origin: 'Ethiopia', roastLevel: 'Light' },
    });
  }

  for (const [groupName, tags] of Object.entries(tagGroups)) {
    for (const tagName of tags) {
      await prisma.tasteTag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName, groupName },
      });
    }
  }
}

main().finally(() => prisma.$disconnect());
