'use client';
import { useState } from "react";
import Image from "next/image";

type SelectionComponentProps = {
    books: Array<{id: number, title: string}>;
    format: string | null;
    url: string | null;
};

export default function SelectionComponent({ books, format, url }: SelectionComponentProps) {
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
        
        try {
            const response = await fetch('http://localhost:5000/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedBooks: selectedBooks,
                    format: format,
                    url: url
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check if response is JSON (error) or file (success)
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                // Handle JSON response (likely an error)
                const data = await response.json();
                if (data?.error) {
                    setError(data.error);
                    setLoading(false);
                    return;
                }
            } else {
                // Handle file download
                const blob = await response.blob();
                
                // Get filename from Content-Disposition header
                const contentDisposition = response.headers.get('content-disposition');
                let filename = 'download.pdf'; // Default filename
                console.log('Download content-disposition header:', contentDisposition);
                console.log('Response content-type:', contentType);
                
                if (contentDisposition) {
                    // Parse Content-Disposition header: attachment; filename=Volume_1_20241019_181142.pdf
                    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1].replace(/['"]/g, '');
                    }
                } else {
                    // Fallback: create filename based on content type and selected books
                    const bookNames = selectedBooks.join('_');
                    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
                    
                    // Determine extension from content-type
                    let extension = 'pdf';
                    if (contentType?.includes('application/zip')) {
                        extension = 'zip';
                    } else if (contentType?.includes('application/pdf')) {
                        extension = 'pdf';
                    } else if (contentType?.includes('application/epub')) {
                        extension = 'epub';
                    }
                    
                    filename = `books_${bookNames}_${timestamp}.${extension}`;
                }
                
                console.log('Download filename:', filename);
                
                // Create download link and trigger download
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                
                // Cleanup
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                console.log('File downloaded successfully');
                setLoading(false);
                return;
            }
            
        } catch (err) {
            console.error('Error:', err);
            setError('Download failed: ' + (err as Error).message);
            setLoading(false);
        }
    }

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
                (
                <>
                <div className="text-red-500">{error}</div>
                <button onClick={() => setError(null)} className="mt-4 bg-blue-500 text-white p-2 rounded-md">Return to Selection</button>
                </>
                ) :
                (<>
                    <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Book Selection Page</h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Select books you would like to download from the list below:</p>
                    { 
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