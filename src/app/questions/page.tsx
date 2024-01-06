'use client';

import { Image, Text, Container, SimpleGrid, Button, Progress, Center, Group, Table } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Notifications, notifications } from '@mantine/notifications';
import { CiCircleCheck, CiCircleRemove, CiCircleMinus } from "react-icons/ci";
import { convertToJapaneseEra } from '../../components/utils';
import { TwitterShareButton } from '../../components/TwitterShareButton';
import classes from './Questions.module.css';
import { marked } from 'marked';
import katex from 'katex';
import { IoFlag } from "react-icons/io5";

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
  included: Array<any>; 
}

interface MyComponentProps {
  content: string;
}

interface UserAnswer {
  choiceId: string;
  choicedIndex: number;
  isCorrect: boolean;
  answered: boolean;
}

type UserAnswers = {
  [questionId: string]: UserAnswer;
};

interface IncludedItem {
  type: string;
}

interface FlagItem {
  attributes: {
    question_id: string;
    // 他の属性があればここに
  };
  // 他のプロパティがあればここに
}

interface FlagStatuses {
  [key: string]: boolean;
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
  const [flagStatuses, setFlagStatuses] = useState<FlagStatuses>({}); 

  const [userAnswers, setUserAnswers] = useState<UserAnswers>({}); // ユーザーの解答を管理するための状態
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 現在の問題のインデックス
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0); //　正当数カウント
  // const [twitterDataText, setTwitterDataText] = useState("");

  const [isQuestionScreen, setIsQuestionScreen] = useState(true); // 問題と解答の画面切り替え
  const [isResultScreen, setIsResultScreen] = useState(false); // 結果画面への切り替え

  useEffect(() => {
    if (searchParams) {
      const subjectIds = searchParams.getAll('subject_ids[]');
      // console.log(subjectIds);

      if (subjectIds) {
        const query = Array.isArray(subjectIds)
          ? subjectIds.map(id => `subject_ids[]=${id}`).join('&')
          : `subject_ids[]=${subjectIds}`;

        fetch(`https://pro-engineer-1st-exam-app-api-d4afe40512f5.herokuapp.com/api/v1/questions/filter?${query}`)
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
    }
      // ユーザー情報の取得とフラグの状態設定
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`https://pro-engineer-1st-exam-app-api-d4afe40512f5.herokuapp.com/api/v1/user_info`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          const flags = data.included.filter((item: IncludedItem) => item.type === 'flag');

          // フラグの状態を管理するオブジェクトを初期化
          const flagStatuses: FlagStatuses = {};
          flags.forEach((flag: FlagItem) => {
            flagStatuses[flag.attributes.question_id] = true;
          });

          // フラグの状態をステートにセット
          setFlagStatuses(flagStatuses);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

  fetchUserInfo();
  }, [searchParams]);

  const handleFlagClick = async (event: React.MouseEvent, questionId: string, flagStatus: boolean) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notifications.show({
          title: '認証',
          message: 'フラグするにはログイン/新規登録が必要です。',
          color: 'red',
        });
        console.error("ログインが必要です");
        return;
      }

      let response;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      if (!flagStatus) {
        // フラグを追加するAPIリクエスト
        response = await fetch(`https://pro-engineer-1st-exam-app-api-d4afe40512f5.herokuapp.com/api/v1/flags`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ flag: { question_id: questionId } }),
        });
      } else {
        // フラグを削除するAPIリクエスト
        response = await fetch(`https://pro-engineer-1st-exam-app-api-d4afe40512f5.herokuapp.com/api/v1/flags/${questionId}`, {
          method: 'DELETE',
          headers: headers,
        });
      }
      if (response.ok) {
        // フラグ状態の更新
        // console.log('Current flag status:', flagStatuses[questionId]);
        const updatedFlagStatus = !flagStatuses[questionId];
        // console.log('Updated flag status:', updatedFlagStatus);
        setFlagStatuses(prev => ({ ...prev, [questionId]: updatedFlagStatus }));
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error handling flag:', error);
      notifications.show({
        title: 'エラー',
        message: 'フラグの操作に失敗しました。',
        color: 'red',
      });
    }
  };
  

  const renderMarkdownAndLatex = async (markdownText: string) => {
    // 1. LaTeX数式のレンダリング
    let latexProcessedText = markdownText.replace(/\\\((.*?)\\\)/g, (match, formula) => {
      return katex.renderToString(formula, { throwOnError: false, displayMode: false });
    }).replace(/\\\[(.*?)\\\]/g, (match: any, formula: string) => {
      return katex.renderToString(formula, { throwOnError: false, displayMode: true });
    });
  
    // 2. Markdownのレンダリング
    return marked(latexProcessedText);
  };
  
  const MyComponent = ({ content }: MyComponentProps) => {
    const [renderedContent, setRenderedContent] = useState('');
  
    useEffect(() => {
      const renderContent = async () => {
        const html = await renderMarkdownAndLatex(content);
        setRenderedContent(html);
      };
  
      renderContent();
    }, [content]);
  
    // 3. 結果の表示
    return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />;
  };
  

  // 解答を保存して解説に遷移する関数
  function handleAnswer(choiceId: string, choicedIndex: number, questionId: string) {
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
        id: questionId.toString(),
        autoClose: 1000,
        title: "正解!",
        message: 'いい調子!',
        icon: <CiCircleCheck />,
        className: 'my-notification-class',
        loading: false,
      });
    } else {
      notifications.show({
        id: questionId.toString(),
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
    setIsQuestionScreen(true);
  }

  // 次の問題画面へ
  function goToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      // まだ未解答の問題がある場合は次の問題へ
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setIsQuestionScreen(true);
    } else {
      setIsResultScreen(true);
    }
  }

  // 現在の問題を表示する
  const currentQuestion = questions[currentQuestionIndex];
  const currentSubject = currentQuestion ? subjects.find(s => s.id === currentQuestion.relationships.subject.data.id) : null;
  const currentLabel = currentQuestion ? labels.find(s => s.id === currentQuestion.relationships.label.data.id) : null;
  
  // Twitterテキスト
  const twitterDataText = `${currentSubject 
    ? `${convertToJapaneseEra(currentSubject.attributes.year)}度 技術士 第一次試験 ${getSubjectDisplayName(currentSubject.attributes.exam_subject as 'basic_subject' | 'aptitude_subject')}を学習中`
    : ''
  }`;

  // useEffect(() => {
  //   const text = `${currentSubject 
  //     ? `${convertToJapaneseEra(currentSubject.attributes.year)}度 技術士 第一次試験 ${getSubjectDisplayName(currentSubject.attributes.exam_subject as 'basic_subject' | 'aptitude_subject')}`
  //     : ''
  //   } ${questions.length}問中${correctAnswersCount}問正解 正解率: ${(correctAnswersCount / questions.length * 100).toFixed(1)}%`;
    
  //   setTwitterDataText(text);
  // }, [correctAnswersCount, currentQuestionIndex, currentSubject, questions.length]);

  // 結果表示一覧表
  const rows = questions.map((question, index) => {
    const userAnswer = userAnswers[question.id];
    const isCorrect = userAnswer ? userAnswer.isCorrect : false;
    const answerIcon = userAnswer ? (isCorrect ? <CiCircleCheck size={24} color="blue"/> : <CiCircleRemove size={24} color="red"/>) : <CiCircleMinus size={24} color="gray"/>;

    return (
      <Table.Tr key={question.id}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td c="dimmed">{`${question.attributes.content.substring(0, 30)}...`}</Table.Td>
        <Table.Td>{answerIcon}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
      />
      <Notifications containerWidth={800} notificationMaxHeight={800} position="top-center" />
      {isResultScreen ? (
        <div>
          <Container size={700} className={classes.wrapper}>
            <Text c="dimmed" ta="center">{questions.length}問中{correctAnswersCount}問正解 正解率: {(correctAnswersCount / questions.length * 100).toFixed(1)}%</Text>
            <Center>
              <Progress color="gray" radius="md" size="xs" value={Math.round(correctAnswersCount / questions.length * 100)} animated className={classes.customProgress}/>
            </Center>
            <Container size={660} p={0} className={classes.table}>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>番号</Table.Th>
                    <Table.Th>詳細</Table.Th>
                    <Table.Th>正誤</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Container>
            <Container size={660} p={0} >
              <Group justify="flex-end">
                <TwitterShareButton
                  dataText={twitterDataText}                      
                />
              </Group>
            </Container>
            <Button fullWidth variant="filled" size="lg" color="blue" className={classes.button}>記録を保存（ログイン/新規登録）</Button>
          </Container>
        </div>
      ):(
      <div>
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
                  <Text component="div" c="dimmed" className={classes.description}><MyComponent content={currentQuestion.attributes.content} /></Text>
                </Container>

                <Container size={660} p={0}>
                  {currentQuestion.attributes.question_img_src && 
                    <Image
                      src={`https://pro-engineer-1st-exam-app-api-d4afe40512f5.herokuapp.com/images/questions/${currentQuestion.attributes.question_img_src}.png`}
                      alt={`${
                        currentSubject 
                        ? `${convertToJapaneseEra(currentSubject.attributes.year)}度 技術士 第一次試験 ${currentSubject.attributes.exam_subject === "basic_subject" ? "Ⅰ" : ""}${currentSubject.attributes.exam_subject === "aptitude_subject" ? "Ⅱ" : ""}-${currentLabel ? currentLabel.attributes.number : ""}-${currentQuestion.attributes.number}`
                        : ""
                      }`}
                    />
                  }
                </Container>

                <Container size={660} p={0}>
                  <SimpleGrid cols={1} spacing={0}>
                    {currentQuestion.relationships.choices.data.map((choiceRelation, index) => {
                      const choice = choices.find(c => c.id === choiceRelation.id);
                      if (!choice) {
                        return null; // choiceが見つからない場合は何もレンダリングしない
                      }
                      return (
                        <Text component="div" key={choice.id} c="dimmed" className={classes.choice}>
                          <span className={classes.indexColor}>{index + 1}. {"  "}</span>  <MyComponent content={choice.attributes.content} />
                        </Text>
                      );
                    })}
                  </SimpleGrid>
                </Container>

                <Container size={660} p={0} className={classes.detailContainer}>
                  {currentSubject && (
                    <Text c="dimmed" ta="right" className={classes.detail} key={currentSubject.id}>
                      {convertToJapaneseEra(currentSubject.attributes.year)}度 技術士 第一次試験 {getSubjectDisplayName(currentSubject.attributes.exam_subject as 'basic_subject' | 'aptitude_subject')}
                    </Text>
                  )}
                  {currentLabel && (
                    <Text c="dimmed" ta="right" className={classes.detail} key={currentLabel.id}>「{currentLabel.attributes.title}」
                      {currentSubject && (
                        <>
                          {currentSubject.attributes.exam_subject === "basic_subject" && "Ⅰ"}
                          {currentSubject.attributes.exam_subject === "aptitude_subject" && "Ⅱ"}
                        </>
                      )}
                      -{currentLabel.attributes.number}-{currentQuestion.attributes.number}
                    </Text>
                  )}
                  <Text c="dimmed" ta="right" className={classes.detail}>第{currentQuestionIndex + 1}問目/選択問題数 全{questions.length}問</Text>
                </Container>
                <Container size={660} p={0} className="flagSns">
                  <Group justify="space-between">
                    <IoFlag
                      id={currentQuestion.id + "-flag-question"}
                      className={classes.flagIcon}
                      color={flagStatuses[currentQuestion.id] ? 'blue' : 'grey'}
                      onClick={(e) => handleFlagClick(e, currentQuestion.id, flagStatuses[currentQuestion.id])}
                    />
                    <TwitterShareButton
                      dataText={twitterDataText}               
                    />
                  </Group>
                </Container>
                <Container size={660} p={0} className={classes.buttonContainer}>
                  <SimpleGrid cols={5}>
                    {currentQuestion.relationships.choices.data.map((choiceRelation, index) => {
                      const choice = choices.find(c => c.id === choiceRelation.id);
                      if (!choice) {
                        return null; // 何も表示しない場合
                      }
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
                <Button fullWidth variant="filled" size="lg" color="blue" onClick={() => setIsQuestionScreen(false)} className={classes.button}>解答解説を見る</Button>
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
                    <Text c="dimmed" ta="right" className={classes.detail} key={currentSubject.id}>
                      {convertToJapaneseEra(currentSubject.attributes.year)}度 技術士 第一次試験 {getSubjectDisplayName(currentSubject.attributes.exam_subject as 'basic_subject' | 'aptitude_subject')}
                    </Text>
                  )}
                  {currentLabel && (
                    <Text c="dimmed" ta="right" className={classes.detail} key={currentLabel.id}>「{currentLabel.attributes.title}」
                      {currentSubject && (
                        <>
                          {currentSubject.attributes.exam_subject === "basic_subject" && "Ⅰ"}
                          {currentSubject.attributes.exam_subject === "aptitude_subject" && "Ⅱ"}
                        </>
                      )}
                      -{currentLabel.attributes.number}-{currentQuestion.attributes.number}
                    </Text>
                  )}
                  <Text c="dimmed" ta="right" className={classes.detail}>第{currentQuestionIndex + 1}問目/選択問題数 全{questions.length}問</Text>
                </Container>
                  <Text className={classes.supTitle}>解説</Text>
                  <Container size={660} p={0}>
                    <Text component="div" c="dimmed" className={classes.description}><MyComponent content={currentQuestion.attributes.commentary} /></Text>
                  </Container>
                  <Container size={660} p={0}>
                  {currentQuestion.attributes.answer_img_src && 
                    <Image
                    src={`https://pro-engineer-1st-exam-app-api-d4afe40512f5.herokuapp.com/images/questions/${currentQuestion.attributes.answer_img_src}.png`}
                    alt={`${
                      currentSubject 
                      ? `${convertToJapaneseEra(currentSubject.attributes.year)}度 技術士 第一次試験 ${currentSubject.attributes.exam_subject === "basic_subject" ? "Ⅰ" : ""}${currentSubject.attributes.exam_subject === "aptitude_subject" ? "Ⅱ" : ""}-${currentLabel ? currentLabel.attributes.number : ""}-${currentQuestion.attributes.number}-answer`
                      : ""
                    }`}
                  />
                  }
                  </Container>
                  <Container size={660} p={0} >
                    <Group justify="space-between">
                      <IoFlag
                        id={currentQuestion.id + "-flag-answer"}
                        className={classes.flagIcon}
                        color={flagStatuses[currentQuestion.id] ? 'blue' : 'grey'}
                        onClick={(e) => handleFlagClick(e, currentQuestion.id, flagStatuses[currentQuestion.id])}
                      />
                      <TwitterShareButton
                        dataText={twitterDataText}                    
                      />
                    </Group>
                  </Container>
                <Button fullWidth variant="filled" size="lg" color="blue" onClick={() => goToNextQuestion()} className={classes.button}>次の問題へ</Button>
              </Container>
            )}
          </div>
        )}
      </div>
      )}
    </>
  );
}