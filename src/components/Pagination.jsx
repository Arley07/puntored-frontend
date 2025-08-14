import React from 'react'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const go = (p) => {
    if (p >= 0 && p < totalPages && p !== page) onChange(p)
  }

  const pages = []
  for (let i = 0; i < totalPages; i++) pages.push(i)

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button className="px-3 py-1.5 border rounded-lg" onClick={() => go(page - 1)} disabled={page === 0}>Anterior</button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`px-3 py-1.5 border rounded-lg ${p === page ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-50'}`}
        >
          {p + 1}
        </button>
      ))}
      <button className="px-3 py-1.5 border rounded-lg" onClick={() => go(page + 1)} disabled={page === totalPages - 1}>Siguiente</button>
    </div>
  )
}
