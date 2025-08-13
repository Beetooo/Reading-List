// functions/books.js
export async function onRequest({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || "javascript";

  // Use your API key from environment variable
  const API_KEY = process.env.GOOGLE_BOOKS_KEY;

  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
