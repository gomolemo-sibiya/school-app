import React from "react";
import {
  CalendarDays,
  BookOpen,
  Bell,
  Users,
  Clock,
  FileText,
} from "lucide-react";

const features = [
  {
    title: "Appointments",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor.",
    icon: CalendarDays,
  },
  {
    title: "Timetable Management",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor.",
    icon: Clock,
  },
  {
    title: "Announcements",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor.",
    icon: Bell,
  },
  {
    title: "User Profiles",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor.",
    icon: Users,
  },
  {
    title: "Course Resources",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor.",
    icon: BookOpen,
  },
  {
    title: "Reporting",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor.",
    icon: FileText,
  },
];

const Features = () => {
  return (
    <section className="section" id="features">
      <div className="container-lg">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-900">
            Features
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card flex flex-col items-center text-center"
            >
              <div className="p-4 rounded-full bg-brand-50 mb-6">
                <feature.icon className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
