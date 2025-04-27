
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const faculties = [
  'Engineering',
  'Science',
  'Arts & Humanities',
  'Business',
  'Law',
  'Education',
  'Information Communication and Technology'
];

const campuses = [
  'Main Campus',
  'Art Campus',
  'Science Campus',
  'Soshanguve North Campus',
  'Soshanguve South Campus'
];

const SignUpForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [studentNumber, setStudentNumber] = useState('');
  const [staffNumber, setStaffNumber] = useState('');
  const [faculty, setFaculty] = useState('');
  const [campus, setCampus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (role === 'student' && !studentNumber) {
      setError('Student number is required');
      return;
    }

    if ((role === 'lecturer' || role === 'admin') && !staffNumber) {
      setError('Staff number is required');
      return;
    }

    if ((role === 'student' || role === 'lecturer') && (!faculty || !campus)) {
      setError('Faculty and campus are required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success, show verification page
      navigate('/auth/verify', {
        state: {
          email,
          role,
          name: `${firstName} ${lastName}`
        }
      });
      
      toast({
        title: 'Registration successful',
        description: 'Please check your email for verification instructions.',
      });
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Create an account</h2>
        <p className="text-muted-foreground mt-2">Fill out the form to get started</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>I am a:</Label>
          <RadioGroup defaultValue="student" value={role} onValueChange={setRole} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="student" id="student" />
              <Label htmlFor="student">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lecturer" id="lecturer" />
              <Label htmlFor="lecturer">Lecturer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin">Administrator</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

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

        {role === 'student' && (
          <div className="space-y-2">
            <Label htmlFor="studentNumber">Student Number</Label>
            <Input
              id="studentNumber"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              required
            />
          </div>
        )}

        {(role === 'lecturer' || role === 'admin') && (
          <div className="space-y-2">
            <Label htmlFor="staffNumber">Staff Number</Label>
            <Input
              id="staffNumber"
              value={staffNumber}
              onChange={(e) => setStaffNumber(e.target.value)}
              required
            />
          </div>
        )}

        {(role === 'student' || role === 'lecturer') && (
          <>
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty</Label>
              <Select value={faculty} onValueChange={setFaculty} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campus">Campus</Label>
              <Select value={campus} onValueChange={setCampus} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a campus" />
                </SelectTrigger>
                <SelectContent>
                  {campuses.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
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
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link to="/auth/signin" className="text-brand-600 hover:text-brand-800 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
