
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 border-b sticky top-0 bg-background z-50">
      <div className="container-lg flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="font-display font-bold text-2xl text-brand-600">School App</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="nav-link">Home</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/auth/signup">Get Started</Link>
          </Button>
        </div>

        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-background z-40 md:hidden transition-all duration-300 pt-16",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container-lg flex flex-col gap-6 p-4">
          <Link 
            to="/" 
            className="nav-link text-lg py-3 border-b"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <div className="flex flex-col gap-4 mt-4">
            <Button variant="outline" asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
              <Link to="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
              <Link to="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
