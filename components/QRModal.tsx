'use client';

import { useState, useEffect } from 'react';
import { CharacterConfig } from '@/config/characters';
import styles from './QRModal.module.css';

interface QRModalProps {
  character: CharacterConfig | null;
  onClose: () => void;
}

interface BankOption {
  value: string;
  label: string;
  code: string; // Bank code for API (e.g., "970415")
}

const banks: BankOption[] = [
  { value: 'ICB', label: '(970415) VietinBank', code: '970415' },
  { value: 'VCB', label: '(970436) Vietcombank', code: '970436' },
  { value: 'BIDV', label: '(970418) BIDV', code: '970418' },
  { value: 'VBA', label: '(970405) Agribank', code: '970405' },
  { value: 'OCB', label: '(970448) OCB', code: '970448' },
  { value: 'MB', label: '(970422) MBBank', code: '970422' },
  { value: 'TCB', label: '(970407) Techcombank', code: '970407' },
  { value: 'ACB', label: '(970416) ACB', code: '970416' },
  { value: 'VPB', label: '(970432) VPBank', code: '970432' },
  { value: 'TPB', label: '(970423) TPBank', code: '970423' },
  { value: 'STB', label: '(970403) Sacombank', code: '970403' },
  { value: 'HDB', label: '(970437) HDBank', code: '970437' },
  { value: 'VCCB', label: '(970454) VietCapitalBank', code: '970454' },
  { value: 'SCB', label: '(970429) SCB', code: '970429' },
  { value: 'VIB', label: '(970441) VIB', code: '970441' },
  { value: 'SHB', label: '(970443) SHB', code: '970443' },
  { value: 'EIB', label: '(970431) Eximbank', code: '970431' },
  { value: 'MSB', label: '(970426) MSB', code: '970426' },
  { value: 'CAKE', label: '(546034) CAKE', code: '546034' },
  { value: 'Ubank', label: '(546035) Ubank', code: '546035' },
  { value: 'VTLMONEY', label: '(971005) ViettelMoney', code: '971005' },
  { value: 'TIMO', label: '(963388) Timo', code: '963388' },
  { value: 'VNPTMONEY', label: '(971011) VNPTMoney', code: '971011' },
  { value: 'SGICB', label: '(970400) SaigonBank', code: '970400' },
  { value: 'BAB', label: '(970409) BacABank', code: '970409' },
  { value: 'momo', label: '(971025) MoMo', code: '971025' },
  { value: 'PVDB', label: '(971133) PVcomBank Pay', code: '971133' },
  { value: 'PVCB', label: '(970412) PVcomBank', code: '970412' },
  { value: 'MBV', label: '(970414) MBV', code: '970414' },
  { value: 'NCB', label: '(970419) NCB', code: '970419' },
  { value: 'SHBVN', label: '(970424) ShinhanBank', code: '970424' },
  { value: 'ABB', label: '(970425) ABBANK', code: '970425' },
  { value: 'VAB', label: '(970427) VietABank', code: '970427' },
  { value: 'NAB', label: '(970428) NamABank', code: '970428' },
  { value: 'PGB', label: '(970430) PGBank', code: '970430' },
  { value: 'VIETBANK', label: '(970433) VietBank', code: '970433' },
  { value: 'BVB', label: '(970438) BaoVietBank', code: '970438' },
  { value: 'SEAB', label: '(970440) SeABank', code: '970440' },
  { value: 'COOPBANK', label: '(970446) COOPBANK', code: '970446' },
  { value: 'LPB', label: '(970449) LPBank', code: '970449' },
  { value: 'KLB', label: '(970452) KienLongBank', code: '970452' },
  { value: 'KBank', label: '(668888) KBank', code: '668888' },
  { value: 'MAFC', label: '(977777) MAFC', code: '977777' },
  { value: 'HLBVN', label: '(970442) HongLeong', code: '970442' },
  { value: 'KEBHANAHN', label: '(970467) KEBHANAHN', code: '970467' },
  { value: 'KEBHANAHCM', label: '(970466) KEBHanaHCM', code: '970466' },
  { value: 'CITIBANK', label: '(533948) Citibank', code: '533948' },
  { value: 'CBB', label: '(970444) CBBank', code: '970444' },
  { value: 'CIMB', label: '(422589) CIMB', code: '422589' },
  { value: 'DBS', label: '(796500) DBSBank', code: '796500' },
  { value: 'Vikki', label: '(970406) Vikki', code: '970406' },
  { value: 'VBSP', label: '(999888) VBSP', code: '999888' },
  { value: 'GPB', label: '(970408) GPBank', code: '970408' },
  { value: 'KBHCM', label: '(970463) KookminHCM', code: '970463' },
  { value: 'KBHN', label: '(970462) KookminHN', code: '970462' },
  { value: 'WVN', label: '(970457) Woori', code: '970457' },
  { value: 'VRB', label: '(970421) VRB', code: '970421' },
  { value: 'HSBC', label: '(458761) HSBC', code: '458761' },
  { value: 'IBK - HN', label: '(970455) IBKHN', code: '970455' },
  { value: 'IBK - HCM', label: '(970456) IBKHCM', code: '970456' },
  { value: 'IVB', label: '(970434) IndovinaBank', code: '970434' },
  { value: 'UOB', label: '(970458) UnitedOverseas', code: '970458' },
  { value: 'NHB HN', label: '(801011) Nonghyup', code: '801011' },
  { value: 'SCVN', label: '(970410) StandardChartered', code: '970410' },
  { value: 'PBVN', label: '(970439) PublicBank', code: '970439' },
];

const templates = [
  { value: 'compact', label: 'compact' },
  { value: 'qr_only', label: 'qr_only' },
  { value: 'print', label: 'print' },
];

// Get bank code from selected bank value
const getBankCode = (value: string): string => {
  const bank = banks.find(b => b.value === value);
  return bank?.code || '';
};

export default function QRModal({ character, onClose }: QRModalProps) {
  const [bankId, setBankId] = useState<string>('');
  const [accountNo, setAccountNo] = useState<string>('');
  const [template, setTemplate] = useState<string>('qr_only');
  const [accountNoBlurred, setAccountNoBlurred] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when character changes
  useEffect(() => {
    setBankId('');
    setAccountNo('');
    setTemplate('qr_only');
    setAccountNoBlurred(false);
    setPreview(null);
    setResult(null);
    setError(null);
  }, [character?.id]);

  // Update preview when form values change (only if account number has been blurred)
  useEffect(() => {
    if (bankId && accountNo && template && accountNoBlurred) {
      const bankCode = getBankCode(bankId);
      if (bankCode) {
        const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNo}-${template}.png`;
        setPreview(qrUrl);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [bankId, accountNo, template, accountNoBlurred]);

  const handleGenerate = async () => {
    if (!bankId || !accountNo || !template) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!character) {
        setError('Vui lòng chọn nhân vật');
        return;
      }

      // Get bank code and fetch QR image from VietQR API
      const bankCode = getBankCode(bankId);
      if (!bankCode) {
        throw new Error('Mã ngân hàng không hợp lệ');
      }
      
      const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNo}-${template}.png`;
      const qrResponse = await fetch(qrUrl);
      
      if (!qrResponse.ok) {
        throw new Error('Không thể tải ảnh QR code');
      }

      const qrBlob = await qrResponse.blob();
      const qrFile = new File([qrBlob], 'qr.png', { type: 'image/png' });

      // Send to processing API
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
    } catch (err: any) {
      setError(err.message || 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result && character) {
      const link = document.createElement('a');
      link.href = result;
      link.download = `${character.id}_qr.jpg`;
      link.click();
    }
  };

  if (!character) {
    return (
      <div className={styles.inlineContainer}>
        <div className={styles.placeholder}>
          <p>Vui lòng chọn nhân vật ở trên</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.inlineContainer}>
      <div className={styles.header}>
        <h2>{character.name}</h2>
      </div>

      <div className={styles.content}>
        {!result ? (
          <>
            <div className={styles.formContainer}>
              <div className={styles.field}>
                <label className={styles.label}>Ngân hàng</label>
                <select
                  name="bank"
                  className={styles.input}
                  value={bankId}
                  onChange={(e) => setBankId(e.target.value)}
                >
                  <option value="">-- Chọn ngân hàng --</option>
                  {banks.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Số tài khoản</label>
                <input
                  name="accountNo"
                  type="text"
                  className={styles.input}
                  value={accountNo}
                  onChange={(e) => {
                    setAccountNo(e.target.value);
                    setAccountNoBlurred(false); // Reset khi đang nhập
                  }}
                  onBlur={() => {
                    if (accountNo.trim()) {
                      setAccountNoBlurred(true);
                    }
                  }}
                  placeholder="Nhập số tài khoản"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Template</label>
                <select
                  name="template"
                  className={styles.input}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                >
                  {templates.map((tpl) => (
                    <option key={tpl.value} value={tpl.value}>
                      {tpl.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {preview && (
              <div className={styles.previewContainer}>
                <img src={preview} alt="QR Preview" className={styles.previewImage} />
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <button
              className={styles.generateButton}
              onClick={handleGenerate}
              disabled={!bankId || !accountNo || !template || loading || !character}
              style={{
                opacity: !bankId || !accountNo || !template || loading || !character ? 0.6 : 1,
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
              >
                Tải xuống
              </button>
              <button
                className={styles.resetButton}
                onClick={() => {
                  setResult(null);
                  setPreview(null);
                  setBankId('');
                  setAccountNo('');
                  setTemplate('qr_only');
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
  );
}

