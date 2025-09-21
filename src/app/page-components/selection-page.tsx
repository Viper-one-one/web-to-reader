'use client';
import { useState, useEffect } from "react";
import Image from "next/image";

type SelectionComponentProps = {
    books: Array<{id: number, title: string, author: string}>;
};

export default function SelectionComponent({ books }: SelectionComponentProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [loading, setLoading] = useState<boolean>(true);
    async function fetchBooks() {
        const response = await fetch('/get_books', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response?.json();
        return data?.books;
    }

    useEffect(() => {
        fetchBooks().then(fetchedBooks => {
            console.log('Fetched books:', fetchedBooks);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching books:', error);
            setLoading(false);
        });
    }, []);

    function handleThemeChange() {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`container max-w-full flex min-h-screen flex-col items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <div className="absolute top-4 right-4 z-10">
                <button className={`flex items-center justify-center p-2 border border-gray-500 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-gray-800'}  shadow`} onClick={handleThemeChange}>
                    <Image className={`${theme === 'dark' ? '' : 'invert'}`} src="/dark-mode-night-moon-svgrepo-com.svg" alt="Theme Icon" width={24} height={24} />
                </button>
            </div>
            <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Book Selection Page</h1>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Select your book from the list below:</p>
            <form action="/get_book" method="POST" className="w-full max-w-md mt-4">
            <select name="book" className={`block w-full border border-gray-300 rounded-md p-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <option value="book1">Book 1</option>
                <option value="book2">Book 2</option>
                <option value="book3">Book 3</option>
            </select>
            <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md">Get Book</button>
            </form>
        </div>
  );
}