"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Multilang } from "@/components/ui/Multilang";
import { contentApi } from "@/lib/content";
import { StudyMaterial } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return `${value.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

function StudentContentContent() {
  const searchParams = useSearchParams();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const entityType = useMemo(() => searchParams.get("entityType")?.toUpperCase() || "", [searchParams]);
  const entityId = useMemo(() => Number(searchParams.get("entityId") || ""), [searchParams]);
  const hasValidQuery = entityType.length > 0 && !Number.isNaN(entityId) && entityId > 0;

  const fetchMaterials = useCallback(async () => {
    if (!hasValidQuery) {
      setMaterials([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await contentApi.getPublishedByEntity(entityType, entityId);
      setMaterials(data);
    } catch (error) {
      console.error("Failed to load study materials", error);
    } finally {
      setIsLoading(false);
    }
  }, [entityId, entityType, hasValidQuery]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="max-w-[1000px] mx-auto py-12 px-6">
        <header className="mb-12 border-b border-[#3A3A3A] pb-8">
          <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold uppercase tracking-widest mb-4">
            Study Library
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-2">
            Content <span className="text-[#D97706]">Browse</span>
          </h1>
          <p className="text-sm text-[#A0A0A0] font-mono uppercase tracking-widest">
            {hasValidQuery ? `${entityType} / ${entityId}` : "Pass entityType and entityId query params to load materials"}
          </p>
        </header>

        {!hasValidQuery && (
          <div className="text-center py-16 bg-[#1E1E1E] border border-[#3A3A3A] rounded">
            <p className="text-[#666666] font-mono text-[10px] uppercase tracking-widest">
              Example: /student/content?entityType=TOPIC&entityId=5
            </p>
          </div>
        )}

        {hasValidQuery && (
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-20 bg-[#1E1E1E] border border-[#3A3A3A] rounded">
                <p className="text-[#666666] font-mono text-[10px] uppercase tracking-widest">No published materials available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.map((material) => {
                  const isPaid = material.accessType?.toUpperCase() === "PAID";
                  return (
                    <article
                      key={material.id}
                      className="bg-[#1E1E1E] border border-[#3A3A3A] rounded p-6 flex flex-col gap-5 hover:border-[#666666] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-[#E8E8E8]">
                            <Multilang en={material.title} te={material.titleTe || material.title} />
                          </h2>
                          <p className="text-xs text-[#A0A0A0] mt-2">
                            <Multilang en={material.description || "Study reference material"} te={material.descriptionTe || material.description || "Study reference material"} />
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded border border-[#3A3A3A] text-[10px] font-mono uppercase text-[#666666]">
                          {material.fileType || "FILE"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
                        <span>Size: {formatFileSize(material.fileSize)}</span>
                        <span>{material.entityType} / {material.entityId}</span>
                      </div>

                      {isPaid ? (
                        <div className="px-4 py-3 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-sm font-bold flex items-center justify-between">
                          <span className="inline-flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <rect x="4" y="10" width="16" height="10" rx="2" />
                              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            </svg>
                            Locked
                          </span>
                          <span>INR {material.priceInr ?? 0}</span>
                        </div>
                      ) : (
                        <a
                          href={contentApi.downloadUrl(material.id)}
                          className="inline-flex items-center justify-center px-4 py-3 rounded border border-[#3A3A3A] text-[#E8E8E8] hover:border-[#D97706]/50 transition-colors text-sm font-bold"
                        >
                          Download
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}

export default function StudentContentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#191919] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <StudentContentContent />
    </Suspense>
  );
}
