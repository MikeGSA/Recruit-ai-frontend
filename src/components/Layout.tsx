import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">{children}</main>
    </div>
  );
}
