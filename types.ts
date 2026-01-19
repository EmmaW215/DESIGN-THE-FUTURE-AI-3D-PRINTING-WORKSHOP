import React from 'react';

export interface Level {
  id: number;
  title: string;
  name: string;
  price: string;
  description: string;
  project: string;
  // Use React.ReactNode for components/elements used as icons
  icon: React.ReactNode;
  color: string;
}

export interface Feature {
  title: string;
  description: string;
  // Use React.ReactNode to fix the JSX namespace error in .ts files
  icon: React.ReactNode;
}
