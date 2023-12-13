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

  return (
    <>
    {questions.map((question) => {
      const subject = subjects.find(s => s.id === question.relationships.subject.data.id);
      const label = labels.find(s => s.id === question.relationships.label.data.id);
      return (
        <div key={question.id}>
          <p>{question.attributes.content}</p>
          <ul>
            {question.relationships.choices.data.map((choiceRelation) => {
              const choice = choices.find(c => c.id === choiceRelation.id);
              return <li key={choice.id}>{choice.attributes.content}</li>;
            })}
          </ul>
          {subject && (
            <ul>
              <li key={subject.id}>{subject.attributes.year} {subject.attributes.exam_subject}</li>
            </ul>
          )}
          {label && (
            <ul>
              <li key={label.id}>{label.attributes.number} {label.attributes.title}</li>
            </ul>
          )}
          {/* その他の質問に関連するデータを表示 */}
        </div>
      );
    })}
  </>
  );
}