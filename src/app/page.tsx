'use client';
import { useState } from "react";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    url: "",
    format: "",
    valid: false
  });

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
    console.log('Response:', response);
  }

  return (
    <>
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold">Web to Reader</h1>
        <form className="mt-8 w-full max-w-md border border-blue-400 p-2 rounded-lg shadow-md"
          onSubmit={handleSubmit}>
          <label htmlFor="url" className="block text-sm font-medium text-gray-500">
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
          <label className="block text-sm font-medium text-gray-500 mt-4">
            Select Format:
          </label>
          <div className="flex justify-evenly">
            <div className="flex flex-col justify-items-evenly">
              <label className="block text-sm font-medium text-gray-500">
                PDF
              </label>
              <input type="radio" name="format" value="PDF" onChange={handleChange} />
            </div>
            <div className="flex flex-col justify-items-evenly">
              <label className="block text-sm font-medium text-gray-500">
                EPUB
              </label>
              <input type="radio" name="format" value="EPUB" onChange={handleChange} />
            </div>
          </div>
            <button
              type="submit"
              className={`mt-4 w-full ${validateForm ? 'bg-indigo-500' : 'bg-gray-500'} text-white p-2 rounded-md hover:bg-indigo-700`}
              disabled={!validateForm}
            >
              Submit
            </button>
        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </>
  );
}
