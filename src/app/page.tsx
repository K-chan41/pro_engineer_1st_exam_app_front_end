'use client';

import { useState, useEffect } from 'react';
import { Image, Container, Text, rem, Tabs, Checkbox, Group } from '@mantine/core';
import { ReportSearch, Ballpen } from 'tabler-icons-react';
import classes from './HeroBullets.module.css';

export default function Home() {
  const [subjects, setSubjects] = useState({ basic_subject: [], aptitude_subject: [] });
  const topImage = 'top-image.svg';
  const iconStyle = { width: rem(12), height: rem(12) };

  useEffect(() => {
    // バックエンドから科目データを取得する
    fetch('http://localhost:4000/api/v1/subjects')
      .then(response => response.json())
      .then(data => {
        // 取得したデータから、科目ごとのチェックボックスリストを作成する
        const basic = data.data.filter(subject => subject.attributes.exam_subject === 'basic_subject');
        const aptitude = data.data.filter(subject => subject.attributes.exam_subject === 'aptitude_subject');
        setSubjects({ basic_subject: basic, aptitude_subject: aptitude });
      });
  }, []);


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
      <Container>
        <Tabs radius="md" defaultValue="basic_subject">
          <Tabs.List>
            <Tabs.Tab value="basic_subject" leftSection={<Ballpen size={32} strokeWidth={2} color={'black'}/>}>
              基礎科目
            </Tabs.Tab>
            <Tabs.Tab value="aptitude_subject" leftSection={<ReportSearch size={32} strokeWidth={2} color={'black'}/>}>
              適正科目
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="basic_subject">
            <Group direction={"column"}>
              {subjects.basic_subject.map((subject, index) => (
                <Checkbox 
                  key={subject.id} 
                  label={`${subject.attributes.year}年 ${subject.attributes.exam_subject}`} 
                  value={subject.id}
                />
              ))}
            </Group>
          </Tabs.Panel>
          <Tabs.Panel value="aptitude_subject"  pb="xs">
            <Group direction="column">
              {subjects.aptitude_subject.map((subject, index) => (
                <Checkbox 
                  key={subject.id} 
                  label={`${subject.attributes.year}年 ${subject.attributes.exam_subject}`} 
                  value={subject.id}
                />
              ))}
            </Group>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </>
  )
}