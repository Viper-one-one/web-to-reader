'use client';

export default function Home() {

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const url = (form.elements.namedItem('url') as HTMLInputElement).value;
    const format = (form.elements.namedItem('format') as HTMLInputElement).value;

    const response = await fetch('/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "url": url, "format": format }),
    });
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
          />
          <label className="block text-sm font-medium text-gray-500 mt-4">
            Select Format:
          </label>
          <div className="flex justify-evenly">
            <div className="flex flex-col justify-items-evenly">
              <label className="block text-sm font-medium text-gray-500">
                PDF
              </label>
              <input type="radio" name="format" value="PDF" />
            </div>
            <div className="flex flex-col justify-items-evenly">
              <label className="block text-sm font-medium text-gray-500">
                EPUB
              </label>
              <input type="radio" name="format" value="EPUB" />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
