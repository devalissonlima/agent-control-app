import React from 'react'
import { QrCode, X, RefreshCw, CheckCircle2 } from 'lucide-react'

interface QrCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSimulateReconnect: () => void
  isReconnecting: boolean
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  onSimulateReconnect,
  isReconnecting,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <QrCode className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Conexão com WhatsApp Web
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center text-center space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Abra o WhatsApp no seu celular, vá em{' '}
            <strong className="text-slate-800">Aparelhos Conectados</strong> e
            aponte a câmera para o código abaixo:
          </p>

          {/* QR Code Container Mock */}
          <div className="relative flex h-52 w-52 items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-slate-50 p-4 shadow-inner">
            {isReconnecting ? (
              <div className="flex flex-col items-center gap-2 text-indigo-600">
                <RefreshCw className="h-8 w-8 animate-spin" />
                <span className="text-xs font-bold">Validando sessão...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <QrCode className="h-32 w-32 text-slate-800" />
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  QR Code Pronto para Leitura
                </span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            A conexão é criptografada e opera em segundo plano 24 horas por dia.
          </p>

          <button
            type="button"
            disabled={isReconnecting}
            onClick={onSimulateReconnect}
            className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50"
          >
            {isReconnecting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Pareando com WhatsApp...</span>
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4" />
                <span>Simular Conexão Concluída</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QrCodeModal
