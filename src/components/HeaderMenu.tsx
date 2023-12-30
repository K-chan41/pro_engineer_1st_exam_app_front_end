'use client';

import { Modal, Group, Center, Burger, Container, Image, Text, Drawer, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import classes from './HeaderMenu.module.css';
import Link from 'next/link';
import { HeaderIcon } from './HeaderIcon';
import { AuthenticationForm } from './AuthenticationForm'
import { useAuth } from './AuthContext';

export function HeaderMenu() {
  const [opened, { open, close }] = useDisclosure(false);
  const logoSrc = 'header-logo.png';
  const logoText = '技術士1次試験 基礎•適正科目 過去問ドリル'; 

  const { auth } = useAuth();
  const currentUser = auth.user;

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <Link href="/" className={classes.headerLink}>
            <Center>
                <Image src={logoSrc} alt="Logo" h={40} />
                <Text size="lg" fw={900} className={classes.logoText}>{logoText}</Text>
            </Center>
          </Link>
          <Group gap={5} visibleFrom="sm">
            {currentUser ? (
              <HeaderIcon />
            ) : (
              <>
                <Drawer opened={opened} onClose={close} title="ログイン / 新規登録" position="right">
                  <AuthenticationForm/>
                </Drawer>
                <Button onClick={open} variant="subtle" color="gray">ログイン</Button>
              </>
            )}
          </Group>
            {currentUser ? (
              <Container size="sm" hiddenFrom="sm">
                <HeaderIcon />
              </Container>
            ):(
              <Burger opened={opened} onClick={open} size="sm" hiddenFrom="sm" />
            )}
        </div>
      </Container>
    </header>
  );
}