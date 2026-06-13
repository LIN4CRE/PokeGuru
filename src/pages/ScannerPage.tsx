import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Search, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Card Scanner Page
 * 
 * NOTE: Full OCR functionality with Tesseract.js would require additional
 * setup and the library is quite large (~3MB). This implementation provides
 * the UI and basic image capture functionality.
 * 
 * For production use, consider:
 * 1. Loading Tesseract.js on-demand
 * 2. Using a Web Worker for OCR processing
 * 3. Adding image preprocessing for better OCR accuracy
 */

export default function ScannerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
      // In a full implementation, this would trigger OCR processing
      simulateOCR(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCameraCapture = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  }, []);

  const handleFileUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.click();
    }
  }, []);

  // Simulated OCR processing
  // In production, this would use Tesseract.js or a similar library
  const simulateOCR = async (_imageData: string) => {
    setIsProcessing(true);
    setExtractedText('');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, show a helpful message
    setExtractedText('');
    setIsProcessing(false);
    setError('OCR functionality requires Tesseract.js integration. Please use the search feature to find cards by name.');
  };

  const handleSearch = (text: string) => {
    if (text.trim()) {
      navigate(`/search?q=${encodeURIComponent(text.trim())}`);
    }
  };

  const reset = () => {
    setImage(null);
    setExtractedText('');
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Card Scanner</h1>
        <p className="mt-1 text-[var(--muted)]">
          Take a photo or upload an image to identify a Pokémon card
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Select image"
      />

      {!image ? (
        /* Initial State - Show capture options */
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-[var(--bg-soft)] p-6">
              <Camera size={48} className="text-[var(--muted)]" />
            </div>
            <p className="text-center text-[var(--muted)]">
              Capture or upload an image of a Pokémon card to search for it
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleCameraCapture}
                className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 font-medium text-white hover:bg-[#dc2626] transition-colors"
              >
                <Camera size={18} />
                Take Photo
              </button>
              <button
                onClick={handleFileUpload}
                className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-5 py-2.5 font-medium text-[var(--text)] hover:border-[var(--accent)] transition-colors"
              >
                <Upload size={18} />
                Upload Image
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview State */
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)]">
            <img
              src={image}
              alt="Captured card"
              className="w-full object-contain"
              style={{ maxHeight: '400px' }}
            />
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="flex flex-col items-center gap-3 text-white">
                  <Loader2 size={32} className="animate-spin" />
                  <span>Analyzing image...</span>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Extracted Text */}
          {extractedText && (
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <h3 className="mb-2 text-sm font-medium text-[var(--muted)]">
                Detected Card Name
              </h3>
              <p className="text-lg font-semibold text-[var(--text)]">{extractedText}</p>
              <button
                onClick={() => handleSearch(extractedText)}
                className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-white hover:bg-[#dc2626] transition-colors"
              >
                <Search size={16} />
                Search for this card
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <button
              onClick={reset}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)] transition-colors"
            >
              Try Another Image
            </button>
          </div>
        </div>
      )}

      {/* Manual Search Hint */}
      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--muted)]">
          Can't scan? Try{' '}
          <a href="/search" className="text-[var(--link)] hover:underline">
            searching manually
          </a>
        </p>
      </div>
    </div>
  );
}
