import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero-section bg-gradient-to-b from-brand-50 to-background">
      <div className="container-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-brand-900 mb-6">
              <span className="text-brand-600">Connect</span>, Learn, and Thrive
              Together
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="btn-pill group" asChild>
                <Link to="/auth/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="btn-pill" asChild>
                <Link to="/">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="lg:order-last order-first flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
              <div className="absolute -bottom-8 right-4 w-72 h-72 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Students using the ScholarNexus platform"
                className="relative z-10 rounded-2xl shadow-feature object-cover w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
