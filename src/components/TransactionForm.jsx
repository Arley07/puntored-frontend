import React, { useEffect, useState } from 'react'
import { buyTopup, fetchSuppliers, createManualTransaction } from '../api/transactions.js'

export default function TransactionForm() {
  const [mode, setMode] = useState('buy') 
  const [suppliers, setSuppliers] = useState([])
  const [supplierId, setSupplierId] = useState('8753')
  const [cellPhone, setCellPhone] = useState('3123450024')
  const [value, setValue] = useState(15000)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSuppliers().then(setSuppliers).catch(() => {})
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setResult(null); setLoading(true)
    try {
      const payload = { supplierId: String(supplierId), cellPhone, value: Number(value) }
      if (mode === 'buy') {
        const data = await buyTopup(payload)
        setResult({ type: 'buy', data })
      } else {
        const data = await createManualTransaction(payload)
        setResult({ type: 'manual', data })
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Error'
      setError(String(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex gap-2 mb-4">
        <button className={`px-3 py-1.5 rounded-lg border ${mode==='buy' ? 'bg-indigo-600 text-white' : 'bg-white'}`} onClick={() => setMode('buy')}>Recarga Puntored</button>
        <button className={`px-3 py-1.5 rounded-lg border ${mode==='manual' ? 'bg-indigo-600 text-white' : 'bg-white'}`} onClick={() => setMode('manual')}>Crear Manual</button>
      </div>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Proveedor</label>
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={supplierId}
            onChange={e => setSupplierId(e.target.value)}
          >
            <option value="">Seleccione…</option>
            {suppliers?.map((s, i) => {
              const id = s?.id ?? s?.supplierId ?? s?.code ?? String(i)
              const name = s?.name ?? s?.supplierName ?? `Supplier ${id}`
              return <option key={id} value={id}>{name} ({id})</option>
            })}
            {/* fallback default */}
            <option value="8753">Claro (8753)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Celular</label>
          <input className="w-full rounded-lg border px-3 py-2" value={cellPhone} onChange={e => setCellPhone(e.target.value)} placeholder="3XXXXXXXXX" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valor</label>
          <input type="number" min="1000" max="100000" step="1000" className="w-full rounded-lg border px-3 py-2" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div className="flex items-end">
          <button disabled={loading} className="w-full md:w-auto rounded-lg bg-indigo-600 text-white px-4 py-2.5 hover:bg-indigo-700 disabled:opacity-60">
            {loading ? 'Procesando…' : mode === 'buy' ? 'Comprar' : 'Crear'}
          </button>
        </div>
      </form>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      {result?.type === 'buy' && (
        <div className="mt-4 rounded-lg border p-4 bg-slate-50">
          <div className="font-semibold mb-2">Resumen de compra</div>
          <div className="text-sm">Mensaje: <span className="font-medium">{result.data.message}</span></div>
          <div className="text-sm">Ticket: <span className="font-mono">{result.data.transactionalId}</span></div>
          <div className="text-sm">Celular: {result.data.cellPhone}</div>
          <div className="text-sm">Valor: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(result.data.value)}</div>
        </div>
      )}

      {result?.type === 'manual' && (
        <div className="mt-4 rounded-lg border p-4 bg-slate-50">
          <div className="font-semibold mb-2">Transacción creada</div>
          <div className="text-sm">ID: <span className="font-mono">{result.data.id}</span></div>
          <div className="text-sm">Estado: {result.data.status}</div>
          <div className="text-sm">Proveedor: {result.data.supplierId}</div>
          <div className="text-sm">Celular: {result.data.cellPhone}</div>
          <div className="text-sm">Valor: {result.data.value}</div>
        </div>
      )}
    </div>
  )
}
