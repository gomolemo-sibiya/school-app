
import React, { useState, useEffect } from 'react';
import TimetableViewer from '@/components/timetable/TimetableViewer';
import { getFaculties } from '@/services/timetableService';

const TimetablePage = () => {
  const [userFaculty, setUserFaculty] = useState<string>('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const faculty = user.faculty || 'Computer Science';
      setUserFaculty(faculty);
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Timetable</h1>
        <div className="text-muted-foreground">
          Faculty: {userFaculty}
        </div>
      </div>
      
      {userFaculty ? (
        <TimetableViewer faculty={userFaculty} />
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          Loading timetable...
        </div>
      )}
    </div>
  );
};

export default TimetablePage;
