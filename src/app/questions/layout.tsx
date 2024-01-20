import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '演習',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}