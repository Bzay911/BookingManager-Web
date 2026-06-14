import { upload, ImageKitAbortError, ImageKitInvalidRequestError, ImageKitUploadNetworkError, ImageKitServerError } from '@imagekit/react';
import { useRef, useState } from 'react';

const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

interface UploadedImage {
  fileId: string;
  url: string;
  name: string;
}

interface ImageUploaderProps {
  multiple?: boolean;
  folder?: string;
  onUploadSuccess?: (image: UploadedImage) => void; // fires once PER file
}

export default function ImageUploader({
  multiple = false,
  folder = '/uploads',
  onUploadSuccess,
}: ImageUploaderProps) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAuthParams = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/imagekit/auth`);
    if (!response.ok) throw new Error('Failed to get auth params');
    return response.json() as Promise<{ token: string; expire: number; signature: string }>;
  };

  const handleUpload = async () => {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    setError(null);
    setProgress(0);
    setUploading(true);
    abortControllerRef.current = new AbortController();

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const { token, expire, signature } = await fetchAuthParams();

        const response = await upload({
          file,
          fileName: file.name,
          publicKey: IMAGEKIT_PUBLIC_KEY,
          signature,
          expire,
          token,
          folder,
          onProgress: (e) => {
            const fileProgress = e.loaded / e.total;
            setProgress(Math.round(((i + fileProgress) / fileArray.length) * 100));
          },
          abortSignal: abortControllerRef.current.signal,
        });

        const uploaded = {
          fileId: response.fileId ?? '',
          url: response.url ?? '',
          name: response.name ?? '',
        };

        setUploadedImages((prev) => [...prev, uploaded]);
        onUploadSuccess?.(uploaded); // notify parent for EACH file
      }

      if (fileInputRef.current) fileInputRef.current.value = '';
      setProgress(0);
    } catch (err) {
      if (err instanceof ImageKitAbortError) {
        setError('Upload cancelled.');
      } else if (err instanceof ImageKitInvalidRequestError) {
        setError('Invalid request. Check your file and try again.');
      } else if (err instanceof ImageKitUploadNetworkError) {
        setError('Network error. Check your connection.');
      } else if (err instanceof ImageKitServerError) {
        setError('ImageKit server error. Try again later.');
      } else {
        setError('Something went wrong.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => abortControllerRef.current?.abort();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          disabled={uploading}
          className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="ml-auto px-4 py-2 rounded-xl bg-black text-white text-xs font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {uploading && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>

      {uploading && (
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-black h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {uploadedImages.map((img) => (
            <div
              key={img.fileId}
              className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}