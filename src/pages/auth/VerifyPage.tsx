
import React from 'react';
import { Link } from 'react-router-dom';
import VerifyAccount from '@/components/auth/VerifyAccount';

const VerifyPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <div className="container-lg py-8">
        <div className="mb-8">
          <Link to="/" className="text-brand-600 font-display font-bold text-2xl">
            School App
          </Link>
        </div>

        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-card">
          <VerifyAccount />
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
