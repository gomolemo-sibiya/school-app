
import React, { useEffect, useState } from 'react';
import ProfileCard from '@/components/profile/ProfileCard';
import { UserProfile } from '@/types/profile';

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // In a real app, we would fetch this from an API
      // For now, we'll create a mock profile from localStorage data
      const mockProfile: UserProfile = {
        id: user.id || '1',
        name: user.name || 'John Doe',
        role: user.role || 'student',
        faculty: user.faculty || 'Computer Science',
        identificationNumber: user.role === 'student' ? '123456789' : '12345',
        email: user.email || 'user@example.com',
        modules: ['ISY23AT', 'SFG117V', 'HMD124C'],
      };
      setProfile(mockProfile);
    }
  }, []);

  if (!profile) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <ProfileCard profile={profile} />
    </div>
  );
};

export default ProfilePage;
