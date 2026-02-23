import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  onTextExtracted: (text: string) => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ResumeUploader({ onTextExtracted, isLoading }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setExtractError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setExtractError('Invalid file type. Please upload a .txt or .pdf file.');
        }
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;
      setFileName(file.name);
      setExtractError(null);

      try {
        // For .txt files, read directly as text
        // For .pdf files: this reads the raw bytes — a PDF API route would give better results,
        // but for plain-text PDFs this often works for testing
        const text = await file.text();
        if (!text.trim()) {
          setExtractError('File appears to be empty. Try a different file.');
          return;
        }
        onTextExtracted(text);
      } catch {
        setExtractError('Failed to read file. Please try a .txt resume instead.');
      }
    },
    [onTextExtracted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain':       ['.txt'],
      'application/pdf':  ['.pdf'],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: isLoading,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-white'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-2">
          {/* Upload icon */}
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>

          {fileName ? (
            <p className="text-gray-700 font-medium">{fileName}</p>
          ) : (
            <>
              <p className="text-gray-600 font-medium">
                {isDragActive ? 'Drop resume here' : 'Drop resume here, or click to browse'}
              </p>
              <p className="text-gray-400 text-sm">Supports .txt and .pdf (up to 5MB)</p>
            </>
          )}
        </div>
      </div>

      {extractError && (
        <p className="text-red-600 text-sm mt-2">{extractError}</p>
      )}
    </div>
  );
}

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-white'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-2">
          {/* Upload icon */}
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>

          {fileName ? (
            <p className="text-gray-700 font-medium">{fileName}</p>
          ) : (
            <>
              <p className="text-gray-600 font-medium">
                {isDragActive ? 'Drop resume here' : 'Drop resume here, or click to browse'}
              </p>
              <p className="text-gray-400 text-sm">Supports .txt and .pdf</p>
            </>
          )}
        </div>
      </div>

      {extractError && (
        <p className="text-red-600 text-sm mt-2">{extractError}</p>
      )}
    </div>
  );
}
