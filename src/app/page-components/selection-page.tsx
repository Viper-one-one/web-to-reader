'use client';
import { useState, useEffect } from "react";
import Image from "next/image";

type SelectionComponentProps = {
    books: Array<{id: number, title: string}>;
    format: string | null;
};

export default function SelectionComponent({ books, format }: SelectionComponentProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    async function fetchBooks(event: React.FormEvent) {
        setLoading(true);
        event?.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const selectedBooks = formData.getAll('books');
        if (selectedBooks.length === 0) {
            setError('Please select at least one book.');
            setLoading(false);
            return;
        }
        console.log('Selected books:', selectedBooks);
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                selectedBooks: selectedBooks,
                format: format
            }),
        }).catch(err => {
            console.error('Error:', err);
            setError('Fetch error: ' + err.message);
            setLoading(false);
        });
        const data = await response?.json();
        if (data?.error) {
            setError(data.error);
            setLoading(false);
            return;
        }
        setLoading(false);
        return data?.books;
    }

    useEffect(() => {
        fetch('/post_books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({}),
        })
        .then(response => response.json())
        .then(data => {
            if (data?.error) {
                setError(data.error);
            }
            console.log('Fetched books:', data?.books);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            setError('Fetch error: ' + error.message);
            setLoading(false);
        });
    }, []);

    function handleThemeChange() {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }

    function debug(event: React.FormEvent) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const selectedBooks = formData.getAll('books');
        console.log('Selected books:', selectedBooks);
        alert('Selected books: ' + selectedBooks.join(', '));
    }

    return (
        <div className={`container max-w-full flex min-h-screen flex-col items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <div className="absolute top-4 right-4 z-10">
                <button className={`flex items-center justify-center p-2 border border-gray-500 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-gray-800'}  shadow`} onClick={handleThemeChange}>
                    <Image className={`${theme === 'dark' ? '' : 'invert'}`} src="/dark-mode-night-moon-svgrepo-com.svg" alt="Theme Icon" width={24} height={24} />
                </button>
            </div>
            { error ?
                (<div className="text-red-500">{error}</div>) :
                (<>
                    <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Book Selection Page</h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Select books you would like to download from the list below:</p>
                    { loading ? <div>Loading books...</div> :
                        <form onSubmit={fetchBooks} method="POST" className="w-full max-w-md mt-4">
                        <div className="space-y-2">
                            {Array.isArray(books) ? books.map((book, index) => (
                                <label key={book?.id || index} className={`flex items-center p-2 hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer border rounded`}>
                                    <input type="checkbox" name="books" value={String(book?.id || index)} className="mr-2" />
                                    <span>{String(book?.title || `Book ${index + 1}`)}</span>
                                </label>
                            )) : (
                                <div>No books available</div>
                            )}
                        </div>
                        <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md">Download Book(s)</button>
                        </form>
                    }
                </>)
            }
        </div>
    );
}