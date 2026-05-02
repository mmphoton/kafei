'use client';
import { LineChart,Line,XAxis,YAxis,Tooltip,BarChart,Bar,PieChart,Pie,Cell,ScatterChart,Scatter } from 'recharts';
export function RatingChart({data}:{data:any[]}){return <LineChart width={360} height={220} data={data}><XAxis dataKey='date'/><YAxis/><Tooltip/><Line dataKey='rating' stroke='#10b981'/></LineChart>}
export function TagChart({data}:{data:any[]}){return <BarChart width={360} height={220} data={data}><XAxis dataKey='name'/><YAxis/><Tooltip/><Bar dataKey='count' fill='#60a5fa'/></BarChart>}
export function FeedbackChart({data}:{data:any[]}){const c=['#10b981','#f59e0b','#ef4444'];return <PieChart width={300} height={220}><Pie data={data} dataKey='value' nameKey='name'>{data.map((_:any,i:number)=><Cell key={i} fill={c[i%3]}/>)}</Pie></PieChart>}
export function RatioScatter({data}:{data:any[]}){return <ScatterChart width={360} height={220}><XAxis dataKey='ratio'/><YAxis dataKey='rating'/><Tooltip/><Scatter data={data} fill='#a78bfa'/></ScatterChart>}
