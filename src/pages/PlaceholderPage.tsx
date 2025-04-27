
import React from 'react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="bg-brand-50 border border-brand-200 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          This page is under construction. The {title.toLowerCase()} functionality will be implemented soon.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
