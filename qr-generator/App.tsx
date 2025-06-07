
import React, { useState, useCallback } from 'react';
import QRCode, { QRCodeToDataURLOptions } from 'qrcode';

// QRCodeToDataURLOptions interface is now imported from 'qrcode'

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    // Clear previous QR code and error when user types
    if (qrCodeDataUrl) setQrCodeDataUrl(null);
    if (error) setError(null);
  };

  const handleGenerateQrCode = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!url.trim()) {
      setError('有効なURLを入力してください。');
      setQrCodeDataUrl(null);
      return;
    }

    // Basic URL validation (starts with http/https)
    if (!url.match(/^(https?:\/\/)/i)) {
        setError('URLは "http://" または "https://" で始まる必要があります。');
        setQrCodeDataUrl(null);
        return;
    }

    setIsLoading(true);
    setError(null);
    setQrCodeDataUrl(null);

    try {
      const options: QRCodeToDataURLOptions = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.9,
        margin: 1,
        width: 300,
        color: {
          dark: '#0F172A', // slate-900
          light: '#FFFFFF',
        },
      };
      const dataUrl = await QRCode.toDataURL(url, options);
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      console.error('QRコード生成エラー:', err);
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました。';
      setError(`QRコードの生成に失敗しました: ${errorMessage}`);
      setQrCodeDataUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
  );
  
  const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-.879-.878a2 2 0 112.828-2.828l.172.171a.5.5 0 00.707-.707l-.172-.171a3.5 3.5 0 00-4.95-4.95l-3 3a3.5 3.5 0 000 4.95l.879.878a3.5 3.5 0 004.95 0l.353-.353a.5.5 0 00-.707-.707l-.353.353a2.5 2.5 0 01-3.536 0l-.879-.878a2.5 2.5 0 010-3.536l3-3a2.5 2.5 0 013.536 0zm-5.172 6.828a.5.5 0 00.707.707l.171-.171a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-.878-.879a2 2 0 112.828-2.828l.171.172z" clipRule="evenodd" />
    </svg>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-sky-900 flex flex-col items-center justify-center p-4 text-slate-100 selection:bg-sky-500 selection:text-white">
      <div className="bg-slate-800 bg-opacity-80 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-10 w-full max-w-lg transform transition-all duration-500 ease-in-out">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            QRコードジェネレーター
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            URLを入力して、瞬時にQRコードを生成します。
          </p>
        </header>

        <form onSubmit={handleGenerateQrCode} className="space-y-6">
          <div>
            <label htmlFor="urlInput" className="block text-sm font-medium text-sky-300 mb-1">
              URLを入力
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="urlInput"
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="例: https://www.example.com"
                className="w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors duration-200 placeholder-slate-500"
                required
                aria-label="URL入力フィールド"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="QRコードを生成するボタン"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                生成中...
              </>
            ) : (
              'QRコードを生成'
            )}
          </button>
        </form>

        {error && (
          <div role="alert" aria-live="assertive" className="mt-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-lg text-center">
            <p className="font-medium">エラー</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {qrCodeDataUrl && !error && (
          <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col items-center space-y-5">
            <h2 className="text-xl font-semibold text-sky-300">生成されたQRコード</h2>
            <div className="p-2 bg-white rounded-lg shadow-lg inline-block">
              <img 
                src={qrCodeDataUrl} 
                alt="生成されたQRコード" 
                className="w-56 h-56 md:w-64 md:h-64 object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 break-all max-w-xs text-center" aria-label="ソースURL">
              <span className="font-medium">ソースURL:</span> {url}
            </p>
            <a
              href={qrCodeDataUrl}
              download="qrcode.png"
              className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out"
              aria-label="生成されたQRコードをダウンロード"
            >
              <DownloadIcon className="w-5 h-5 mr-2" aria-hidden="true" />
              ダウンロード
            </a>
          </div>
        )}
      </div>
      <footer className="text-center mt-10 text-slate-500 text-xs">
        <p>&copy; {new Date().getFullYear()} QRコードジェネレーター. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
