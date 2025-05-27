"use client";

import { useState } from "react";

interface ExtractedTitle {
  url: string;
  title: string;
  error?: string;
  checked?: boolean;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [extractedTitles, setExtractedTitles] = useState<ExtractedTitle[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashingButton, setFlashingButton] = useState<number | null>(null);

  const extractUrls = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  const processUrls = async () => {
    setIsProcessing(true);
    const urls = extractUrls(inputText);

    if (urls.length === 0) {
      alert("No URLs found in the input text.");
      setIsProcessing(false);
      return;
    }

    const results: ExtractedTitle[] = [];

    for (const url of urls) {
      try {
        const response = await fetch("/api/extract-metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (data.error) {
          results.push({
            url,
            title: "Error extracting title",
            error: data.error,
          });
        } else {
          results.push({
            url,
            title: data.title || "No title found",
          });
        }
      } catch (error) {
        results.push({
          url,
          title: "Error processing URL",
          error: String(error),
        });
      }
    }

    setExtractedTitles(results);
    setIsProcessing(false);
  };

  const copyToClipboard = async (text: string, index: number) => {
    // Add " - FLAC" to the end of the text
    const textWithFlag = `${text} - FLAC`;
    try {
      await navigator.clipboard.writeText(textWithFlag);

      // Flash the button
      setFlashingButton(index);
      setTimeout(() => setFlashingButton(null), 200);

      // Automatically check the item when copied
      toggleItemCheck(index);

      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const toggleItemCheck = (index: number) => {
    setExtractedTitles((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const formatTitle = (item: ExtractedTitle): string => {
    return item.title;
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Music Title Copier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          {/* Left Column - Input */}
          <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Paste URLs Here
            </h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste text containing YouTube Music links or other music URLs here..."
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
            />
            <button
              onClick={processUrls}
              disabled={isProcessing || !inputText.trim()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              {isProcessing ? "Processing..." : "Extract Titles"}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Extracted Titles ({extractedTitles.length})
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3">
              {extractedTitles.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No titles extracted yet. Paste some URLs and click Extract
                  Titles to get started.
                </div>
              ) : (
                extractedTitles.map((item, index) => (
                  <div
                    key={index}
                    className={`border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-300 ${
                      item.checked ? "opacity-50 bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={item.checked || false}
                          onChange={() => toggleItemCheck(index)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 break-words">
                            {formatTitle(item)}
                          </p>
                          <p className="text-sm text-gray-500 break-all mt-1">
                            {item.url}
                          </p>
                          {item.error && (
                            <p className="text-sm text-red-500 mt-1">
                              Error: {item.error}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(formatTitle(item), index);
                        }}
                        className={`flex-shrink-0 text-white text-sm font-medium py-2 px-4 rounded-md transition-all duration-200 ${
                          flashingButton === index
                            ? "bg-blue-500 scale-105 shadow-lg"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        title="Copy to clipboard"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
