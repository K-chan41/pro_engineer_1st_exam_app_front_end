'use client';

import { Image, Text, Container, Title, SimpleGrid, Button, Slider, Center } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Notifications, notifications } from '@mantine/notifications';
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import classes from './Questions.module.css';

interface QuestionAttributes {
  number: number;
  content: string;
  question_img_src: string | null;
  correct_answer_no: number;
  commentary: string;
  answer_img_src: string | null;
}

interface Question {
  id: string;
  type: string;
  attributes: QuestionAttributes;
  relationships: {
    subject: {
      data: {
        id: string;
        type: string;
      };
    };
    label: {
      data: {
        id: string;
        type: string;
      };
    };
    choices: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
  };
}

interface ChoiceAttributes {
  content: string;
  order: number;
}

interface Choice {
  id: string;
  type: string;
  attributes: ChoiceAttributes;
  relationships: {
    question: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

interface LabelAttributes {
  number: number;
  title: string;
}

interface Label {
  id: string;
  type: string;
  attributes: LabelAttributes;
  relationships: {
    questions: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
  };
}

interface SubjectAttributes {
  year: number;
  exam_subject: string;
}

interface Subject {
  id: string;
  type: string;
  attributes: SubjectAttributes;
  relationships: {
    questions: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
  };
}

interface LabelAttributes {
  number: number;
  title: string;
}

interface Label {
  id: string;
  type: string;
  attributes: LabelAttributes;
  relationships: {
    questions: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
  };
}

interface ApiResponse {
  data: Array<Question | Choice | Label>;
}

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);

  const [userAnswers, setUserAnswers] = useState({}); // ユーザーの解答を管理するための状態
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 現在の問題のインデックス

  useEffect(() => {
    const subjectIds = searchParams.getAll('subject_ids[]');
    // console.log(subjectIds);

    if (subjectIds) {
      const query = Array.isArray(subjectIds)
        ? subjectIds.map(id => `subject_ids[]=${id}`).join('&')
        : `subject_ids[]=${subjectIds}`;

      fetch(`http://localhost:4000/api/v1/questions/filter?${query}`)
        .then(response => response.json())
        .then((responseData: ApiResponse) => {
          const fetchedQuestions = responseData.data.filter(item => item.type === 'question') as Question[];
          const fetchedChoices = responseData.included.filter(item => item.type === 'choice') as Choice[];
          const fetchedSubjects = responseData.included.filter(item => item.type === 'subject') as Subject[];
          const fetchedLabels = responseData.included.filter(item => item.type === 'label') as Label[];

          setQuestions(fetchedQuestions);
          setChoices(fetchedChoices);
          setSubjects(fetchedSubjects);
          setLabels(fetchedLabels);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [searchParams]);

  // 解答を保存する関数
  function handleAnswer(choiceId, questionId) {
    const isCorrect = questions[currentQuestionIndex].attributes.correct_answer_no == choiceId;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        choiceId: choiceId,  // ユーザーが選んだ選択肢のID
        isCorrect: isCorrect // 選んだ選択肢が正解かどうかの真偽値
      }
    }));

    // アニメーション表示のためのロジックをここに記述
    if(isCorrect){
      notifications.show({
        id: questionId,
        autoClose: 1000,
        title: "正解!",
        message: 'いい調子!',
        icon: <CiCircleCheck />,
        className: 'my-notification-class',
        loading: false,
      });
    } else {
      notifications.show({
        id: questionId,
        autoClose: 1000,
        title: "不正解",
        message: '残念!',
        icon: <CiCircleRemove />,
        color: 'red',
        className: 'my-notification-class',
        loading: false,
      });
    }

    // 自動的に次の問題に遷移するか、ユーザーが「次へ」をクリックするまで待つ
  }

  // 現在の問題を表示する
  const currentQuestion = questions[currentQuestionIndex];
  const currentSubject = currentQuestion ? subjects.find(s => s.id === currentQuestion.relationships.subject.data.id) : null;
  const currentLabel = currentQuestion ? labels.find(s => s.id === currentQuestion.relationships.label.data.id) : null;

  return (
    <>
      {currentQuestion && (
        <Container size={700} className={classes.wrapper} id={currentQuestion.id}>
            <Text c="dimmed" ta="center">{questions.length}問中0問正解 正解率: 0%</Text>
          <Center>
            <Slider defaultValue={60} size="xs" disabled className={classes.customSlider}/>
          </Center>
            <Text className={classes.supTitle}>第{currentQuestionIndex + 1}問</Text>

          <Container size={660} p={0}>
            <Text c="dimmed" className={classes.description}>{currentQuestion.attributes.content}</Text>
          </Container>

          <Container size={660} p={0}>
            <SimpleGrid cols={1} spacing={0} className={classes.choice}>
              {currentQuestion.relationships.choices.data.map((choiceRelation, index) => {
                const choice = choices.find(c => c.id === choiceRelation.id);
                return (
                  <Text key={choice.id} c="dimmed">
                    <span className={classes.indexColor}>{index + 1}.  </span>  {choice.attributes.content}
                  </Text>
                );
              })}
            </SimpleGrid>
          </Container>

          <Container size={660} p={0} className={classes.detailContainer}>
            {currentSubject && (
              <Text c="dimmed" ta="right" className={classes.detail} key={currentSubject.id}>技術士 第一次試験 令和4年度 基礎科目{currentSubject.attributes.year} {currentSubject.attributes.exam_subject}</Text>
            )}
            {currentLabel && (
              <Text c="dimmed" ta="right" className={classes.detail} key={currentLabel.id}>「設計・計画に関するもの」 I-1-1{currentLabel.attributes.number} {currentLabel.attributes.title}</Text>
            )}
            <Text c="dimmed" ta="right" className={classes.detail}>第1問目/選択問題数全30問</Text>
          </Container>

          <Container size={660} p={0} className={classes.buttonContainer}>
            <SimpleGrid cols={5}>
              {currentQuestion.relationships.choices.data.map((choiceRelation, index) => {
                const choice = choices.find(c => c.id === choiceRelation.id);
                return (
                  <Button
                    key={choice.id}
                    variant="outline"
                    size="compact-xl"
                    onClick={() => handleAnswer(choice.id, currentQuestion.id)}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </SimpleGrid>
          </Container>
          <Button fullWidth variant="filled" size="xl" color="MantineColor">Full width button</Button>
          <Notifications containerWidth={800} notificationMaxHeight={800} position="top-center" />
        </Container>
      )}
    </>
  );
}