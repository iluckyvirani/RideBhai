import React, { useRef, useState } from 'react';
import { Camera, Images, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { isPreviewableImage, uploadToCloudinary } from '../../lib/upload';

export function FilePick({
  label,
  value,
  onChange,
  capture,
}: {
  label: string;
  value?: string;
  onChange: (dataUrl: string, name: string) => void;
  capture?: 'user' | 'environment';
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState('');

  const shown = localPreview || value || '';
  const image = isPreviewableImage(shown);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    let blob = '';
    if (file.type.startsWith('image/')) {
      blob = URL.createObjectURL(file);
      setLocalPreview(blob);
    }
    setUploading(true);
    try {
      const uploaded = await uploadToCloudinary(file);
      onChange(uploaded.url, uploaded.name);
      setLocalPreview('');
    } catch (err) {
      setLocalPreview('');
      window.alert((err as Error).message || 'Upload failed. Add Cloudinary keys in server/.env');
    } finally {
      setUploading(false);
      if (blob) URL.revokeObjectURL(blob);
    }
  };

  return (
    <div>
      <p className="text-[10px] font-extrabold uppercase text-[#6B6B6B] mb-1">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture={capture || 'environment'}
          className="hidden"
          onChange={async (e) => {
            await handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={async (e) => {
            await handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => cameraRef.current?.click()}
          className="flex items-center justify-center gap-1 py-2 rounded-xl bg-[#1C1C1C] text-white text-[10px] font-extrabold disabled:opacity-50"
        >
          <Camera className="w-3 h-3" /> Camera
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={() => galleryRef.current?.click()}
          className="flex items-center justify-center gap-1 py-2 rounded-xl bg-[#FFF0EB] text-[#F15A24] text-[10px] font-extrabold disabled:opacity-50"
        >
          <Images className="w-3 h-3" /> Gallery
        </button>
      </div>
      {(shown || uploading) && (
        <div className="relative mt-2 rounded-2xl overflow-hidden border border-[#EBE5D8] bg-white min-h-[88px]">
          {image ? (
            <img src={shown} alt="" className="w-full h-28 object-cover" />
          ) : value ? (
            <div className="h-20 flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-[#1C1C1C]">
              <FileText className="w-4 h-4 text-[#F15A24]" /> Document attached
            </div>
          ) : (
            <div className="h-20" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-[#1C1C1C]/55 flex flex-col items-center justify-center gap-1.5 text-white">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="text-[11px] font-extrabold">Uploading…</p>
            </div>
          )}
          {!uploading && value && (
            <p className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-extrabold text-[#00A86B] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Attached
            </p>
          )}
        </div>
      )}
    </div>
  );
}
