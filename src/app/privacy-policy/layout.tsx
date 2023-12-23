import { Container } from '@mantine/core';
import classes from './layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container size={700} className={classes.wrapper}>
        <article className="prose prose-xl">{children}</article>
      </Container>
    </>
  );
}