import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'
import '../styles/Inventory.css'

const CATS = ['Feed','Medicine','Equipment','Tools','Other']

const EMPTY = { itemName:'', category:'Medicine', quantity:'', unit:'', minQuantity:'', pricePerUnit:'', supplier:'', expiryDate:'', location:'' }

export default function Inventory() {
  const [items, setItems] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [filter, setFilter] = useState('All')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/inventory').then(r => setItems(r.data.data || [])).catch(()=>{})
  }, [])

  const up = (k,v) => setForm(f=>({...f,[k]:v}))
  const filtered = filter === 'All' ? items : items.filter(i=>i.category===filter)
  const lowStock = items.filter(i => i.quantity <= i.minQuantity)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) {
        await api.put(`/inventory/${editing}`, form)
        toast.success('Item updated!')
      } else {
        await api.post('/inventory', form)
        toast.success('Item added!')
      }
      api.get('/inventory').then(r => setItems(r.data.data || [])).catch(()=>{})
      setModalOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save inventory item')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { 
      await api.delete(`/inventory/${deleteId}`) 
      setItems(prev=>prev.filter(i=>(i._id||i.id)!==deleteId))
      toast.success('Deleted'); setDeleteId(null)
    } catch (err) { toast.error('Failed to delete item') }
  }

  const catColor = { Medicine:'red', Feed:'green', Equipment:'blue', Tools:'yellow', Other:'gray' }

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div><h1 className="page-title">Inventory Management</h1><p className="page-subtitle">Medicines, equipment, tools, and supplies</p></div>
        <button onClick={()=>{setForm(EMPTY);setEditing(null);setModalOpen(true)}} className="btn btn-primary"><HiPlus style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />Add Item</button>
      </div>

      {lowStock.length > 0 && (
        <div className="card low-stock-alert">
          <h3 className="low-stock-title">⚠️ Low Stock ({lowStock.length})</h3>
          <div className="low-stock-items">
            {lowStock.map(i=>(
              <div key={i._id||i.id} className="low-stock-item">
                {i.itemName}: {i.quantity} {i.unit}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="filter-tags">
        {['All',...CATS].map(c=>(
          <button key={c} onClick={()=>setFilter(c)}
            className={`filter-tag ${filter===c?'active':''}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="card table-wrapper">
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr>
              {['Item','Category','Qty','Min Qty','Price','Supplier','Expiry','Status','Actions'].map(h=>(
                <th key={h}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(item=>{
                const isLow = item.quantity <= item.minQuantity
                return (
                  <tr key={item._id||item.id} className={isLow ? 'row-low-stock' : ''}>
                    <td className="cell-item-name">{item.itemName}</td>
                    <td><Badge label={item.category} color={catColor[item.category]||'gray'} /></td>
                    <td><span className={`cell-qty ${isLow?'cell-qty-low':''}`}>{item.quantity} {item.unit}</span></td>
                    <td className="cell-nowrap">{item.minQuantity} {item.unit}</td>
                    <td className="cell-nowrap">₹{item.pricePerUnit}/{item.unit}</td>
                    <td className="cell-nowrap">{item.supplier}</td>
                    <td className="cell-nowrap">{item.expiryDate?.slice(0,10)||'—'}</td>
                    <td><Badge label={isLow?'Low Stock':'In Stock'} color={isLow?'red':'green'} /></td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={()=>{setForm({...item,expiryDate:item.expiryDate?.slice(0,10)||''});setEditing(item._id||item.id);setModalOpen(true)}} className="icon-btn icon-btn-edit"><HiPencil /></button>
                        <button onClick={()=>setDeleteId(item._id||item.id)} className="icon-btn icon-btn-delete"><HiTrash /></button>
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
        <form onSubmit={handleSave} className="modal-form-grid">
          {[{l:'Item Name',k:'itemName'},{l:'Quantity',k:'quantity',t:'number'},{l:'Unit (kg/tablets/units)',k:'unit'},{l:'Min Quantity',k:'minQuantity',t:'number'},{l:'Price Per Unit (₹)',k:'pricePerUnit',t:'number'},{l:'Supplier',k:'supplier'}].map(({l,k,t='text'})=>(
            <div className="form-group" key={k}>
              <label className="form-label">{l}</label>
              <input type={t} value={form[k]||''} onChange={e=>up(k,e.target.value)} style={{ width: '100%' }} required={['itemName','quantity','unit'].includes(k)} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select value={form.category||'Medicine'} onChange={e=>up('category',e.target.value)} style={{ width: '100%' }}>
              {CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input type="date" value={form.expiryDate||''} onChange={e=>up('expiryDate',e.target.value)} style={{ width: '100%' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" value={form.location||''} onChange={e=>up('location',e.target.value)} style={{ width: '100%' }} placeholder="Storage room A" />
          </div>
          <div className="modal-footer">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">{saving?'Saving...':editing?'Update':'Add Item'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete} title="Delete Item" message="Delete this inventory item?" />
    </div>
  )
}
