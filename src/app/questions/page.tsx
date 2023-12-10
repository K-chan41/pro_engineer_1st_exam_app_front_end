'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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

interface ApiResponse {
  data: Array<Question | Choice | Label>;
}

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const subjectIds = searchParams.get('subject_ids[]');

    if (subjectIds) {
      const query = Array.isArray(subjectIds)
        ? subjectIds.map(id => `subject_ids[]=${id}`).join('&')
        : `subject_ids[]=${subjectIds}`;

      fetch(`http://localhost:4000/api/v1/questions/filter?${query}`)
        .then(response => response.json())
        .then((responseData: ApiResponse) => {
          // responseData.data で直接データを取得
          setQuestions(responseData.data.filter(item => item.type === 'question'));
        });
    }
  }, [searchParams]);

  console.log(questions);

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <p>{question.attributes.content}</p>
          {/* その他の質問に関連するデータを表示 */}
        </div>
      ))}
    </div>
  );
}