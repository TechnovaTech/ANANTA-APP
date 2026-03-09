'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RechargesPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawCoinAmount, setWithdrawCoinAmount] = useState<number>(100);
  const [withdrawRupeeAmount, setWithdrawRupeeAmount] = useState<number>(10);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
    fetchWithdrawConfig();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/withdrawals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWithdrawals(response.data.withdrawals || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/withdrawals/config', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        if (typeof response.data.coinAmount === 'number') {
          setWithdrawCoinAmount(response.data.coinAmount);
        }
        if (typeof response.data.rupeeAmount === 'number') {
          setWithdrawRupeeAmount(response.data.rupeeAmount);
        }
      }
    } catch (error) {
    }
  };

  const saveWithdrawConfig = async () => {
    try {
      setSavingConfig(true);
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/admin/withdrawals/config',
        {
          coinAmount: withdrawCoinAmount,
          rupeeAmount: withdrawRupeeAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      alert('Error saving withdraw value');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleWithdrawAction = async (withdrawId: number, action: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/admin/withdrawals',
        { withdrawId, action },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchWithdrawals();
    } catch (error) {
      alert('Error processing withdraw');
    }
  };

  if (loading) {
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:400}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:48,height:48,border:'4px solid #e2e8f0',borderTop:'4px solid #4299e1',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}}></div>
          <p style={{color:'#718096',fontSize:16}}>Loading withdraw requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{margin:0,fontSize:28,fontWeight:700,color:'#1a202c',marginBottom:8}}>Withdraw Requests</h1>
        <p style={{margin:0,color:'#718096',fontSize:16}}>Review and process user withdraw requests</p>
      </div>
        <div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))',gap:24,marginBottom:24}}>
            <div style={{background:'white',padding:20,borderRadius:12,border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
              <h3 style={{margin:0,marginBottom:8,fontSize:16,color:'#2d3748'}}>Value setting</h3>
              <p style={{margin:0,marginBottom:16,fontSize:13,color:'#718096'}}>
                Set how many coins equal how many rupees for withdraw only.
              </p>
              <div style={{display:'flex',gap:12,marginBottom:16}}>
                <div style={{flex:1}}>
                  <label style={{display:'block',fontSize:12,fontWeight:600,color:'#4a5568',marginBottom:4}}>
                    Coins
                  </label>
                  <input
                    type="number"
                    value={withdrawCoinAmount}
                    onChange={(e) => setWithdrawCoinAmount(Number(e.target.value) || 0)}
                    style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #cbd5e0',fontSize:14}}
                  />
                </div>
                <div style={{flex:1}}>
                  <label style={{display:'block',fontSize:12,fontWeight:600,color:'#4a5568',marginBottom:4}}>
                    Rupees
                  </label>
                  <input
                    type="number"
                    value={withdrawRupeeAmount}
                    onChange={(e) => setWithdrawRupeeAmount(Number(e.target.value) || 0)}
                    style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #cbd5e0',fontSize:14}}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={saveWithdrawConfig}
                disabled={savingConfig}
                style={{
                  padding:'8px 16px',
                  border:'none',
                  borderRadius:6,
                  background:'#3182ce',
                  color:'white',
                  fontSize:13,
                  fontWeight:600,
                  cursor:'pointer',
                  opacity:savingConfig ? 0.7 : 1,
                }}
              >
                {savingConfig ? 'Saving...' : 'Save'}
              </button>
              <p style={{margin:0,marginTop:8,fontSize:12,color:'#718096'}}>
                Current: {withdrawCoinAmount} coins = ₹{withdrawRupeeAmount}
              </p>
            </div>
          </div>
          <div style={{background:'white',borderRadius:12,overflow:'hidden',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
            <div style={{padding:20,borderBottom:'1px solid #e2e8f0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <h2 style={{margin:0,fontSize:20,color:'#2d3748'}}>Withdraw Requests</h2>
                <p style={{margin:0,marginTop:4,color:'#718096',fontSize:14}}>Review and process user withdraw requests</p>
              </div>
              <div style={{textAlign:'right'}}>
                <p style={{margin:0,color:'#4a5568',fontSize:14}}>
                  Pending: <strong>{withdrawals.filter(w => w.status === 'PENDING').length}</strong>
                </p>
              </div>
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f7fafc',borderBottom:'2px solid #e2e8f0'}}>
                  <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>User ID</th>
                  <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Amount</th>
                  <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Bank</th>
                  <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Account</th>
                  <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Status</th>
                  <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w, index) => (
                  <tr key={w.id} style={{borderBottom:index < withdrawals.length - 1 ? '1px solid #e2e8f0' : 'none'}}>
                    <td style={{padding:'16px 20px'}}>
                      <span style={{fontFamily:'monospace',background:'#f7fafc',padding:'6px 12px',borderRadius:6,fontSize:14,fontWeight:600,color:'#4a5568'}}>
                        {w.userId}
                      </span>
                    </td>
                    <td style={{padding:'16px 20px'}}>
                      <span style={{fontWeight:700,fontSize:16,color:'#1a202c'}}>
                        ₹{(w.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td style={{padding:'16px 20px'}}>
                      <div style={{fontSize:14,color:'#4a5568'}}>
                        <div>{w.bankName}</div>
                        <div style={{fontSize:12,color:'#718096'}}>{w.branchName}</div>
                      </div>
                    </td>
                    <td style={{padding:'16px 20px'}}>
                      <div style={{fontSize:14,color:'#4a5568'}}>
                        <div>{w.accountHolderName}</div>
                        <div style={{fontFamily:'monospace',fontSize:12,color:'#718096'}}>{w.accountNumber}</div>
                        <div style={{fontSize:12,color:'#718096'}}>IFSC: {w.ifscCode}</div>
                      </div>
                    </td>
                    <td style={{padding:'16px 20px'}}>
                      <span style={{
                        padding:'8px 16px',
                        borderRadius:20,
                        fontSize:12,
                        fontWeight:600,
                        textTransform:'uppercase',
                        letterSpacing:'0.05em',
                        background: w.status === 'PAID' ? '#f0fff4' : w.status === 'DECLINED' ? '#fed7d7' : '#fef5e7',
                        color: w.status === 'PAID' ? '#38a169' : w.status === 'DECLINED' ? '#c53030' : '#d69e2e',
                        border: `1px solid ${w.status === 'PAID' ? '#9ae6b4' : w.status === 'DECLINED' ? '#feb2b2' : '#fbd38d'}`
                      }}>
                        {w.status}
                      </span>
                    </td>
                    <td style={{padding:'16px 20px'}}>
                      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                        {w.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleWithdrawAction(w.id, 'approve')}
                              style={{
                                padding:'8px 14px',
                                border:'none',
                                borderRadius:6,
                                cursor:'pointer',
                                fontSize:12,
                                fontWeight:600,
                                background:'#38a169',
                                color:'white',
                              }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleWithdrawAction(w.id, 'decline')}
                              style={{
                                padding:'8px 14px',
                                border:'1px solid #e53e3e',
                                borderRadius:6,
                                cursor:'pointer',
                                fontSize:12,
                                fontWeight:600,
                                background:'white',
                                color:'#e53e3e',
                              }}
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {w.status === 'APPROVED' && (
                          <button
                            onClick={() => handleWithdrawAction(w.id, 'paid')}
                            style={{
                              padding:'8px 14px',
                              border:'none',
                              borderRadius:6,
                              cursor:'pointer',
                              fontSize:12,
                              fontWeight:600,
                              background:'#3182ce',
                              color:'white',
                            }}
                          >
                            Mark paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {withdrawals.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{padding:40,textAlign:'center',color:'#718096',fontSize:14}}>
                      No withdraw requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    </div>
  );
}
