'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return (
      <html lang="en">
        <body style={{margin:0,fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',background:'#f7f8fc'}}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body style={{margin:0,fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',background:'#f7f8fc'}}>
        {/* Fixed Top Header */}
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          right:0,
          background:'#1a202c',
          color:'white',
          padding:'0 32px',
          height:72,
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          boxShadow:'0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex:1000
        }}>
          <div style={{display:'flex',alignItems:'center'}}>
            <div style={{width:40,height:40,background:'linear-gradient(135deg, #4299e1, #3182ce)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',marginRight:16,fontWeight:'bold',fontSize:18}}>A</div>
            <div>
              <h1 style={{margin:0,fontSize:20,fontWeight:600}}>ANANTA</h1>
              <p style={{margin:0,fontSize:12,opacity:0.7}}>Administration Panel</p>
            </div>
          </div>
          <button 
            onClick={()=>{localStorage.removeItem('token');window.location.href='/login'}} 
            style={{padding:'10px 20px',background:'#2d3748',color:'white',border:'1px solid #4a5568',borderRadius:6,cursor:'pointer',fontWeight:500,fontSize:14}}
          >
            Sign Out
          </button>
        </div>

        <div style={{display:'flex',paddingTop:72}}>
          {/* Fixed Sidebar */}
          <div style={{
            position:'fixed',
            top:72,
            left:0,
            width:280,
            height:'calc(100vh - 72px)',
            background:'white',
            borderRight:'1px solid #e2e8f0',
            padding:'24px 0',
            overflowY:'auto',
            zIndex:999
          }}>
            <div style={{padding:'0 24px',marginBottom:32}}>
              <h3 style={{margin:0,fontSize:14,fontWeight:600,color:'#4a5568',textTransform:'uppercase',letterSpacing:'0.05em'}}>Management</h3>
            </div>
            
            <nav>
              <Link href="/users" style={{
                display:'flex',
                alignItems:'center',
                padding:'12px 24px',
                textDecoration:'none',
                color: pathname==='/users' ? '#3182ce' : '#4a5568',
                background: pathname==='/users' ? '#ebf8ff' : 'transparent',
                borderRight: pathname==='/users' ? '3px solid #3182ce' : '3px solid transparent',
                fontWeight: pathname==='/users' ? 600 : 500,
                fontSize:15
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:12}}>
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                User Management
              </Link>
              
              <Link href="/recharges" style={{
                display:'flex',
                alignItems:'center',
                padding:'12px 24px',
                textDecoration:'none',
                color: pathname==='/recharges' ? '#3182ce' : '#4a5568',
                background: pathname==='/recharges' ? '#ebf8ff' : 'transparent',
                borderRight: pathname==='/recharges' ? '3px solid #3182ce' : '3px solid transparent',
                fontWeight: pathname==='/recharges' ? 600 : 500,
                fontSize:15
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:12}}>
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                  <path d="M8 1v6h8V1"/>
                </svg>
                Recharge Requests
              </Link>
              
              <Link href="/kyc" style={{
                display:'flex',
                alignItems:'center',
                padding:'12px 24px',
                textDecoration:'none',
                color: pathname==='/kyc' ? '#3182ce' : '#4a5568',
                background: pathname==='/kyc' ? '#ebf8ff' : 'transparent',
                borderRight: pathname==='/kyc' ? '3px solid #3182ce' : '3px solid transparent',
                fontWeight: pathname==='/kyc' ? 600 : 500,
                fontSize:15
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:12}}>
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                KYC Verification
              </Link>
            </nav>
          </div>

          {/* Main Content with left margin for sidebar */}
          <div style={{marginLeft:280,flex:1,padding:32,background:'#f7f8fc',minHeight:'calc(100vh - 72px)'}}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}