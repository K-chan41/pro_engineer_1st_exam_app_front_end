'use client';

import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem, Tabs } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import { ReportSearch, Ballpen } from 'tabler-icons-react';
import classes from './HeroBullets.module.css';

export default function Home() {
  const topImage = 'top-image.svg';
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <>
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Text className={classes.text} c="dimmed" mt="md" size="base">
              公益社団法人日本技術士会が年1回開催する技術士1次試験の基礎科目と適性科目の過去問対策ができるサービスです。過去問を実際に解き、解答を選択し、正解不正解を確認できます。 <br /> 解説を読むことにより、学習をすることができます。 <br /> ユーザー登録をしていただくと、問題にフラグを立てたり、間違えた問題を復習することができます。
            </Text>
          </div>
          <Image src={topImage} className={classes.image} />
        </div>
      </Container>
      <Ballpen
    size={48}
    strokeWidth={2}
    color={'black'}
  />;
<ReportSearch
    size={48}
    strokeWidth={2}
    color={'black'}
  />;
      <Container>
        <Tabs radius="md" defaultValue="gallery">
          <Tabs.List>
            <Tabs.Tab value="gallery" leftSection={<IconPhoto style={iconStyle} />}>
              Gallery
            </Tabs.Tab>
            <Tabs.Tab value="messages" leftSection={<IconMessageCircle style={iconStyle} />}>
              Messages
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IconSettings style={iconStyle} />}>
              Settings
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="gallery">
            Gallery tab content
          </Tabs.Panel>

          <Tabs.Panel value="messages">
            Messages tab content
          </Tabs.Panel>

          <Tabs.Panel value="settings">
            Settings tab content
          </Tabs.Panel>
        </Tabs>
      </Container>
    </>
  )
}