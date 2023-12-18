'use client';

import { Image, Text, Container, Title, SimpleGrid, Button, Progress, Center, Group } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Notifications, notifications } from '@mantine/notifications';
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { convertToJapaneseEra } from '../../components/utils';
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

const getSubjectDisplayName = (exam_subject: 'basic_subject' | 'aptitude_subject') => {
  if (exam_subject === 'basic_subject') {
    return '基礎科目';
  } else if (exam_subject === 'aptitude_subject') {
    return '適性科目';
  }
  return ''; // 予期しない値の場合
};

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);

  const [userAnswers, setUserAnswers] = useState({}); // ユーザーの解答を管理するための状態
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 現在の問題のインデックス
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0); //　正当数カウント

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

  // 解答を保存して解説に遷移する関数
  function handleAnswer(choiceId, choicedIndex, questionId) {
    const isCorrect = questions[currentQuestionIndex].attributes.correct_answer_no == choicedIndex;

    // すでに解答されているかどうかをチェック
    const alreadyAnswered = userAnswers[questionId]?.answered;

    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        choiceId: choiceId,  // ユーザーが選んだ選択肢のID
        choicedIndex: choicedIndex, // ユーザが選んだ選択肢のIndex番号:1~5
        isCorrect: isCorrect, // 選んだ選択肢が正解かどうかの真偽値
        answered: true  // 解答済みを示す
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

    // 正解かつ初めての解答の場合にカウント
    if (!alreadyAnswered && isCorrect) {
      setCorrectAnswersCount(prevCount => prevCount + 1);
    }

    // 解答解説へ遷移する
    setIsQuestionScreen(false);
  }

  // 問題画面に戻る関数
  function backToQusetion(){
    setIsQuestionScreen(ture);
  }

  // 次の問題画面へ
  function goToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      // まだ未解答の問題がある場合は次の問題へ
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setIsQuestionScreen(true);
    } else {
      // すべての問題に解答し終えた場合の処理
      // 例: 結果画面に遷移する、結果メッセージを表示するなど
      handleFinish();
    }
  }
  
  function handleFinish() {
    // 結果処理のロジック
    // 例: スコアの計算、結果画面への遷移、通知の表示など
  }
  

  // 現在の問題を表示する
  const currentQuestion = questions[currentQuestionIndex];
  const currentSubject = currentQuestion ? subjects.find(s => s.id === currentQuestion.relationships.subject.data.id) : null;
  const currentLabel = currentQuestion ? labels.find(s => s.id === currentQuestion.relationships.label.data.id) : null;

  // 問題と解答の画面切り替え
  const [isQuestionScreen, setIsQuestionScreen] = useState(true);

  return (
    <>
      <Notifications containerWidth={800} notificationMaxHeight={800} position="top-center" />
      {isQuestionScreen ? (
        <div>
          {currentQuestion && (
            <Container size={700} className={classes.wrapper} id={currentQuestion.id}>
                <Text c="dimmed" ta="center">{questions.length}問中{correctAnswersCount}問正解 正解率: {(correctAnswersCount / questions.length * 100).toFixed(1)}%</Text>
              <Center>
                <Progress color="gray" radius="md" size="xs" value={Math.round(correctAnswersCount / questions.length * 100)} animated className={classes.customProgress}/>
              </Center>
                <Text className={classes.supTitle}>第{currentQuestionIndex + 1}問</Text>

              <Container size={660} p={0}>
                <Text c="dimmed" className={classes.description}>{currentQuestion.attributes.content}</Text>
              </Container>

              <Container size={660} p={0}>
                {currentQuestion.attributes.content.question_img_src && 
                  <Image
                    src={`http://localhost:4000/images/questions/${currentQuestion.attributes.content.question_img_src}.png`}
                    alt={`${convertToJapaneseEra(currentSubject.attributes.year)}度 技術士 第一次試験 ${currentSubject.attributes.exam_subject == "basic_subject" && "Ⅰ"}${currentSubject.attributes.exam_subject == "aptitude_subject" && "Ⅱ"}-${currentLabel.attributes.number}-${currentQuestion.attributes.number}`}
                  />
                }
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
                  <Text c="dimmed" ta="right" className={classes.detail} key={currentSubject.id}>{convertToJapaneseEra(currentSubject.attributes.year)}度 技術士 第一次試験 {getSubjectDisplayName(currentSubject.attributes.exam_subject)}</Text>
                )}
                {currentLabel && (
                  <Text c="dimmed" ta="right" className={classes.detail} key={currentLabel.id}>「{currentLabel.attributes.title}」{currentSubject.attributes.exam_subject == "basic_subject" && "Ⅰ"}{currentSubject.attributes.exam_subject == "aptitude_subject" && "Ⅱ"}-{currentLabel.attributes.number}-{currentQuestion.attributes.number}</Text>
                )}
                <Text c="dimmed" ta="right" className={classes.detail}>第{currentQuestionIndex + 1}問目/選択問題数 全{questions.length}問</Text>
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
                        onClick={() => handleAnswer(choice.id, index + 1, currentQuestion.id)}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </SimpleGrid>
              </Container>
              <Button fullWidth variant="filled" size="lg" color="blue" onClick={() => setIsQuestionScreen(false)}>解答解説を見る</Button>
            </Container>
          )}
        </div>
        ) : (
        <div>
          {currentQuestion && (
            <Container size={700} className={classes.wrapper} id={currentQuestion.id}>
                <Text c="dimmed" ta="center">{questions.length}問中{correctAnswersCount}問正解 正解率: {(correctAnswersCount / questions.length * 100).toFixed(1)}%</Text>
              <Center>
                <Progress color="gray" radius="md" size="xs" value={Math.round(correctAnswersCount / questions.length * 100)} animated className={classes.customProgress}/>
              </Center>
              <Group justify="space-between">
                <div>
                  <Text className={classes.supTitle}>正解</Text>
                  <Text className={classes.correctAnswere}>{currentQuestion.attributes.correct_answer_no}</Text>
                  <Text c="dimmed" className={classes.description}>あなたの解答：{userAnswers[currentQuestion.id] ? userAnswers[currentQuestion.id].choicedIndex : "未解答"}</Text>
                </div>
                <Button onClick={() => setIsQuestionScreen(true)} variant="default">問題</Button>
              </Group>
              <Container size={660} p={0} className={classes.detailContainer}>
                {currentSubject && (
                  <Text c="dimmed" ta="right" className={classes.detail} key={currentSubject.id}>{convertToJapaneseEra(currentSubject.attributes.year)}度 技術士 第一次試験 {getSubjectDisplayName(currentSubject.attributes.exam_subject)}</Text>
                )}
                {currentLabel && (
                  <Text c="dimmed" ta="right" className={classes.detail} key={currentLabel.id}>「{currentLabel.attributes.title}」{currentSubject.attributes.exam_subject == "basic_subject" && "Ⅰ"}{currentSubject.attributes.exam_subject == "aptitude_subject" && "Ⅱ"}-{currentLabel.attributes.number}-{currentQuestion.attributes.number}</Text>
                )}
                <Text c="dimmed" ta="right" className={classes.detail}>第{currentQuestionIndex + 1}問目/選択問題数 全{questions.length}問</Text>
              </Container>
                <Text className={classes.supTitle}>解説</Text>
                <Container size={660} p={0}>
                  <Text c="dimmed" className={classes.description}>{currentQuestion.attributes.commentary}</Text>
                </Container>
                <Button fullWidth variant="filled" size="lg" color="blue" onClick={() => goToNextQuestion()}>次の問題へ</Button>
            </Container>
          )}
        </div>
        )
      }
    </>
  );
}