'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SelectionComponent from '../page-components/selection-page';

function BookSelectionContent() {
  const searchParams = useSearchParams();
  const booksParam = searchParams.get('books');
  const formatParam = searchParams.get('format');

  let books = [{id: 1, title: "test"}]; // fallback

  if (booksParam) {
    try {
      const parsedData = JSON.parse(decodeURIComponent(booksParam));
      console.log('Parsed books data:', parsedData);
      console.log('Type of parsed data:', typeof parsedData);
      
      // Ensure we have an array
      if (Array.isArray(parsedData)) {
        books = parsedData;
      } else if (parsedData && typeof parsedData === 'object') {
        // If it's an object, try to convert it to an array
        books = Object.entries(parsedData).map(([key, value], index) => ({
          id: index + 1,
          title: key,
          data: value
        }));
      }
      console.log('Final books array:', books);
    } catch (error) {
      console.error('Error parsing books data:', error);
    }
  }

  return (
    <main>
      <SelectionComponent books={books} format={formatParam} />
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