import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Simulate API call to send reset password email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call your backend API here
      // const response = await api.post('/auth/forgot-password', { email });
      
      setSuccess(true);
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for instructions to reset your password.',
      });
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-2xl font-bold">Check your email</div>
        <p className="text-muted-foreground">
          We've sent a password reset link to {email}. If you don't see it, check your spam folder.
        </p>
        <Button onClick={() => navigate('/auth/signin')} className="mt-4">
          Return to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Forgot Password</h2>
        <p className="text-muted-foreground mt-2">
          Enter your email to receive a password reset link
        </p>
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
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Remember your password?{' '}
          <Link to="/auth/signin" className="text-brand-600 hover:text-brand-800 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;