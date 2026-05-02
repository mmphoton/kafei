import { PrismaClient } from '@prisma/client';
import { tagGroups } from '../lib/constants';
const prisma=new PrismaClient();
async function main(){
  const grinders=[['1Zpresso J-Max',80,220,'clicks','lower=finer','External burr hand grinder'],['Comandante C40',10,40,'clicks','lower=finer','Use Red Clix if available'],['Timemore C2/C3',6,30,'clicks','lower=finer','Starter hand grinder'],['Fellow Ode',1,11,'dial','lower=finer','Flat burr electric'],['Baratza Encore / Encore ESP',1,40,'dial','lower=finer','Conical burr electric'],['Generic stepped grinder',1,60,'step','lower=finer','Customize step scale'],['Generic stepless grinder',0,100,'index','lower=finer','Use marker reference']];
  for(const g of grinders){await prisma.grinder.upsert({where:{name:g[0]},update:{},create:{name:g[0],minSetting:g[1] as number,maxSetting:g[2] as number,unit:g[3] as string,finerDirection:g[4] as string,helperText:g[5] as string}})}
  await prisma.coffee.create({data:{name:'Ethiopia Kochere',type:'Washed',origin:'Ethiopia',roastLevel:'Light'}});
  for(const [k,v] of Object.entries(tagGroups)) for(const t of v){await prisma.tasteTag.upsert({where:{name:t},update:{},create:{name:t,groupName:k}})}
}
main().finally(()=>prisma.$disconnect());
