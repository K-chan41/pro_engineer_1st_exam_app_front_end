'use client';

import { Menu, Group, Center, Burger, Container, Image, Text, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import classes from './HeaderMenu.module.css';
import Link from 'next/link';
import { HeaderIcon } from './HeaderIcon';

export function HeaderMenu() {
  const [opened, { open, close }] = useDisclosure(false);
  const logoSrc = 'header-logo.png';
  const logoText = '技術士1次試験 基礎•適正科目 過去問ドリル'; 

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
            <Link key='/register' href='/register' className={classes.link}>
              新規登録
            </Link>
            <Link key='/login' href='/login' className={classes.link}>
              ログイン
            </Link>
            <HeaderIcon />
          </Group>
            <Burger opened={opened} onClick={open} size="sm" hiddenFrom="sm" />
            <Drawer offset={8} radius="md" opened={opened} onClose={close} title="Authentication" position="top" size="18%">
              <Link key='/register' href='/register' className={classes.link}>
                新規登録
              </Link>
              <Link key='/login' href='/login' className={classes.link}>
                ログイン
              </Link>
            </Drawer>
        </div>
      </Container>
    </header>
  );
}