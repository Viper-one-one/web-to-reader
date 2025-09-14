

export default function Home() {
  return (
    <>
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold">Web to Reader</h1>
        <form className="mt-8 w-full max-w-md border border-blue-400 p-2 rounded-lg shadow-md">
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
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
          >
            Generate PDF
          </button>
        </form>
      </div>
    </>
  );
}
