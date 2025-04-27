
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const VerifyAccount = () => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { email, role, name } = location.state || {
    email: 'your email',
    role: 'user',
    name: 'User'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock user based on role
      let userData;
      if (role === 'student') {
        userData = { 
          name, 
          role: 'student',
          studentNumber: 'S' + Math.floor(10000 + Math.random() * 90000),
          faculty: 'Engineering',
          campus: 'Main Campus'
        };
      } else if (role === 'lecturer') {
        userData = { 
          name, 
          role: 'lecturer',
          staffNumber: 'L' + Math.floor(10000 + Math.random() * 90000),
          faculty: 'Engineering',
          campus: 'Main Campus'
        };
      } else {
        userData = { 
          name, 
          role: 'admin',
          staffNumber: 'A' + Math.floor(10000 + Math.random() * 90000)
        };
      }

      // Save user in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      toast({
        title: 'Account verified',
        description: 'Your account has been successfully verified.',
      });
      
      navigate('/app/dashboard');
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // For demo purposes, allow skipping verification
  const handleSkip = () => {
    let userData;
    if (role === 'student') {
      userData = { 
        name: name || 'Student User', 
        role: 'student',
        studentNumber: 'S' + Math.floor(10000 + Math.random() * 90000),
        faculty: 'Engineering',
        campus: 'Main Campus'
      };
    } else if (role === 'lecturer') {
      userData = { 
        name: name || 'Lecturer User', 
        role: 'lecturer',
        staffNumber: 'L' + Math.floor(10000 + Math.random() * 90000),
        faculty: 'Engineering',
        campus: 'Main Campus'
      };
    } else {
      userData = { 
        name: name || 'Admin User', 
        role: 'admin',
        staffNumber: 'A' + Math.floor(10000 + Math.random() * 90000)
      };
    }

    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/app/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Verify your account</h2>
        <p className="text-muted-foreground mt-2">
          We've sent a verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Input
            id="code"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="text-center text-lg py-6"
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Verifying...' : 'Verify Account'}
        </Button>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Didn't receive a code?{' '}
            <button 
              type="button" 
              className="text-brand-600 hover:text-brand-800 font-medium"
              onClick={() => toast({ title: 'Code resent', description: 'Please check your email' })}
            >
              Resend code
            </button>
          </p>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t">
        <p className="text-center text-sm text-muted-foreground">
          <button 
            type="button" 
            className="text-center text-sm text-muted-foreground"
            onClick={handleSkip}
          >
            Skip verification
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyAccount;
