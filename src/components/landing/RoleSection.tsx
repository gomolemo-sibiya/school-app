
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const roles = [
  {
    title: 'For Students',
    description: 'Access class schedules, book appointments with lecturers, and stay updated with important announcements.',
    benefits: [
      'View your personalized timetable',
      'Book appointments with lecturers',
      'Receive real-time notifications',
      'Access course resources',
      'Submit and track issue reports',
    ],
    color: 'bg-gradient-to-br from-brand-50 to-brand-100',
    image: 'https://unsplash.com/photos/closeup-photo-of-turned-on-blue-and-white-laptop-computer-iIJrUoeRoCQ'
  },
  {
    title: 'For Lecturers',
    description: 'Manage appointments, create announcements, and engage with students more effectively.',
    benefits: [
      'Manage student appointment requests',
      'Create and publish announcements',
      'View and update class schedules',
      'Track student engagement',
      'Respond to student queries efficiently',
    ],
    color: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    image: 'https://unsplash.com/photos/woman-and-man-sitting-in-front-of-monitor-IgUR1iX0mqM'
  },
  {
    title: 'For Administrators',
    description: 'Gain insights through analytics, manage user access, and oversee the entire platform.',
    benefits: [
      'Access comprehensive analytics dashboard',
      'Manage user roles and permissions',
      'Generate and export reports',
      'Monitor platform performance',
      'Review and address submitted issues',
    ],
    color: 'bg-gradient-to-br from-purple-50 to-purple-100',
    image: 'https://unsplash.com/photos/gray-satellite-disc-on-field-Wj1D-qiOseE'
  }
];

const RoleSection = () => {
  return (
    <section className="section bg-brand-50">
      <div className="container-lg">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-900">Tailored for Everyone</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {roles.map((role, index) => (
            <div 
              key={index}
              className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={index % 2 !== 0 ? 'md:order-2' : ''}>
                <Badge variant="outline" className="mb-4 text-brand-600 border-brand-200 bg-brand-50">
                  {role.title}
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{role.description}</h3>
                
                <ul className="space-y-3 mt-6">
                  {role.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-brand-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={`${index % 2 !== 0 ? 'md:order-1' : ''} flex justify-center`}>
                <div className={`relative rounded-2xl overflow-hidden shadow-feature w-full max-w-md h-64 md:h-80 ${role.color}`}>
                  <img 
                    src={role.image}
                    alt={role.title}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h4 className="text-white font-bold text-2xl">{role.title}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleSection;
