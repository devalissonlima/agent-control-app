import React from 'react'
import { MapPin, Star, Building2, Home } from 'lucide-react'
import type { Address } from '@/types/customer'

interface CustomerAddressListProps {
  addresses: Address[]
}

export const CustomerAddressList: React.FC<CustomerAddressListProps> = ({
  addresses,
}) => {
  const getLabelIcon = (label: string) => {
    const l = label.toLowerCase()
    if (l.includes('trab') || l.includes('escrit') || l.includes('estúd')) {
      return Building2
    }
    return Home
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Endereços Cadastrados ({addresses.length})
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          Extraídos e salvos pela IA
        </span>
      </div>

      <div className="space-y-2.5">
        {addresses.map((addr) => {
          const Icon = getLabelIcon(addr.label)
          return (
            <div
              key={addr.id}
              className={`rounded-xl border p-3.5 transition-colors ${
                addr.isPrimary
                  ? 'border-indigo-200 bg-indigo-50/40'
                  : 'border-slate-200/90 bg-white hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                      addr.isPrimary
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {addr.label}
                  </span>
                </div>

                {addr.isPrimary && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100/80 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                    <Star className="h-2.5 w-2.5 fill-indigo-800" />
                    Principal
                  </span>
                )}
              </div>

              <div className="mt-2 text-xs text-slate-700 leading-relaxed font-medium pl-8">
                <p>
                  {addr.street}, {addr.number}
                  {addr.complement ? ` (${addr.complement})` : ''}
                </p>
                <p className="text-slate-500 font-normal">
                  {addr.neighborhood} — {addr.city}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CustomerAddressList
