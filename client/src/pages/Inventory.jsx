import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'

const CATS = ['Feed','Medicine','Equipment','Tools','Other']
const DEMO = [
  {id:1,itemName:'Deworming Tablets',category:'Medicine',quantity:200,unit:'tablets',minQuantity:50,pricePerUnit:5,supplier:'VetPharma',expiryDate:'2026-01-01'},
  {id:2,itemName:'Milking Machine',category:'Equipment',quantity:2,unit:'units',minQuantity:1,pricePerUnit:25000,supplier:'AgriTech'},
  {id:3,itemName:'Feed Buckets',category:'Tools',quantity:15,unit:'pieces',minQuantity:5,pricePerUnit:150,supplier:'Local Market'},
  {id:4,itemName:'FMD Vaccine',category:'Medicine',quantity:10,unit:'vials',minQuantity:15,pricePerUnit:80,supplier:'VetPharma',expiryDate:'2025-08-15'},
  {id:5,itemName:'Calcium Supplement',category:'Medicine',quantity:8,unit:'kg',minQuantity:5,pricePerUnit:300,supplier:'AgriMart'},
]
const EMPTY = { itemName:'', category:'Medicine', quantity:'', unit:'', minQuantity:'', pricePerUnit:'', supplier:'', expiryDate:'', location:'' }

export default function Inventory() {
  const [items, setItems] = useState(DEMO)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [filter, setFilter] = useState('All')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/inventory').then(r => { if(r.data.data?.length) setItems(r.data.data) }).catch(()=>{})
  }, [])

  const up = (k,v) => setForm(f=>({...f,[k]:v}))
  const filtered = filter === 'All' ? items : items.filter(i=>i.category===filter)
  const lowStock = items.filter(i => i.quantity <= i.minQuantity)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { const r = await api.put(`/inventory/${editing}`, form); setItems(prev=>prev.map(i=>(i._id||i.id)===editing?r.data.data:i)); toast.success('Updated!') }
      else { const r = await api.post('/inventory', form); setItems(prev=>[r.data.data,...prev]); toast.success('Item added!') }
    } catch {
      if (editing) { setItems(prev=>prev.map(i=>(i._id||i.id)===editing?{...i,...form}:i)); toast.success('Updated! (demo)') }
      else { setItems(prev=>[{...form,id:Date.now()},...prev]); toast.success('Added! (demo)') }
    } finally { setSaving(false); setModalOpen(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/inventory/${deleteId}`) } catch {}
    setItems(prev=>prev.filter(i=>(i._id||i.id)!==deleteId))
    toast.success('Deleted'); setDeleteId(null)
  }

  const catColor = { Medicine:'red', Feed:'green', Equipment:'blue', Tools:'yellow', Other:'gray' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div><h1 className="page-title">Inventory Management</h1><p className="text-sm text-gray-500 mt-0.5">Medicines, equipment, tools, and supplies</p></div>
        <button onClick={()=>{setForm(EMPTY);setEditing(null);setModalOpen(true)}} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" />Add Item</button>
      </div>

      {lowStock.length > 0 && (
        <div className="glass-card p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200">
          <h3 className="font-semibold text-orange-700 mb-2">⚠️ Low Stock ({lowStock.length})</h3>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(i=>(
              <div key={i._id||i.id} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-sm text-orange-700 dark:text-orange-300">
                {i.itemName}: {i.quantity} {i.unit}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {['All',...CATS].map(c=>(
          <button key={c} onClick={()=>setFilter(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter===c?'bg-primary-600 text-white':'glass-card hover:shadow-card'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-primary-50 dark:bg-gray-800/60">
              {['Item','Category','Qty','Min Qty','Price','Supplier','Expiry','Status','Actions'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map(item=>{
                const isLow = item.quantity <= item.minQuantity
                return (
                  <tr key={item._id||item.id} className={`hover:bg-primary-50/40 dark:hover:bg-gray-800/40 transition-colors ${isLow?'bg-red-50/30':''}`}>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">{item.itemName}</td>
                    <td className="px-4 py-3"><Badge label={item.category} color={catColor[item.category]||'gray'} /></td>
                    <td className="px-4 py-3"><span className={`font-bold ${isLow?'text-red-600':'text-gray-700 dark:text-gray-300'}`}>{item.quantity} {item.unit}</span></td>
                    <td className="px-4 py-3 text-gray-500">{item.minQuantity} {item.unit}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{item.pricePerUnit}/{item.unit}</td>
                    <td className="px-4 py-3 text-gray-500">{item.supplier}</td>
                    <td className="px-4 py-3 text-gray-500">{item.expiryDate?.slice(0,10)||'—'}</td>
                    <td className="px-4 py-3"><Badge label={isLow?'Low Stock':'In Stock'} color={isLow?'red':'green'} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={()=>{setForm({...item,expiryDate:item.expiryDate?.slice(0,10)||''});setEditing(item._id||item.id);setModalOpen(true)}} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={()=>setDeleteId(item._id||item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><HiTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing?'Edit Item':'Add Inventory Item'} size="lg">
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{l:'Item Name',k:'itemName'},{l:'Quantity',k:'quantity',t:'number'},{l:'Unit (kg/tablets/units)',k:'unit'},{l:'Min Quantity',k:'minQuantity',t:'number'},{l:'Price Per Unit (₹)',k:'pricePerUnit',t:'number'},{l:'Supplier',k:'supplier'}].map(({l,k,t='text'})=>(
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{l}</label>
              <input type={t} value={form[k]||''} onChange={e=>up(k,e.target.value)} className="input-field" required={['itemName','quantity','unit'].includes(k)} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select value={form.category||'Medicine'} onChange={e=>up('category',e.target.value)} className="input-field">
              {CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
            <input type="date" value={form.expiryDate||''} onChange={e=>up('expiryDate',e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input type="text" value={form.location||''} onChange={e=>up('location',e.target.value)} className="input-field" placeholder="Storage room A" />
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'Saving...':editing?'Update':'Add Item'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete} title="Delete Item" message="Delete this inventory item?" />
    </div>
  )
}
