'use client';

import { Container, Loader, Center } from '@mantine/core';
import classes from './Questions.module.css';

export default function Loading() {
  return (
    <Container size={700} className={classes.wrapper}>
      <Center>
        <Loader color="blue" type="dots" />
      </Center>
    </Container>
  );
}