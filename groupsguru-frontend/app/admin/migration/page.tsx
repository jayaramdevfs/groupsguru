"use client";

import React, { useEffect, useState } from 'react';

export default function MigrationStatusPage() {
    const [status, setStatus] = useState<{ microTopics: number; questions: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // Fetch from the backend
                const response = await fetch('http://localhost:8080/api/admin/migration/status', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // assuming token is needed
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch migration status');
                }
                
                const data = await response.json();
                setStatus(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col p-8">
            <h1 className="text-3xl font-bold mb-8 text-black">Data Migration Status</h1>
            
            <div className="max-w-4xl bg-white p-8 rounded-xl shadow border border-gray-200">
                <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                    <span className="w-3 h-3 bg-[#EA580C] rounded-full mr-3 shadow-glow-purple"></span>
                    Database Population
                </h2>
                
                {loading && <div className="text-gray-500 animate-pulse">Checking status...</div>}
                
                {error && <div className="text-red-500 bg-red-50 p-4 rounded-md border border-red-200">{error}</div>}
                
                {status && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#EA580C] border border-[#57534E]/40 p-6 rounded-lg text-center shadow-sm">
                            <h3 className="text-lg font-medium text-[#F97316] mb-2">Micro Topics</h3>
                            <div className="text-5xl font-bold text-[#F97316] font-mono tracking-tight">{status.microTopics}</div>
                            <div className="mt-3 text-sm font-medium text-[#F97316] bg-[#EA580C] inline-block px-3 py-1 rounded-full">Target: 1,021</div>
                        </div>
                        
                        <div className="bg-[#EA580C] border border-[#57534E]/40 p-6 rounded-lg text-center shadow-sm">
                            <h3 className="text-lg font-medium text-[#F97316] mb-2">Questions</h3>
                            <div className="text-5xl font-bold text-[#F97316] font-mono tracking-tight">{status.questions}</div>
                            <div className="mt-3 text-sm font-medium text-[#F97316] bg-[#EA580C] inline-block px-3 py-1 rounded-full">Target: 200+</div>
                        </div>
                    </div>
                )}
                
                {status && (
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${status.microTopics >= 1021 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-gray-700 font-medium">
                            {status.microTopics >= 1021 ? 'Migration Successful' : 'Migration Pending or Incomplete'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
