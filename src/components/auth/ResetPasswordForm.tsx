import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call your backend API here
      // const response = await api.post('/auth/reset-password', { 
      //   token, 
      //   email, 
      //   password 
      // });
      
      setSuccess(true);
      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated successfully.',
      });
    } catch (error) {
      setError('Failed to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center space-y-4">
        <div className="text-2xl font-bold">Invalid Reset Link</div>
        <p className="text-muted-foreground">
          The password reset link is invalid or has expired. Please request a new one.
        </p>
        <Button onClick={() => navigate('/auth/forgot-password')} className="mt-4">
          Request New Link
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-2xl font-bold">Password Updated</div>
        <p className="text-muted-foreground">
          Your password has been successfully updated. You can now sign in with your new password.
        </p>
        <Button onClick={() => navigate('/auth/signin')} className="mt-4">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Reset Password</h2>
        <p className="text-muted-foreground mt-2">
          Enter a new password for {email}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;