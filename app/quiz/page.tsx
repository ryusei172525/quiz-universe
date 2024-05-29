import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import QuizComponent from '@/components/QuizComponent';

const QuizPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizComponent />
    </Suspense>
  );
};

export default QuizPage;