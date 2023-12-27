'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Image, Container, Text, rem, Tabs, Checkbox, Group, Button } from '@mantine/core';
import { ReportSearch, Ballpen } from 'tabler-icons-react';
import { convertToJapaneseEra } from '../components/utils';
import classes from './HeroBullets.module.css';
import { useRouter } from 'next/navigation';
import { Notifications, notifications } from '@mantine/notifications';

type Subject = {
  id: string;
  attributes: {
    year: number;
    exam_subject: 'basic_subject' | 'aptitude_subject';
  };
  relationships: {
    questions: {
      data: Array<{ id: string; type: string; }>;
    };
  };
};

export default function Home() {
  const [subjects, setSubjects] = useState<{ basic_subject: Subject[], aptitude_subject: Subject[] }>({
    basic_subject: [], 
    aptitude_subject: []
  });
  const topImage = 'top-image.svg';
  const iconStyle = { width: rem(12), height: rem(12) };

  useEffect(() => {
    // バックエンドから科目データを取得する
    fetch('http://localhost:4000/api/v1/subjects')
      .then(response => response.json())
      .then(data => {
        // 取得したデータから、科目ごとのチェックボックスリストを作成する
        const basic = data.data
          .filter((subject: Subject) => subject.attributes.exam_subject === 'basic_subject')
          .sort((a: Subject, b: Subject) => b.attributes.year - a.attributes.year); // 年度で降順にソート
  
        const aptitude = data.data
          .filter((subject: Subject) => subject.attributes.exam_subject === 'aptitude_subject')
          .sort((a: Subject, b: Subject) => b.attributes.year - a.attributes.year); // 年度で降順にソート
  
        setSubjects({ basic_subject: basic, aptitude_subject: aptitude });
      });
  }, []);

  const getSubjectDisplayName = (exam_subject: 'basic_subject' | 'aptitude_subject') => {
    if (exam_subject === 'basic_subject') {
      return '技術士第一次試験問題 [基礎科目] 1郡〜5郡';
    } else if (exam_subject === 'aptitude_subject') {
      return '技術士第一次試験問題 [適性科目]';
    }
    return ''; // 予期しない値の場合
  };

  // questions画面に選択したsubject_idをクレリパラメータとして送る
  const router = useRouter();
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectIds(prevSelectedIds => {
      if (prevSelectedIds.includes(subjectId)) {
        // すでに選択されている場合は削除
        return prevSelectedIds.filter(id => id !== subjectId);
      } else {
        // 選択されていない場合は追加
        return [...prevSelectedIds, subjectId];
      }
    });
  };

    //　選択中の合計問題数を計算
    const getTotalQuestions = () => {
      return selectedSubjectIds.reduce((total, id) => {
        const subject = [...subjects.basic_subject, ...subjects.aptitude_subject].find(s => s.id === id);
        return total + (subject ? subject.relationships.questions.data.length : 0);
      }, 0);
    };
    
    const totalQuestions = getTotalQuestions();

  // 選択した問題が0問だった場合に警告
  const navigateToQuestions = () => {
    if (selectedSubjectIds.length === 0) {
      notifications.show({
        title: '注意',
        message: '少なくとも一つの年度を選択してください。',
        color: 'red',
      });
      return;
    } {
    const query = selectedSubjectIds.map(id => `subject_ids[]=${id}`).join('&');
    router.push(`/questions?${query}`);
    };
  };

  return (
    <>
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Text className={classes.text} c="dimmed" mt="md" size="base">
              公益社団法人日本技術士会が年1回開催する技術士1次試験の基礎科目と適性科目の過去問対策ができるサービスです。過去問を実際に解き、解答を選択し、正解不正解を確認できます。 <br /> 解説を読むことにより、学習をすることができます。 <br /> ユーザー登録をしていただくと、問題にフラグを立てたり、間違えた問題を復習することができます。
            </Text>
          </div>
          <Image src={topImage} className={classes.image} alt="Top-image" />
        </div>
      </Container>
      <Container>
        <Tabs radius="md" defaultValue="basic_subject">
          <Tabs.List className={classes.tabs_list}>
            <Tabs.Tab value="basic_subject" leftSection={<Ballpen size={32} strokeWidth={2} color={'black'}/>}>
              基礎科目
            </Tabs.Tab>
            <Tabs.Tab value="aptitude_subject" leftSection={<ReportSearch size={32} strokeWidth={2} color={'black'}/>}>
              適正科目
            </Tabs.Tab>
          </Tabs.List>

          <Suspense fallback={<p>Loading feed...</p>}>
            <Tabs.Panel value="basic_subject" pb="lg">
              <Group className={classes.group}>
                {subjects.basic_subject.map((subject: Subject) => (
                  <Checkbox 
                    key={subject.id} 
                    label={`${convertToJapaneseEra(subject.attributes.year)}度 ${getSubjectDisplayName(subject.attributes.exam_subject)} (全${subject.relationships.questions.data.length}問)`}
                    value={subject.id} 
                    onChange={() => handleSubjectChange(subject.id)}
                  />
                ))}
              </Group>
            </Tabs.Panel>
            <Tabs.Panel value="aptitude_subject"  pb="lg">
              <Group className={classes.group}>
                {subjects.aptitude_subject.map((subject: Subject) => (
                  <Checkbox 
                    key={subject.id} 
                    label={`${convertToJapaneseEra(subject.attributes.year)}度 ${getSubjectDisplayName(subject.attributes.exam_subject)} (全${subject.relationships.questions.data.length}問)`}
                    value={subject.id} 
                    checked={selectedSubjectIds.includes(subject.id)} 
                    onChange={() => handleSubjectChange(subject.id)}
                  />
                ))}
              </Group>
            </Tabs.Panel>
          </Suspense>
        </Tabs >
        <Button fullWidth variant="filled" size="lg" color="blue" onClick={navigateToQuestions} className={classes.button}>出題開始 (合計{totalQuestions}問)</Button>
      </Container>
      <Notifications />
    </>
  );
};