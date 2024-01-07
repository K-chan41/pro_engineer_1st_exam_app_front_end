'use client';

import { Text, Container, Divider, Button, Center, Table } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Notifications, notifications } from '@mantine/notifications';
import classes from './MyPage.module.css';

interface UserQuestionRelation {
  questionId: number;
  questionUpdatedAt: string;
  questionContent: string;
  userAnswer: string;
  correctAnswer: number;
}

interface QuestionData {
  id: string;
  attributes: {
    question_id: number;
    updated_at: string;
    answer: string;
  };
  relationships: {
    question: {
      data: {
        id: string;
      };
    };
  };
}

interface ApiResponse {
  data: QuestionData[];
  included: Question[];
}

interface Question {
  id: string;
  attributes: {
    content: string;
    correct_answer_no: number;
  };
}

interface Flag {
  flagId: number;
  userId: number;
  questionId: number;
  flagCreatedAt: string;
  questionContent: string;
  correctAnswerNo: number;
}

interface FlagApiResponse {
  data: {
    attributes: {
      id: number;
      user_id: number;
      question_id: number;
      created_at: string;
    };
    relationships: {
      question: {
        data: {
          id: string;
        };
      };
    };
  }[];
  included: {
    id: string;
    attributes: {
      content: string;
      correct_answer_no: number;
    };
  }[];
}

export default function MyPage() {
  const [userQuestionRelations, setUserQuestionRelations] = useState<UserQuestionRelation[]>([]);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchedToken = localStorage.getItem('token');
    setToken(fetchedToken);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const fetchUserQuestionRelationInfo = async (token: string) => {
      if (fetchedToken) {
        try {
          const response = await fetch(`http://localhost:4000/api/v1/user_question_relations`, {
            method: 'GET',
            headers: headers,
          });
          const data = await response.json();
          // データを整形、間違えた問題だけをフィルタリング
          const filteredData = data.data.map((item: QuestionData) => {
            const question = data.included.find((q: Question) => q.id === item.relationships.question.data.id);
            return {
              questionId: item.attributes.question_id,
              questionUpdatedAt: item.attributes.updated_at,
              questionContent: question.attributes.content,
              userAnswer: item.attributes.answer,
              correctAnswer: question.attributes.correct_answer_no
            };
          }).filter((relation: UserQuestionRelation) => parseInt(relation.userAnswer) !== relation.correctAnswer);
          setUserQuestionRelations(filteredData);
        } catch (error) {
          console.error('Error fetching user question info:', error);
        }
      }
    };

    const fetchFlags = async (token: string) => {
      if (fetchedToken) {
        try {
          const response = await fetch(`http://localhost:4000/api/v1/flags`, {
            method: 'GET',
            headers: headers,
          });
          const data: FlagApiResponse = await response.json();
          // フラグデータを整形
          const formattedFlags = data.data.map((flag) => {
            const question = data.included.find(q => q.id === flag.relationships.question.data.id);
            return {
              flagId: flag.attributes.id,
              userId: flag.attributes.user_id,
              questionId: flag.attributes.question_id,
              flagCreatedAt: flag.attributes.created_at,
              questionContent: question?.attributes.content ?? '',
              correctAnswerNo: question?.attributes.correct_answer_no ?? 0
            };
          });
          setFlags(formattedFlags); 
        } catch (error) {
          console.error('Error fetching flags:', error);
        }
      }
    };

    if (fetchedToken) {
      fetchUserQuestionRelationInfo(fetchedToken);
      fetchFlags(fetchedToken);
    }
  }, [token]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // 日付と時間をローカルの形式で表示
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const incorrectRows = userQuestionRelations.map(relation => (
    <Table.Tr key={relation.questionId}>
      <Table.Td>{formatDate(relation.questionUpdatedAt)}</Table.Td>
      <Table.Td c="dimmed">{`${relation.questionContent.substring(0, 30)}...`}</Table.Td>
      <Table.Td>{relation.userAnswer}</Table.Td>
      <Table.Td>{relation.correctAnswer}</Table.Td>
    </Table.Tr>
  ));

  const flagRows = flags.map(flag => (
    <Table.Tr key={flag.questionId}>
      <Table.Td>{formatDate(flag.flagCreatedAt)}</Table.Td>
      <Table.Td c="dimmed">{`${flag.questionContent.substring(0, 30)}...`}</Table.Td>
      <Table.Td>{flag.correctAnswerNo}</Table.Td>
    </Table.Tr>
  ));

  const navigateToRandomQuestions = (): void => {
    if (!token) {
      notifications.show({
        title: '注意',
        message: 'ログインが必要です！',
        color: 'red',
      });
      return;
    } {
    router.push(`/questions?shuffle`);
    };
  };

  const navigateToRecentMistakes = (): void => {
    if (!token) {
      notifications.show({
        title: '注意',
        message: 'ログインが必要です！',
        color: 'red',
      });
      return;
    } {
    router.push(`/questions?recent_mistakes`);
    };
  };

  return (
    <>
      <Notifications containerWidth={800} notificationMaxHeight={800} position="top-center" />
      {token ? (
        <div>
          <Container size={700} className={classes.wrapper}>
            <Text ta="center" size="xl" fw={900} className={classes.title}>マイページ</Text>
            <Text c="dimmed" ta="center">ランダムに出題</Text>
            <Center>
              <Divider color="gray" size="xs" className={classes.underline}/>
            </Center>
            <Text ta="center">収録されている過去問からランダムに出題します</Text>
            <Button fullWidth variant="filled" size="sm" color="blue" className={classes.button} onClick={navigateToRandomQuestions}>テストする（10問）</Button>
            <Text c="dimmed" ta="center">最近間違えた問題</Text>
            <Center>
              <Divider color="gray" size="xs" className={classes.underline}/>
            </Center>
            <Text ta="center">最近間違えた過去問を出題します</Text>
            <Container size={660} p={0} className={classes.table}>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>日付</Table.Th>
                    <Table.Th>詳細</Table.Th>
                    <Table.Th>解答</Table.Th>
                    <Table.Th>正解</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{incorrectRows}</Table.Tbody>
              </Table>
            </Container>
            <Button fullWidth variant="filled" size="sm" color="blue" className={classes.button} onClick={navigateToRecentMistakes}>間違えた問題をテストする（10問）</Button>
            <Text c="dimmed" ta="center">最近フラグした問題</Text>
            <Center>
              <Divider color="gray" size="xs" className={classes.underline}/>
            </Center>
            <Text ta="center">最近フラグした問題を出題します</Text>
            <Container size={660} p={0} className={classes.table}>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>日付</Table.Th>
                    <Table.Th>詳細</Table.Th>
                    <Table.Th>正解</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{flagRows}</Table.Tbody>
              </Table>
            </Container>
          </Container>
        </div>
      ) : (
        <div>
          <Container size={700} className={classes.wrapper}>
            <Text>ログインが必要です</Text>
          </Container>
        </div>
      )}
    </>
  );
};