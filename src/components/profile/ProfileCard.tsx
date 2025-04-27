
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/types/profile';

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-2">
        <h2 className="text-2xl font-bold">{profile.name}</h2>
        <p className="text-muted-foreground capitalize">{profile.role}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label>ID Number</Label>
          <p className="text-sm">{profile.identificationNumber}</p>
        </div>
        <div className="grid gap-2">
          <Label>Faculty</Label>
          <p className="text-sm">{profile.faculty}</p>
        </div>
        <div className="grid gap-2">
          <Label>Email</Label>
          <p className="text-sm">{profile.email}</p>
        </div>
        {profile.modules && (
          <div className="grid gap-2">
            <Label>Modules</Label>
            <div className="flex flex-wrap gap-2">
              {profile.modules.map((module) => (
                <span
                  key={module}
                  className="px-2 py-1 text-xs bg-secondary rounded-md"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
