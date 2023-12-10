'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (router.isReady) {
      const { subject_ids } = router.query;

      if (subject_ids) {
        const query = Array.isArray(subject_ids)
          ? subject_ids.map(id => `subject_ids[]=${id}`).join('&')
          : `subject_ids[]=${subject_ids}`;

        fetch(`http://localhost:4000/api/v1/questions/filter?${query}`)
          .then(response => response.json())
          .then(data => setQuestions(data.data));
      }
    }
  }, [router.isReady, router.query]);

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <p>{question.content}</p>
          {/* その他の質問に関連するデータを表示 */}
        </div>
      ))}
    </div>
  );
}