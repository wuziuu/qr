'use client';

import { useState, useRef } from 'react';
import { CharacterConfig } from '@/config/characters';
import styles from './QRModal.module.css';

interface QRModalProps {
  character: CharacterConfig;
  onClose: () => void;
}

export default function QRModal({ character, onClose }: QRModalProps) {
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!qrFile) {
      setError('Vui lòng chọn file QR code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('qr_image', qrFile);
      formData.append('character_id', character.id);

      const response = await fetch('/api/process-qr', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.image);
      } else {
        setError(data.error || 'Có lỗi xảy ra khi xử lý ảnh');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result;
      link.download = `${character.id}_qr.jpg`;
      link.click();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.header}>
          <h2>{character.name}</h2>
          <div
            className={styles.colorIndicator}
            style={{ backgroundColor: character.color.hex }}
          />
        </div>

        <div className={styles.content}>
          {!result ? (
            <>
              <div
                className={styles.uploadArea}
                onClick={() => fileInputRef.current?.click()}
                style={{ borderColor: character.color.hex }}
              >
                {preview ? (
                  <img src={preview} alt="QR Preview" className={styles.previewImage} />
                ) : (
                  <div className={styles.uploadText}>
                    <p>Click để chọn QR Code</p>
                    <span>Hoặc kéo thả file vào đây</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />

              {error && <div className={styles.error}>{error}</div>}

              <button
                className={styles.generateButton}
                onClick={handleGenerate}
                disabled={!qrFile || loading}
                style={{
                  backgroundColor: character.color.hex,
                  opacity: !qrFile || loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Đang xử lý...' : 'Tạo QR Code'}
              </button>
            </>
          ) : (
            <>
              <div className={styles.resultContainer}>
                <img src={result} alt="Result" className={styles.resultImage} />
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.downloadButton}
                  onClick={handleDownload}
                  style={{ backgroundColor: character.color.hex }}
                >
                  Tải xuống
                </button>
                <button
                  className={styles.resetButton}
                  onClick={() => {
                    setResult(null);
                    setPreview(null);
                    setQrFile(null);
                  }}
                >
                  Tạo lại
                </button>
              </div>
            </>
          )}
        </div>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <p>Đang xử lý ảnh...</p>
          </div>
        )}
      </div>
    </div>
  );
}

