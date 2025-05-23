// app/search/page.tsx
"use client";

import { useState } from "react";

interface DeepSeekResponse {
    data: string;
}

export default function SearchPage() {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await fetch("/api/deepseek", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: query }),
            });
            const { data }: DeepSeekResponse = await res.json();
            setResults([data]);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">DeepSeek AI Search</h1>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query"
                className="border p-2 w-full my-2"
            />
            <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-500 text-white p-2 rounded"
            >
                {loading ? "Searching..." : "Search"}
            </button>
            <ul className="mt-4">
                {results.map((result, index) => (
                    <li key={index} className="my-2">
                        <p>{result}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}