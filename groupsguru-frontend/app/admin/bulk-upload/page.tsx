"use client";

import React, { useState, useEffect } from "react";
import { bulkUploadApi, QuestionBatch } from "../../../lib/bulkUpload";

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [batches, setBatches] = useState<QuestionBatch[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [batchQuestions, setBatchQuestions] = useState<any[]>([]);

  useEffect(() => {
    loadBatches();
  }, [page]);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const res = await bulkUploadApi.getBatches(page, 20);
      setBatches(res.content);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Failed to load batches", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      await bulkUploadApi.upload(file);
      setFile(null);
      setPage(0);
      loadBatches();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await bulkUploadApi.approveBatch(id);
      loadBatches();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await bulkUploadApi.rejectBatch(id);
      loadBatches();
    } catch (err) {
      console.error(err);
    }
  };

  const loadBatchQuestions = async (id: number) => {
    if (selectedBatchId === id) {
      setSelectedBatchId(null);
      return;
    }
    try {
      const qs = await bulkUploadApi.getBatchQuestions(id);
      setBatchQuestions(qs);
      setSelectedBatchId(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#191919] min-h-screen text-[#E8E8E8] font-['Plus_Jakarta_Sans']">
      <div>
        <h1 className="text-3xl font-['Instrument_Serif'] mb-2">Bulk Upload Questions</h1>
        <p className="text-[#A0A0A0] text-sm">Upload CSV, JSON, or XML files to preview and import questions.</p>
      </div>

      {/* Upload Zone */}
      <div className="bg-[#1E1E1E] border border-[#3A3A3A] rounded-md p-6">
        <h2 className="text-xl font-['Instrument_Serif'] mb-4">Upload New Batch</h2>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".xml,.csv,.json"
            onChange={handleFileChange}
            className="block w-full max-w-sm text-sm text-[#A0A0A0] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#2D2D2D] file:text-[#E8E8E8] hover:file:bg-[#3A3A3A]"
          />
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-[#D97706] hover:bg-[#B45309] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>

      {/* Batch History */}
      <div className="bg-[#1E1E1E] border border-[#3A3A3A] rounded-md overflow-hidden">
        <div className="p-4 border-b border-[#3A3A3A]">
          <h2 className="text-xl font-['Instrument_Serif']">Batch History</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-[#A0A0A0]">Loading batches...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#A0A0A0] uppercase bg-[#2D2D2D]">
                <tr>
                  <th className="px-4 py-3">Batch Name</th>
                  <th className="px-4 py-3">Format</th>
                  <th className="px-4 py-3">Stats</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Uploaded At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <React.Fragment key={batch.id}>
                    <tr className="border-b border-[#3A3A3A] hover:bg-[#252525]">
                      <td className="px-4 py-3 font-medium">
                        {batch.batchName}
                        <div className="text-xs text-[#A0A0A0]">{batch.fileName}</div>
                      </td>
                      <td className="px-4 py-3">{batch.fileFormat}</td>
                      <td className="px-4 py-3 text-xs">
                        <div>Total: {batch.totalQuestions}</div>
                        <div className="text-green-500">Success: {batch.successCount}</div>
                        {batch.failCount > 0 && <div className="text-red-500">Fail: {batch.failCount}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded ${
                          batch.status === "APPROVED" ? "bg-green-900/50 text-green-400" :
                          batch.status === "REJECTED" ? "bg-red-900/50 text-red-400" :
                          "bg-yellow-900/50 text-yellow-400"
                        }`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#A0A0A0]">
                        {new Date(batch.uploadedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 space-x-2 text-right">
                        <button
                          onClick={() => loadBatchQuestions(batch.id)}
                          className="text-[#E8E8E8] hover:text-[#D97706] text-xs underline"
                        >
                          {selectedBatchId === batch.id ? "Hide" : "View"}
                        </button>
                        {batch.status === "UPLOADED" && (
                          <>
                            <button
                              onClick={() => handleApprove(batch.id)}
                              className="text-green-500 hover:text-green-400 text-xs underline ml-2"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(batch.id)}
                              className="text-red-500 hover:text-red-400 text-xs underline ml-2"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                    
                    {/* Expanded view for questions/errors */}
                    {selectedBatchId === batch.id && (
                      <tr className="bg-[#2D2D2D]">
                        <td colSpan={6} className="px-4 py-4">
                          {batch.notes && (
                            <div className="mb-4 text-xs text-red-400 font-mono whitespace-pre-wrap bg-[#191919] p-3 rounded border border-red-900/30">
                              <h4 className="font-semibold text-[#E8E8E8] mb-1">Upload Notes / Errors:</h4>
                              {batch.notes}
                            </div>
                          )}
                          <div className="max-h-64 overflow-y-auto">
                            <h4 className="font-semibold text-sm mb-2 text-[#E8E8E8]">Parsed Questions ({batchQuestions.length})</h4>
                            <table className="w-full text-xs text-left text-[#E8E8E8]">
                              <thead className="text-[#A0A0A0] bg-[#191919]">
                                <tr>
                                  <th className="px-2 py-1">Code</th>
                                  <th className="px-2 py-1">Topic</th>
                                  <th className="px-2 py-1">Text (En)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {batchQuestions.map((q) => (
                                  <tr key={q.id} className="border-b border-[#3A3A3A]">
                                    <td className="px-2 py-1">{q.questionCode}</td>
                                    <td className="px-2 py-1">{q.microTopicId}</td>
                                    <td className="px-2 py-1 truncate max-w-xs">{q.questionTextEn}</td>
                                  </tr>
                                ))}
                                {batchQuestions.length === 0 && (
                                  <tr>
                                    <td colSpan={3} className="px-2 py-2 text-[#A0A0A0]">No questions successfully parsed.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {batches.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#A0A0A0]">
                      No batches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#3A3A3A] bg-[#1E1E1E]">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 text-sm text-[#E8E8E8] bg-[#2D2D2D] rounded hover:bg-[#3A3A3A] disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-[#A0A0A0]">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 text-sm text-[#E8E8E8] bg-[#2D2D2D] rounded hover:bg-[#3A3A3A] disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
