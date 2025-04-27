
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  linkTo?: string;
  linkText?: string;
  className?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
}

const DashboardCard = ({
  title,
  value,
  description,
  icon,
  linkTo,
  linkText = 'View details',
  className,
  trend,
}: DashboardCardProps) => {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-yellow-600',
  }[trend?.direction || 'neutral'];

  const trendIcon = {
    up: '↑',
    down: '↓',
    neutral: '→',
  }[trend?.direction || 'neutral'];

  return (
    <Card className={cn('shadow-card hover:shadow-feature transition-all', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && <div className="text-brand-600">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <div className="text-3xl font-bold">{value}</div>
          {trend && (
            <div className={`ml-2 text-sm ${trendColor}`}>
              {trendIcon} {trend.value}
            </div>
          )}
        </div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </CardContent>
      {linkTo && (
        <CardFooter>
          <Button variant="link" asChild className="p-0 h-auto">
            <Link to={linkTo} className="flex items-center text-brand-600">
              {linkText}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DashboardCard;
