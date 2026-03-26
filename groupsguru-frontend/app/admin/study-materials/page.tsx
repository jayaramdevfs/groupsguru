"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Modal from "@/components/ui/Modal";
import CustomSelect from "@/components/ui/CustomSelect";
import { contentApi } from "@/lib/content";
import { StudyMaterial } from "@/lib/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ENTITY_TYPES = ["COMMISSION", "CATEGORY", "SUB_CATEGORY", "SECTION", "TOPIC", "MICRO_TOPIC"];
const FILE_TYPES = ["PDF", "TEXT", "IMAGE"];
const ACCESS_TYPES = ["FREE", "PAID"];

type ModalMode = "CREATE" | "EDIT";

interface MaterialFormData {
  title: string;
  titleTe: string;
  description: string;
  descriptionTe: string;
  entityType: string;
  entityId: string;
  fileType: string;
  accessType: string;
  priceInr: string;
  isPublished: boolean;
  displayOrder: string;
}

const emptyForm: MaterialFormData = {
  title: "",
  titleTe: "",
  description: "",
  descriptionTe: "",
  entityType: "TOPIC",
  entityId: "",
  fileType: "PDF",
  accessType: "FREE",
  priceInr: "",
  isPublished: true,
  displayOrder: "0",
};

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

export default function AdminContentPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [filterEntityType, setFilterEntityType] = useState("ALL");
  const [filterEntityId, setFilterEntityId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("CREATE");
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);
  const [formData, setFormData] = useState<MaterialFormData>(emptyForm);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasEntityFilter = useMemo(
    () => filterEntityType !== "ALL" && filterEntityId.trim().length > 0 && !Number.isNaN(Number(filterEntityId)),
    [filterEntityType, filterEntityId]
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const listPromise = hasEntityFilter
        ? contentApi.getByEntity(filterEntityType, Number(filterEntityId))
        : contentApi.getAll(0, 200).then((result) => result.content);

      const [count, list] = await Promise.all([contentApi.getCount(), listPromise]);
      setTotalCount(count);
      setMaterials(list);
    } catch (error) {
      console.error("Failed to fetch study materials", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterEntityId, filterEntityType, hasEntityFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetModal = () => {
    setFormData(emptyForm);
    setSelectedFile(null);
    setEditingMaterial(null);
    setModalMode("CREATE");
  };

  const handleCreate = () => {
    resetModal();
    setModalMode("CREATE");
    setIsModalOpen(true);
  };

  const handleEdit = (material: StudyMaterial) => {
    setModalMode("EDIT");
    setEditingMaterial(material);
    setSelectedFile(null);
    setFormData({
      title: material.title || "",
      titleTe: material.titleTe || "",
      description: material.description || "",
      descriptionTe: material.descriptionTe || "",
      entityType: material.entityType || "TOPIC",
      entityId: material.entityId?.toString() || "",
      fileType: material.fileType || "PDF",
      accessType: material.accessType || "FREE",
      priceInr: material.priceInr?.toString() || "",
      isPublished: material.isPublished ?? true,
      displayOrder: material.displayOrder?.toString() || "0",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this material?")) return;
    try {
      await contentApi.delete(id);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete material", error);
    }
  };

  const handlePublishToggle = async (material: StudyMaterial) => {
    try {
      await contentApi.update(material.id, { isPublished: !(material.isPublished ?? true) });
      await fetchData();
    } catch (error) {
      console.error("Failed to toggle publish", error);
    }
  };

  const onFileChosen = (file?: File | null) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    onFileChosen(file);
  };

  const toPayload = () => {
    const parsedEntityId = Number(formData.entityId);
    const parsedDisplayOrder = Number(formData.displayOrder || 0);
    const parsedPrice = Number(formData.priceInr || 0);

    return {
      title: formData.title.trim(),
      titleTe: formData.titleTe.trim() || undefined,
      description: formData.description.trim() || undefined,
      descriptionTe: formData.descriptionTe.trim() || undefined,
      entityType: formData.entityType,
      entityId: parsedEntityId,
      fileType: formData.fileType,
      accessType: formData.accessType,
      priceInr: formData.accessType === "PAID" ? parsedPrice : 0,
      isPublished: formData.isPublished,
      displayOrder: Number.isNaN(parsedDisplayOrder) ? 0 : parsedDisplayOrder,
    };
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }
    if (!formData.entityId.trim() || Number.isNaN(Number(formData.entityId))) {
      alert("Valid Entity ID is required");
      return;
    }

    try {
      const payload = toPayload();
      if (modalMode === "CREATE") {
        if (!selectedFile) {
          alert("Please choose a file before uploading.");
          return;
        }
        await contentApi.upload(payload, selectedFile);
      } else if (editingMaterial) {
        await contentApi.update(editingMaterial.id, payload);
      }
      setIsModalOpen(false);
      resetModal();
      await fetchData();
    } catch (error) {
      console.error("Failed to save study material", error);
    }
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="max-w-[1200px] mx-auto py-12 px-6">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Content Management</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              Study <span className="text-[#D97706]">Materials</span>
            </h1>
          </div>

          <div className="flex gap-3">
            <div className="bg-[#1C1C1C] border border-[#3A3A3A] px-4 py-2 rounded flex flex-col items-center min-w-[110px]">
              <span className="text-[8px] font-mono font-bold text-[#666666] uppercase tracking-widest">Total Files</span>
              <span className="text-lg font-mono font-bold text-[#E8E8E8]">{totalCount}</span>
            </div>
            <button
              onClick={handleCreate}
              className="px-6 py-3 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors"
            >
              Upload Material
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Entity Type</label>
            <CustomSelect
              options={[{ value: "ALL", label: "ALL ENTITIES" }, ...ENTITY_TYPES.map((entity) => ({ value: entity, label: entity }))]}
              value={filterEntityType}
              onChange={(value) => setFilterEntityType(value.toString())}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Entity ID</label>
            <input
              type="number"
              value={filterEntityId}
              onChange={(event) => setFilterEntityId(event.target.value)}
              placeholder="e.g. 5"
              className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-3 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => fetchData()}
              className="px-5 py-3 rounded border border-[#3A3A3A] text-[#E8E8E8] hover:border-[#D97706]/50 transition-colors"
            >
              Apply Filter
            </button>
            <button
              onClick={() => {
                setFilterEntityType("ALL");
                setFilterEntityId("");
              }}
              className="px-5 py-3 rounded border border-[#3A3A3A] text-[#A0A0A0] hover:border-[#666666] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="border border-[#3A3A3A] rounded bg-[#1C1C1C] overflow-hidden">
          {isLoading ? (
            <div className="p-20 flex justify-center">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#3A3A3A] bg-[#141414]">
                    <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Title</th>
                    <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Entity</th>
                    <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">File</th>
                    <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Published</th>
                    <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material) => (
                    <tr key={material.id} className="border-b border-[#3A3A3A] hover:bg-[#1E1E1E] transition-colors">
                      <td className="p-4">
                        <div className="text-[#E8E8E8] font-bold">{material.title}</div>
                        {material.titleTe && <div className="text-xs text-[#A0A0A0] mt-1">{material.titleTe}</div>}
                      </td>
                      <td className="p-4 text-sm text-[#A0A0A0]">
                        <div>{material.entityType}</div>
                        <div className="text-xs text-[#666666] mt-1">ID: {material.entityId}</div>
                      </td>
                      <td className="p-4 text-sm text-[#A0A0A0]">
                        <div>{material.fileType || "FILE"}</div>
                        <div className="text-xs text-[#666666] mt-1">{formatFileSize(material.fileSize)}</div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handlePublishToggle(material)}
                          className={`px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider transition-colors ${
                            material.isPublished
                              ? "border-[#3D9A5F]/30 text-[#3D9A5F] bg-[#3D9A5F]/10"
                              : "border-[#3A3A3A] text-[#666666] bg-[#141414]"
                          }`}
                        >
                          {material.isPublished ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(material)}
                            className="px-3 py-1 rounded border border-[#3A3A3A] text-[#E8E8E8] hover:border-[#666666] transition-colors text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(material.id)}
                            className="px-3 py-1 rounded border border-[#C74444]/30 text-[#C74444] hover:bg-[#C74444]/10 transition-colors text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {materials.length === 0 && (
                <div className="p-16 text-center text-[#666666] font-mono text-[10px] uppercase tracking-widest">
                  No materials found
                </div>
              )}
            </div>
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetModal();
          }}
          title={modalMode === "CREATE" ? "Upload Study Material" : "Edit Study Material"}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                  className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-3 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                  Title Telugu
                </label>
                <input
                  type="text"
                  value={formData.titleTe}
                  onChange={(event) => setFormData({ ...formData, titleTe: event.target.value })}
                  className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-3 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                  Entity Type
                </label>
                <CustomSelect
                  options={ENTITY_TYPES.map((entity) => ({ value: entity, label: entity }))}
                  value={formData.entityType}
                  onChange={(value) => setFormData({ ...formData, entityType: value.toString() })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                  Entity ID
                </label>
                <input
                  type="number"
                  value={formData.entityId}
                  onChange={(event) => setFormData({ ...formData, entityId: event.target.value })}
                  className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-3 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                  File Type
                </label>
                <CustomSelect
                  options={FILE_TYPES.map((type) => ({ value: type, label: type }))}
                  value={formData.fileType}
                  onChange={(value) => setFormData({ ...formData, fileType: value.toString() })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                  Access Type
                </label>
                <CustomSelect
                  options={ACCESS_TYPES.map((type) => ({ value: type, label: type }))}
                  value={formData.accessType}
                  onChange={(value) => setFormData({ ...formData, accessType: value.toString() })}
                />
              </div>
            </div>

            {formData.accessType === "PAID" && (
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                  Price (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceInr}
                  onChange={(event) => setFormData({ ...formData, priceInr: event.target.value })}
                  className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-3 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(event) => setFormData({ ...formData, displayOrder: event.target.value })}
                  className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-3 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                  Publish Status
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                  className={`w-full p-3 rounded border text-sm font-bold transition-colors ${
                    formData.isPublished
                      ? "border-[#3D9A5F]/30 text-[#3D9A5F] bg-[#3D9A5F]/10"
                      : "border-[#3A3A3A] text-[#A0A0A0] bg-[#141414]"
                  }`}
                >
                  {formData.isPublished ? "Published" : "Draft"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                className="w-full min-h-[100px] bg-[#141414] border border-[#3A3A3A] rounded p-3 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                Description Telugu
              </label>
              <textarea
                value={formData.descriptionTe}
                onChange={(event) => setFormData({ ...formData, descriptionTe: event.target.value })}
                className="w-full min-h-[100px] bg-[#141414] border border-[#3A3A3A] rounded p-3 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
                File Upload
              </label>
              <div
                onDragOver={(event) => {
                  if (modalMode === "EDIT") return;
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => modalMode !== "EDIT" && setIsDragging(false)}
                onDrop={(event) => {
                  if (modalMode === "EDIT") return;
                  handleDrop(event);
                }}
                onClick={() => modalMode === "CREATE" && fileInputRef.current?.click()}
                className={`border rounded p-6 text-center transition-colors ${
                  modalMode === "EDIT" ? "cursor-not-allowed opacity-60 border-[#3A3A3A] bg-[#141414]" :
                  isDragging ? "cursor-pointer border-[#D97706] bg-[#D97706]/5" : "cursor-pointer border-[#3A3A3A] bg-[#141414]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.png,.jpg,.jpeg"
                  disabled={modalMode === "EDIT"}
                  className="hidden"
                  onChange={(event) => onFileChosen(event.target.files?.[0] || null)}
                />
                <p className="text-sm text-[#E8E8E8]">
                  {modalMode === "CREATE" ? "Drag and drop a file here, or click to browse" : "File replacement is disabled in edit mode"}
                </p>
                <p className="text-xs text-[#666666] mt-1">Accepted: .pdf .txt .png .jpg .jpeg</p>
                {selectedFile && (
                  <div className="mt-3 text-xs text-[#D97706] font-mono">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors"
            >
              {modalMode === "CREATE" ? "Upload Material" : "Save Changes"}
            </button>
          </form>
        </Modal>
      </div>
    </ProtectedLayout>
  );
}
