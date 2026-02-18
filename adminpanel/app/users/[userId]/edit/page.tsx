'use client';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
      } catch (e) {
        console.error('Error loading user', e);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchDetail();
    }
  }, [userId]);

  const handleChange = (field: string, value: string) => {
    setUser((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/users/${user.userId}`, user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push(`/users/${user.userId}`);
    } catch (e) {
      alert('Error saving user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:400}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:48,height:48,border:'4px solid #e2e8f0',borderTop:'4px solid #4299e1',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}}></div>
          <p style={{color:'#718096',fontSize:16}}>Loading user...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div style={{padding:32}}>User not found</div>;
  }

  return (
    <div style={{maxWidth:800}}>
      <div style={{marginBottom:24}}>
        <h1 style={{margin:0,fontSize:26,fontWeight:700,color:'#1a202c'}}>Edit User</h1>
        <p style={{margin:0,color:'#718096'}}>Update user profile information</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{background:'white',borderRadius:12,border:'1px solid #e2e8f0',padding:24,marginBottom:24,display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <Input label="User ID" value={user.userId} disabled />
          <Input label="Phone" value={user.phone} onChange={(v) => handleChange('phone', v)} />
          <Input label="Username" value={user.username} onChange={(v) => handleChange('username', v)} />
          <Input label="Full Name" value={user.fullName || ''} onChange={(v) => handleChange('fullName', v)} />
          <Input label="Gender" value={user.gender || ''} onChange={(v) => handleChange('gender', v)} />
          <Input label="Birthday" value={user.birthday || ''} onChange={(v) => handleChange('birthday', v)} />
          <Input label="Bio" value={user.bio || ''} onChange={(v) => handleChange('bio', v)} full />
          <Input label="Address Line 1" value={user.addressLine1 || ''} onChange={(v) => handleChange('addressLine1', v)} full />
          <Input label="City" value={user.city || ''} onChange={(v) => handleChange('city', v)} />
          <Input label="State" value={user.state || ''} onChange={(v) => handleChange('state', v)} />
          <Input label="Country" value={user.country || ''} onChange={(v) => handleChange('country', v)} />
          <Input label="PIN Code" value={user.pinCode || ''} onChange={(v) => handleChange('pinCode', v)} />
          <Input label="Location" value={user.location || ''} onChange={(v) => handleChange('location', v)} full />
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:12}}>
          <button
            type="button"
            onClick={() => router.push(`/users/${user.userId}`)}
            style={{
              padding:'10px 20px',
              borderRadius:8,
              border:'1px solid #e2e8f0',
              background:'white',
              cursor:'pointer',
              fontSize:14,
              fontWeight:500,
              color:'#4a5568'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding:'10px 20px',
              borderRadius:8,
              border:'none',
              background:'#3182ce',
              cursor:'pointer',
              fontSize:14,
              fontWeight:600,
              color:'white'
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  disabled,
  full,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  full?: boolean;
}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6,gridColumn: full ? '1 / -1' : 'auto'}}>
      <label style={{fontSize:13,fontWeight:600,color:'#4a5568'}}>{label}</label>
      <input
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)}
        disabled={disabled}
        style={{
          padding:'10px 12px',
          borderRadius:8,
          border:'1px solid #e2e8f0',
          fontSize:14,
          outline:'none',
        }}
      />
    </div>
  );
}

