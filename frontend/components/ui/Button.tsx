import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer",
        
        // Variants
        variant === 'primary' && "bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 text-white shadow-lg",
        variant === 'secondary' && "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20",
        variant === 'outline' && "bg-transparent hover:bg-muted/40 text-foreground border border-border",
        variant === 'ghost' && "bg-transparent hover:bg-muted/30 text-muted-foreground hover:text-foreground",
        variant === 'destructive' && "bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20",

        // Sizes
        size === 'sm' && "px-3 py-1.5 text-[10px]",
        size === 'md' && "px-4 py-2.5 text-xs",
        size === 'lg' && "px-6 py-3.5 text-sm",

        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
