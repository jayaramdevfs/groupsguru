"use client";

import React, { useEffect, useState } from 'react';
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Multilang } from "@/components/ui/Multilang";

export default function MigrationStatusPage() {
    const [status, setStatus] = useState<{ microTopics: number; questions: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('/api/admin/migration/status', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
        <ProtectedLayout requiredRole="ADMIN">
            <div className="max-w-[800px] mx-auto py-12 px-6">
                
                {/* Header Section */}
                <header className="mb-12 border-b border-[#3A3A3A] pb-8">
                    <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
                        Data Integrity Protocol_09
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-4">
                        Migration <span className="text-[#D97706]">Verify</span>
                    </h1>
                    <p className="text-[#A0A0A0] max-w-xl leading-relaxed text-sm">
                        <Multilang 
                            en="Real-time audit of the seed data migration. Verify knowledge node population and MCQ repository sync against benchmark targets." 
                            te="డేటా మైగ్రేషన్ స్థితిని తనిఖీ చేయండి. లక్ష్యాలను చేరుకున్నాయో లేదో చూడండి."
                        />
                    </p>
                </header>

                <div className="border border-[#3A3A3A] rounded bg-[#1C1C1C] overflow-hidden">
                    <div className="p-8 border-b border-[#3A3A3A] bg-[#141414] flex justify-between items-center">
                        <div>
                            <h2 className="text-sm font-mono font-bold text-[#E8E8E8] uppercase tracking-[0.2em]">Live Database Population</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${loading ? "bg-[#666666] animate-pulse" : (status?.microTopics ? "bg-[#10B981]" : "bg-[#C74444]")}`}></span>
                                <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">
                                    {loading ? "querying..." : (status?.microTopics ? "connected_stable" : "connection_failed")}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {loading && (
                            <div className="py-10 flex flex-col items-center gap-4">
                                <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Parsing Tables...</span>
                            </div>
                        )}
                        
                        {error && (
                            <div className="p-6 bg-[#C74444]/10 border border-[#C74444]/30 rounded flex items-start gap-4">
                                <div className="text-[#C74444]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono font-bold text-[#C74444] uppercase tracking-widest mb-1">Critical Failure</div>
                                    <div className="text-sm font-mono text-[#E8E8E8]">{error}</div>
                                </div>
                            </div>
                        )}
                        
                        {status && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#141414] border border-[#3A3A3A] p-8 rounded relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#D97706]/5 group-hover:bg-[#D97706]/10 transition-colors"></div>
                                    <div className="text-[#666666] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">Micro-Topic Index</div>
                                    <div className="text-5xl font-mono font-bold text-[#D97706] mb-4">{status.microTopics}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-[#1C1C1C] rounded-full overflow-hidden border border-[#3A3A3A]">
                                            <div className="h-full bg-[#10B981]" style={{ width: `${Math.min(100, (status.microTopics / 1021) * 100)}%` }}></div>
                                        </div>
                                        <span className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest">Target: 1,021</span>
                                    </div>
                                </div>
                                
                                <div className="bg-[#141414] border border-[#3A3A3A] p-8 rounded relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#D97706]/5 group-hover:bg-[#D97706]/10 transition-colors"></div>
                                    <div className="text-[#666666] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">Question Corpus</div>
                                    <div className="text-5xl font-mono font-bold text-[#D97706] mb-4">{status.questions}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-[#1C1C1C] rounded-full overflow-hidden border border-[#3A3A3A]">
                                            <div className="h-full bg-[#10B981]" style={{ width: `${Math.min(100, (status.questions / 200) * 100)}%` }}></div>
                                        </div>
                                        <span className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest">Target: 200+</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {status && (
                            <div className="mt-8 flex justify-center">
                                <button 
                                    onClick={async () => {
                                        try {
                                           const res = await fetch('/api/admin/migration/sync-materials', {
                                                method: 'POST',
                                                headers: {
                                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                                }
                                           });
                                           const msg = await res.text();
                                           alert(msg);
                                           // refresh status...
                                           window.location.reload();
                                        } catch (e: any) {
                                            alert("Sync failed: " + e.message);
                                        }
                                    }}
                                    className="px-8 py-3 rounded bg-[#D97706]/10 border border-[#D97706]/30 text-[#D97706] font-mono font-bold uppercase tracking-widest hover:bg-[#D97706] hover:text-white transition-all shadow-lg"
                                >
                                    Sync Materials from Local Drive
                                </button>
                            </div>
                        )}

                        {status && (
                            <footer className="mt-8 pt-6 border-t border-[#3A3A3A] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${status.microTopics >= 1021 ? 'bg-[#10B981]' : 'bg-[#D97706]'}`}></div>
                                    <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">
                                        Status: {status.microTopics >= 1021 ? 'PROTOCOL_SUCCESS' : 'SYNC_IN_PROGRESS'}
                                    </span>
                                </div>
                                <div className="text-[9px] font-mono font-bold text-[#3A3A3A] uppercase tracking-[0.2em]">
                                    GroupsGuru_Migration_Module_v3
                                </div>
                            </footer>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
}
