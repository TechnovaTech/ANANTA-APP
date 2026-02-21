'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

const getImageSrc = (value: string | null | undefined) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('data:') || trimmed.startsWith('http') || trimmed.startsWith('/')) return trimmed;
  const compact = trimmed.replace(/\s/g, '');
  if (compact.length < 50) return null;
  if (!/^[A-Za-z0-9+/=]+$/.test(compact)) return null;
  return `data:image/jpeg;base64,${compact}`;
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  const [data, setData] = useState<{ user: any; kyc: any } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`/api/app/profile/${userId}`);
        console.log('User profile detail response', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching user detail', error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchDetail();
    }
  }, [userId]);

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

  if (!data || (!data.user && !data.kyc)) {
    return (
      <div style={{padding:32}}>
        <h2 style={{margin:0,fontSize:20,fontWeight:600,color:'#1a202c',marginBottom:8}}>User not found</h2>
      </div>
    );
  }

  const { user, kyc } = data;

  return (
    <div>
      <div style={{marginBottom:24,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{margin:0,fontSize:26,fontWeight:700,color:'#1a202c'}}>User Details</h1>
          <p style={{margin:0,color:'#718096'}}>Review full profile and KYC information</p>
        </div>
        <button
          onClick={() => router.push(`/users/${user.userId}/edit`)}
          style={{
            padding:'10px 20px',
            borderRadius:8,
            border:'none',
            cursor:'pointer',
            background:'#3182ce',
            color:'white',
            fontWeight:600,
            fontSize:14
          }}
        >
          Edit User
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'minmax(0, 1.5fr) minmax(0, 1fr)',gap:24}}>
        <div style={{background:'white',borderRadius:12,border:'1px solid #e2e8f0',padding:24}}>
          <h3 style={{marginTop:0,marginBottom:16,fontSize:18,color:'#2d3748'}}>Profile Information</h3>
          <div style={{display:'flex',marginBottom:16,alignItems:'center',gap:16}}>
            {getImageSrc(user.profileImage) ? (
              <img
                src={getImageSrc(user.profileImage) as string}
                alt="Profile"
                style={{width:72,height:72,borderRadius:'50%',objectFit:'cover',border:'2px solid #3182ce'}}
              />
            ) : (
              <div style={{width:72,height:72,borderRadius:'50%',background:'#e2e8f0',display:'flex',alignItems:'center',justifyContent:'center',color:'#a0aec0',fontSize:24}}>
                ?
              </div>
            )}
            <div style={{fontSize:14,color:'#4a5568'}}>
              <div style={{fontSize:18,fontWeight:600,color:'#2d3748',marginBottom:4}}>{user.username}</div>
              <div>{user.email}</div>
              <div>{user.phone}</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,fontSize:14,color:'#4a5568'}}>
            <Field label="User ID" value={user.userId} />
            <Field label="Username" value={user.username} />
            <Field label="Email" value={user.email} />
            <Field label="Phone" value={user.phone} />
            <Field label="Gender" value={user.gender} />
            <Field label="Birthday" value={user.birthday} />
            <Field label="Bio" value={user.bio} full />
          </div>
        </div>

        <div style={{background:'white',borderRadius:12,border:'1px solid #e2e8f0',padding:24}}>
          <h3 style={{marginTop:0,marginBottom:16,fontSize:18,color:'#2d3748'}}>KYC Information</h3>
          {kyc ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12,fontSize:14,color:'#4a5568'}}>
              <Field label="Status" value={kyc.status} />
              <Field label="Document Type" value={kyc.documentType} />
              <Field label="Document Number" value={kyc.documentNumber} />
              {(kyc.documentFrontImage || kyc.documentBackImage) && (
                <div style={{marginTop:12}}>
                  <div style={{fontSize:12,color:'#a0aec0',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>
                    Document Images
                  </div>
                  <div style={{display:'flex',gap:12}}>
                    {getImageSrc(kyc.documentFrontImage) && (
                      <img
                        src={getImageSrc(kyc.documentFrontImage) as string}
                        alt="Document front"
                        style={{width:140,height:90,objectFit:'cover',borderRadius:8,border:'1px solid #e2e8f0'}}
                      />
                    )}
                    {getImageSrc(kyc.documentBackImage) && (
                      <img
                        src={getImageSrc(kyc.documentBackImage) as string}
                        alt="Document back"
                        style={{width:140,height:90,objectFit:'cover',borderRadius:8,border:'1px solid #e2e8f0'}}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{margin:0,color:'#718096'}}>No KYC record for this user.</p>
          )}
        </div>
      </div>

      {/* Address fields removed to match current register/profile form */}
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: any; full?: boolean }) {
  return (
    <div style={{gridColumn: full ? '1 / -1' : 'auto'}}>
      <div style={{fontSize:12,color:'#a0aec0',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>
        {label}
      </div>
      <div style={{fontSize:14,color:'#2d3748'}}>
        {value || <span style={{color:'#cbd5e0'}}>—</span>}
      </div>
    </div>
  );
}
