import { prisma } from '@/lib/prisma';
import { RatingChart,TagChart,FeedbackChart,RatioScatter } from '@/components/charts';
export default async function Analytics(){const brews=await prisma.brew.findMany({orderBy:{tastedAt:'asc'}});const fb=await prisma.feedback.findMany();
const ratingData=brews.map(b=>({date:b.tastedAt.toISOString().slice(5,10),rating:b.rating,ratio:b.brewRatio}));
const tags=await prisma.brewTag.findMany({include:{tag:true}}); const counts=Object.values(tags.reduce((a,t)=>((a[t.tag.name]={name:t.tag.name,count:(a[t.tag.name]?.count||0)+1}),a),{} as any));
const fd=['Better','Same','Worse'].map(n=>({name:n,value:fb.filter(f=>f.value===n.toLowerCase()).length}));
return <div className='space-y-4'><h1 className='text-xl'>Recommendation Analytics</h1><div className='grid md:grid-cols-2 gap-4'><div className='card'><RatingChart data={ratingData}/></div><div className='card'><TagChart data={counts}/></div><div className='card'><FeedbackChart data={fd}/></div><div className='card'><RatioScatter data={ratingData}/></div></div></div>}
