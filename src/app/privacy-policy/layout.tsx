import { Container } from '@mantine/core';
import classes from './layout.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container size={700} className={classes.wrapper}>
        <article className="prose-sm">{children}</article>
      </Container>
    </>
  );
}