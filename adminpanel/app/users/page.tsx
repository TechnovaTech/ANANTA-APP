'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string, value: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('/api/admin/users', 
        { userId, [action]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      alert('Error updating user');
    }
  };

  const filteredUsers = users.filter((user: any) => 
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.userId.toLowerCase().includes(search.toLowerCase()) ||
    user.phone.includes(search)
  );

  if (loading) {
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:400}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:48,height:48,border:'4px solid #e2e8f0',borderTop:'4px solid #4299e1',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}}></div>
          <p style={{color:'#718096',fontSize:16}}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{marginBottom:32}}>
        <h1 style={{margin:0,fontSize:28,fontWeight:700,color:'#1a202c',marginBottom:8}}>User Management</h1>
        <p style={{margin:0,color:'#718096',fontSize:16}}>Manage user accounts and permissions</p>
      </div>

      {/* Search and Actions */}
      <div style={{background:'white',padding:24,borderRadius:12,marginBottom:24,border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
          <div style={{flex:1,maxWidth:400}}>
            <input
              type="text"
              placeholder="Search by username, ID, or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width:'100%',
                padding:'12px 16px',
                border:'2px solid #e2e8f0',
                borderRadius:8,
                fontSize:14,
                outline:'none',
                transition:'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4299e1'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <span style={{color:'#718096',fontSize:14}}>Total Users: <strong>{users.length}</strong></span>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div style={{background:'white',borderRadius:12,overflow:'hidden',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f7fafc',borderBottom:'2px solid #e2e8f0'}}>
                <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>User Details</th>
                <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Contact</th>
                <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Status</th>
                <th style={{padding:'16px 20px',textAlign:'left',fontWeight:600,color:'#2d3748',fontSize:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any, index) => (
                <tr key={user._id} style={{borderBottom:index < filteredUsers.length - 1 ? '1px solid #e2e8f0' : 'none'}}>
                  <td style={{padding:'20px'}}>
                    <div>
                      <div style={{fontWeight:600,color:'#1a202c',fontSize:16,marginBottom:4}}>{user.username}</div>
                      <div style={{fontSize:14,color:'#718096',fontFamily:'monospace',background:'#f7fafc',padding:'2px 8px',borderRadius:4,display:'inline-block'}}>
                        ID: {user.userId}
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'20px'}}>
                    <div style={{color:'#4a5568',fontSize:15}}>{user.phone}</div>
                  </td>
                  <td style={{padding:'20px'}}>
                    <span style={{
                      padding:'8px 16px',
                      borderRadius:20,
                      fontSize:12,
                      fontWeight:600,
                      textTransform:'uppercase',
                      letterSpacing:'0.05em',
                      background: user.isBanned ? '#fed7d7' : user.isBlocked ? '#fef5e7' : '#f0fff4',
                      color: user.isBanned ? '#c53030' : user.isBlocked ? '#d69e2e' : '#38a169',
                      border: `1px solid ${user.isBanned ? '#feb2b2' : user.isBlocked ? '#fbd38d' : '#9ae6b4'}`
                    }}>
                      {user.isBanned ? 'Banned' : user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td style={{padding:'20px'}}>
                    <div style={{display:'flex',gap:8}}>
                      <button 
                        onClick={() => handleUserAction(user.userId, 'isBlocked', !user.isBlocked)}
                        style={{
                          padding:'8px 16px',
                          border:'none',
                          borderRadius:6,
                          cursor:'pointer',
                          fontSize:13,
                          fontWeight:600,
                          background: user.isBlocked ? '#38a169' : '#ed8936',
                          color:'white',
                          transition:'all 0.2s'
                        }}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      <button 
                        onClick={() => handleUserAction(user.userId, 'isBanned', !user.isBanned)}
                        style={{
                          padding:'8px 16px',
                          border:'none',
                          borderRadius:6,
                          cursor:'pointer',
                          fontSize:13,
                          fontWeight:600,
                          background: user.isBanned ? '#38a169' : '#e53e3e',
                          color:'white',
                          transition:'all 0.2s'
                        }}
                      >
                        {user.isBanned ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div style={{textAlign:'center',padding:64,background:'white',borderRadius:12,border:'1px solid #e2e8f0',marginTop:24}}>
          <div style={{fontSize:48,marginBottom:16,opacity:0.5}}>👥</div>
          <h3 style={{margin:0,color:'#4a5568',fontSize:18,marginBottom:8}}>No users found</h3>
          <p style={{margin:0,color:'#718096'}}>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}