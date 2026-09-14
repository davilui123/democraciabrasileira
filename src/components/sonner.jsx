import React from 'react';
import { Toaster as Sonner } from 'sonner';

const Toaster = (props) => (
  <Sonner
    theme="dark"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast: 'group toast group-[.toaster]:bg-card group-[.toaster]:text-text group-[.toaster]:border-border group-[.toaster]:shadow-elevation-4',
        description: 'group-[.toast]:text-muted',
        actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-white',
        cancelButton: 'group-[.toast]:bg-panel group-[.toast]:text-muted',
      },
    }}
    {...props}
  />
);

export { Toaster };
export { toast } from 'sonner';
