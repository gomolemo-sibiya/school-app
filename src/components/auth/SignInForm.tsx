
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo credentials for the three roles
      if (email === 'student@example.com' && password === 'password') {
        localStorage.setItem('user', JSON.stringify({ 
          name: 'John Smith', 
          role: 'student',
          studentNumber: 'S12345',
          faculty: 'Engineering',
          campus: 'Main Campus'
        }));
        toast({
          title: 'Signed in as Student',
          description: 'Welcome back, John Smith!',
        });
        navigate('/app/appointments');
      } else if (email === 'lecturer@example.com' && password === 'password') {
        localStorage.setItem('user', JSON.stringify({ 
          name: 'Dr. Jane Doe', 
          role: 'lecturer',
          staffNumber: 'L54321',
          faculty: 'Engineering',
          campus: 'Main Campus'
        }));
        toast({
          title: 'Signed in as Lecturer',
          description: 'Welcome back, Dr. Jane Doe!',
        });
        navigate('/app/appointments');
      } else if (email === 'admin@example.com' && password === 'password') {
        localStorage.setItem('user', JSON.stringify({ 
          name: 'Admin User', 
          role: 'admin',
          staffNumber: 'A00001'
        }));
        toast({
          title: 'Signed in as Administrator',
          description: 'Welcome back, Admin User!',
        });
        navigate('/app/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Welcome back</h2>
        <p className="text-muted-foreground mt-2">Sign in to continue to School App</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              to="/auth/forgot-password" 
              className="text-sm text-brand-600 hover:text-brand-800"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-brand-600 hover:text-brand-800 font-medium">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t text-sm text-muted-foreground">
        <p className="text-center">Demo credentials (for testing):</p>
        <ul className="mt-2 space-y-1">
          <li>Student: student@example.com / password</li>
          <li>Lecturer: lecturer@example.com / password</li>
          <li>Admin: admin@example.com / password</li>
        </ul>
      </div>
    </div>
  );
};

export default SignInForm;