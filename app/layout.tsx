import './globals.css';
import Link from 'next/link';
export default function RootLayout({children}:{children:React.ReactNode}){return <html><body><div className='max-w-6xl mx-auto p-4 space-y-4'><nav className='flex gap-3 text-sm'><Link href='/'>Dashboard</Link><Link href='/brews/new'>New Brew</Link><Link href='/analytics'>Analytics</Link><Link href='/settings'>Settings</Link><Link href='/about'>About recommendations</Link></nav>{children}</div></body></html>}
