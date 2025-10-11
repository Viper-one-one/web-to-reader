'use client';
import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    url: "",
    format: "",
    valid: false
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();
  const validateForm = Object.values(formData).every(value => value !== "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const url = (form.elements.namedItem('url') as HTMLInputElement).value;
    const format = (form.elements.namedItem('format') as HTMLInputElement).value;
    console.log('Submitting:', { url, format });
    setLoading(true);
    const response = await fetch('/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "url": url, "format": format }),
    })
    .catch(err => console.error('Error:', err));
    const data = await response?.json();
    if (data?.error) {
      setError(data.error);
    }
    if (response?.status && (response.status >= 400 && response.status < 600)) {
      setError(data?.error || `Error: ${response.status} ${response.statusText}`);
      return;
    }
    if (data?.books) {
      setError(null);
      // Pass books data as URL search parameters
      const booksParam = encodeURIComponent(JSON.stringify(data.books));
      router.push(`/book-selection?books=${booksParam}`);
      console.log('Books received:', data.books);
    }
    setLoading(false);
    console.log('Response:', response);
  }

  function handleThemeChange() {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }

  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <button className={`flex items-center justify-center p-2 border border-gray-500 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-gray-800'}  shadow`} onClick={handleThemeChange}>
          <Image className={`${theme === 'dark' ? '' : 'invert'}`} src="/dark-mode-night-moon-svgrepo-com.svg" alt="Theme Icon" width={24} height={24} />
        </button>
      </div>
      <div className={`container max-w-full flex min-h-screen flex-col items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        
        <h1 className="text-4xl font-bold">Web to Reader</h1>
        <form className="mt-8 w-full max-w-md border border-blue-400 p-2 rounded-lg shadow-md"
          onSubmit={handleSubmit}>
          <label htmlFor="url" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'}`}>
            Enter URL:
          </label>
          <input
            type="text"
            id="url"
            name="url"
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            onChange={handleChange}
          />
          <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'} mt-4`}>
            Select Format:
          </label>
          <div className="flex justify-evenly">
            <div className="flex flex-col justify-items-evenly">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'}`}>
                PDF
              </label>
              <input type="radio" name="format" value="PDF" onChange={handleChange} />
            </div>
            <div className="flex flex-col justify-items-evenly">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'}`}>
                EPUB
              </label>
              <input type="radio" name="format" value="EPUB" onChange={handleChange} />
            </div>
          </div>
            <button
              type="submit"
              className={`mt-4 w-full ${validateForm ? 'bg-indigo-500' : 'bg-gray-500'} text-white p-2 rounded-md ${validateForm ? 'hover:bg-indigo-700' : 'hover:bg-gray-700'}`}
              disabled={!validateForm || loading}
            >
              {
                loading ? (<svg className="animate-spin ml-1 mr-2 h-5 w-5 inline-block text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> ) : (
                  "Get Books"
                )
              }
            </button>
        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
      <div>
        <footer className={`w-full py-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
          <p>© 2025 Taylor Nastally. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
