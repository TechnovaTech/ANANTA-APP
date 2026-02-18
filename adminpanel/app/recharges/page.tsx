'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RechargesPage() {
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecharges();
  }, []);

  const fetchRecharges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/recharges', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecharges(response.data.recharges);
    } catch (error) {
      console.error('Error fetching recharges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRechargeAction = async (rechargeId: string, action: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/recharges', 
        { rechargeId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRecharges();
    } catch (error) {
      alert('Error processing recharge');
    }
  };

  if (loading) {
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:400}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:48,height:48,border:'4px solid #e2e8f0',borderTop:'4px solid #4299e1',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}}></div>
          <p style={{color:'#718096',fontSize:16}}>Loading recharge requests...</p>
        </div>
      </div>
    );
  }

  const pendingCount = recharges.filter((r: any) => r.status === 'PENDING').length;
  const approvedCount = recharges.filter((r: any) => r.status === 'APPROVED').length;
  const rejectedCount = recharges.filter((r: any) => r.status === 'REJECTED').length;
  const totalAmount = recharges.filter((r: any) => r.status === 'APPROVED').reduce((sum: number, r: any) => sum + r.amount, 0);

  return (
    <div>
      {/* Page Header */}
      <div style={{marginBottom:32}}>
        <h1 style={{margin:0,fontSize:28,fontWeight:700,color:'#1a202c',marginBottom:8}}>Recharge Management</h1>
        <p style={{margin:0,color:'#718096',fontSize:16}}>Review and process user recharge requests</p>
      </div>

      {/* Statistics Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',gap:24,marginBottom:32}}>
        <div style={{background:'white',padding:24,borderRadius:12,border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <p style={{margin:0,fontSize:14,color:'#718096',marginBottom:8,fontWeight:500}}>Pending Requests</p>
              <p style={{margin:0,fontSize:32,fontWeight:700,color:'#ed8936'}}>{pendingCount}</p>
            </div>
            <div style={{width:56,height:56,background:'#fef5e7',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ed8936">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{background:'white',padding:24,borderRadius:12,border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <p style={{margin:0,fontSize:14,color:'#718096',marginBottom:8,fontWeight:500}}>Approved</p>
              <p style={{margin:0,fontSize:32,fontWeight:700,color:'#38a169'}}>{approvedCount}</p>
            </div>
            <div style={{width:56,height:56,background:'#f0fff4',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#38a169">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{background:'white',padding:24,borderRadius:12,border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <p style={{margin:0,fontSize:14,color:'#718096',marginBottom:8,fontWeight:500}}>Total Approved Amount</p>
              <p style={{margin:0,fontSize:32,fontWeight:700,color:'#4299e1'}}>₹{totalAmount.toLocaleString()}</p>
            </div>
            <div style={{width:56,height:56,background:'#ebf8ff',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#4299e1">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recharges Table */}
      <div style={{background:'white',borderRadius:12,overflow:'hidden',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f7fafc',borderBottom:'2px solid #e2e8f0'}}>
                <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>User ID</th>
                <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Amount</th>
                <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Status</th>
                <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Date Submitted</th>
                <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recharges.map((recharge: any, index) => (
                <tr key={recharge._id} style={{borderBottom:index < recharges.length - 1 ? '1px solid #e2e8f0' : 'none'}}>
                  <td style={{padding:'20px'}}>
                    <span style={{fontFamily:'monospace',background:'#f7fafc',padding:'6px 12px',borderRadius:6,fontSize:14,fontWeight:600,color:'#4a5568'}}>
                      {recharge.userId}
                    </span>
                  </td>
                  <td style={{padding:'20px'}}>
                    <span style={{fontWeight:700,fontSize:18,color:'#1a202c'}}>₹{recharge.amount.toLocaleString()}</span>
                  </td>
                  <td style={{padding:'20px'}}>
                    <span style={{
                      padding:'8px 16px',
                      borderRadius:20,
                      fontSize:12,
                      fontWeight:600,
                      textTransform:'uppercase',
                      letterSpacing:'0.05em',
                      background: recharge.status === 'APPROVED' ? '#f0fff4' : recharge.status === 'REJECTED' ? '#fed7d7' : '#fef5e7',
                      color: recharge.status === 'APPROVED' ? '#38a169' : recharge.status === 'REJECTED' ? '#c53030' : '#d69e2e',
                      border: `1px solid ${recharge.status === 'APPROVED' ? '#9ae6b4' : recharge.status === 'REJECTED' ? '#feb2b2' : '#fbd38d'}`
                    }}>
                      {recharge.status}
                    </span>
                  </td>
                  <td style={{padding:'20px'}}>
                    <span style={{color:'#718096',fontSize:15}}>{new Date(recharge.createdAt).toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric'})}</span>
                  </td>
                  <td style={{padding:'20px'}}>
                    {recharge.status === 'PENDING' && (
                      <div style={{display:'flex',gap:8}}>
                        <button 
                          onClick={() => handleRechargeAction(recharge._id, 'approve')}
                          style={{
                            padding:'10px 20px',
                            border:'none',
                            borderRadius:6,
                            cursor:'pointer',
                            fontSize:13,
                            fontWeight:600,
                            background:'#38a169',
                            color:'white',
                            transition:'all 0.2s'
                          }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRechargeAction(recharge._id, 'reject')}
                          style={{
                            padding:'10px 20px',
                            border:'1px solid #e53e3e',
                            borderRadius:6,
                            cursor:'pointer',
                            fontSize:13,
                            fontWeight:600,
                            background:'white',
                            color:'#e53e3e',
                            transition:'all 0.2s'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {recharges.length === 0 && (
        <div style={{textAlign:'center',padding:64,background:'white',borderRadius:12,border:'1px solid #e2e8f0',marginTop:24}}>
          <div style={{fontSize:48,marginBottom:16,opacity:0.5}}>💳</div>
          <h3 style={{margin:0,color:'#4a5568',fontSize:18,marginBottom:8}}>No recharge requests</h3>
          <p style={{margin:0,color:'#718096'}}>Recharge requests will appear here when submitted</p>
        </div>
      )}
    </div>
  );
}