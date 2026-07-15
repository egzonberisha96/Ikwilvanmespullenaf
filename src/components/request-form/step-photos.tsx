"use client";

import { UploadDropzone } from "@/lib/uploadthing-components";
import { X, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface Photo {
  url: string;
  key?: string;
}

export function StepPhotos({ photos, onChange }: { photos: Photo[]; onChange: (p: Photo[]) => void }) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-ink-950">Upload foto&apos;s</h2>
      <p className="mb-6 text-sm text-ink-600">
        Voeg minimaal 1 en maximaal 10 duidelijke foto&apos;s toe. Dit geeft partners een goed beeld van je spullen.
      </p>

      {photos.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((p, i) => (
            <div key={p.url} className="group relative aspect-square overflow-hidden rounded-xl border border-ink-100">
              <Image src={p.url} alt={`Foto ${i + 1}`} fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => onChange(photos.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length < 10 ? (
        <UploadDropzone
          endpoint="requestPhotos"
          onClientUploadComplete={(res) => {
            const newPhotos = res.map((f: any) => ({ url: f.url, key: f.key }));
            onChange([...photos, ...newPhotos].slice(0, 10));
            toast.success("Foto's geüpload");
          }}
          onUploadError={(error: Error) => {
            toast.error(`Upload mislukt: ${error.message}`);
          }}
          appearance={{
            container: "border-2 border-dashed border-ink-200 rounded-xl py-8 bg-ink-50",
            button: "bg-brand-600 hover:bg-brand-700 text-sm",
            label: "text-ink-700 text-sm",
            allowedContent: "text-ink-400 text-xs",
          }}
        />
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-500">
          <ImageIcon size={16} /> Maximaal aantal foto&apos;s (10) bereikt.
        </div>
      )}
    </div>
  );
}
