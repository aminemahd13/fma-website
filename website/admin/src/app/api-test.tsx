"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/button";
import { getToken } from "@/lib/utils";

export default function ApiTestPage() {
  const [testResponse, setTestResponse] = useState<string>("No test run yet");
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://fma-api.aminemahdane.com/mtym-api/';
  const fullApiUrl = apiUrl.endsWith('/') ? `${apiUrl}faq` : `${apiUrl}/faq`;

  const runFetchTest = async () => {
    setIsLoading(true);
    setTestResponse("Fetching...");
    
    try {
      const token = getToken();
      console.log("Using token:", token ? "Token found" : "No token");
      console.log("API URL:", fullApiUrl);
      
      const response = await fetch(fullApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      const statusText = `Status: ${response.status} ${response.statusText}`;
      console.log(statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        setTestResponse(`${statusText}\nError: ${errorText}`);
        return;
      }
      
      const data = await response.json();
      setTestResponse(`${statusText}\nResponse: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error("API test error:", error);
      setTestResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runPostTest = async () => {
    setIsLoading(true);
    setTestResponse("Posting test FAQ...");
    
    try {
      const token = getToken();
      console.log("Using token:", token ? "Token found" : "No token");
      console.log("API URL:", fullApiUrl);
      
      const testData = {
        question: "Test Question " + new Date().toISOString(),
        answer: "This is a test answer created at " + new Date().toLocaleString(),
        isActive: true,
        order: 999
      };
      
      const response = await fetch(fullApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(testData)
      });
      
      const statusText = `Status: ${response.status} ${response.statusText}`;
      console.log(statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        setTestResponse(`${statusText}\nError: ${errorText}`);
        return;
      }
      
      const data = await response.json();
      setTestResponse(`${statusText}\nResponse: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error("API test error:", error);
      setTestResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="mb-4">
        <p>API URL: {fullApiUrl}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
      </div>
      
      <div className="flex gap-4 mb-4">
        <Button onClick={runFetchTest} disabled={isLoading}>
          Test GET FAQ
        </Button>
        <Button onClick={runPostTest} disabled={isLoading}>
          Test POST FAQ
        </Button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Response:</h2>
        <pre className="whitespace-pre-wrap">{testResponse}</pre>
      </div>
    </div>
  );
} 