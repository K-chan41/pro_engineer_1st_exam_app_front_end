'use client';

import { Anchor, Group, Image, Text, Center, ActionIcon, rem } from '@mantine/core';
import { IconBrandX, IconBrandGithub, IconCurrencyQuetzal } from '@tabler/icons-react';
import classes from './Footer.module.css';

const links = [
  { link: '/rules', label: '利用規約' },
  { link: '/privacy-policy', label: 'プライバシーポリシー' },
  { link: '/contact', label: 'お問い合わせ' },
];

export function Footer() {
  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      key={link.label}
      href={link.link}
      lh={1}
      // onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <div>
          <Group>
            <Image src='header-logo.png' alt="Logo" h={30} />
            <Text size="md" fw={900} className={classes.logoText}>技術士1次試験 基礎•適性科目 過去問ドリル</Text>
          </Group>
          <Center>
            <Text c="dimmed" size="xs">
              © 2024 proengineer1exam.com All rights reserved.
            </Text>
          </Center>
        </div>

        <Group className={classes.links}>{items}</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <Anchor href="https://twitter.com/mimi048599" target="_blank">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandX style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Anchor>
          <Anchor href="https://github.com/K-chan41" target="_blank">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandGithub style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Anchor>
          <Anchor href="https://qiita.com/K-Chan41" target="_blank">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconCurrencyQuetzal style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Anchor>
        </Group>
      </div>
    </div>
  );
}