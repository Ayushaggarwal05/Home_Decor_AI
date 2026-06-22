import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6 flex-1 flex flex-col", className)}>
      {children}
    </div>
  );
}
