'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SelectionComponent from '../page-components/selection-page';

function BookSelectionContent() {
  const searchParams = useSearchParams();
  const booksParam = searchParams.get('books');

  let books = [{id: 1, title: "test"}]; // fallback

  if (booksParam) {
    try {
      books = JSON.parse(decodeURIComponent(booksParam));
    } catch (error) {
      console.error('Error parsing books data:', error);
    }
  }

  return (
    <main>
      <SelectionComponent books={books} />
    </main>
  );
}

export default function BookSelection() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookSelectionContent />
    </Suspense>
  );
}