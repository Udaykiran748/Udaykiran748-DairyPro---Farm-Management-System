import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'
import '../styles/Expenses.css'

const CATS = ['Feed','Medicine','Salary','Electricity','Water','Maintenance','Equipment','Other']
const CAT_COLORS = { Feed:'#22c55e', Medicine:'#ef4444', Salary:'#3b82f6', Electricity:'#f59e0b', Water:'#06b6d4', Maintenance:'#8b5cf6', Equipment:'#f97316', Other:'#6b7280' }

const EMPTY = { category:'Feed', amount:'', date:new Date().toISOString().slice(0,10), description:'', paidTo:'', paymentMode:'Cash' }

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/expenses').then(r => setExpenses(r.data.data || [])).catch(()=>{})
  }, [])

  const up = (k,v) => setForm(f=>({...f,[k]:v}))
  const total = expenses.reduce((s,e)=>s+(e.amount||0),0)
  const pieData = CATS.map(c=>({ name:c, value:expenses.filter(e=>e.category===c).reduce((s,e)=>s+(e.amount||0),0), color:CAT_COLORS[c] })).filter(d=>d.value>0)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) {
        await api.put(`/expenses/${editing}`, form)
        toast.success('Expense updated!')
      } else {
        await api.post('/expenses', form)
        toast.success('Expense added!')
      }
      api.get('/expenses').then(r => setExpenses(r.data.data || [])).catch(()=>{})
      setModalOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save expense')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { 
      await api.delete(`/expenses/${deleteId}`) 
      setExpenses(prev=>prev.filter(e=>(e._id||e.id)!==deleteId))
      toast.success('Deleted'); setDeleteId(null)
    } catch (err) { toast.error('Failed to delete expense') }
  }

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <div><h1 className="page-title">Expense Tracking</h1><p className="page-subtitle">Monitor all farm expenses and costs</p></div>
        <button onClick={()=>{setForm(EMPTY);setEditing(null);setModalOpen(true)}} className="btn btn-primary"><HiPlus style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />Add Expense</button>
      </div>

      <div className="stats-grid-4">
        {[
          {label:'This Month',value:`₹${total.toLocaleString('en-IN')}`,icon:'💸',colorClass:'stat-icon-red'},
          {label:'Largest',value:`₹${Math.max(...expenses.map(e=>e.amount||0)).toLocaleString('en-IN')}`,icon:'📈',colorClass:'stat-icon-orange'},
          {label:'Categories',value:new Set(expenses.map(e=>e.category)).size,icon:'📂',colorClass:'stat-icon-blue'},
          {label:'Avg/Day',value:`₹${Math.round(total/30).toLocaleString('en-IN')}`,icon:'📅',colorClass:'stat-icon-purple'},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="card stat-card-custom">
            <div className={`stat-icon-wrapper ${s.colorClass}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="expenses-layout-grid">
        <div className="card chart-card">
          <h3 className="section-title">By Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={65} dataKey="value">
              {pieData.map((d,i)=><Cell key={i} fill={d.color} />)}
            </Pie><Tooltip formatter={v=>[`₹${v.toLocaleString('en-IN')}`,'']} /></PieChart>
          </ResponsiveContainer>
          <div className="legend-list">
            {pieData.map((d,i)=>(
              <div key={i} className="legend-item">
                <div className="legend-label-wrapper"><div className="legend-color-dot" style={{background:d.color}} /><span className="legend-label">{d.name}</span></div>
                <span className="legend-value">₹{d.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card table-wrapper">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr>
                {['Category','Amount','Date','Description','Payment','Actions'].map(h=>(
                  <th key={h}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {expenses.map(exp=>(
                  <tr key={exp._id||exp.id}>
                    <td>
                      <div className="cat-label-wrapper">
                        <div className="cat-color-dot" style={{background:CAT_COLORS[exp.category]||'#6b7280'}} />
                        <span className="cat-label">{exp.category}</span>
                      </div>
                    </td>
                    <td className="cell-amount">₹{exp.amount?.toLocaleString('en-IN')}</td>
                    <td className="cell-nowrap">{exp.date?.slice(0,10)}</td>
                    <td className="cell-truncate" title={exp.description}>{exp.description}</td>
                    <td><Badge label={exp.paymentMode||'Cash'} color="gray" /></td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={()=>{setForm({...exp,date:exp.date?.slice(0,10)});setEditing(exp._id||exp.id);setModalOpen(true)}} className="icon-btn icon-btn-edit"><HiPencil /></button>
                        <button onClick={()=>setDeleteId(exp._id||exp.id)} className="icon-btn icon-btn-delete"><HiTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing?'Edit Expense':'Add Expense'}>
        <form onSubmit={handleSave} className="modal-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select value={form.category} onChange={e=>up('category',e.target.value)} style={{ width: '100%' }}>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e=>up('amount',e.target.value)} style={{ width: '100%' }} placeholder="0" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" value={form.date} onChange={e=>up('date',e.target.value)} style={{ width: '100%' }} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input type="text" value={form.description} onChange={e=>up('description',e.target.value)} style={{ width: '100%' }} placeholder="Details..." required />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Paid To</label>
              <input type="text" value={form.paidTo||''} onChange={e=>up('paidTo',e.target.value)} style={{ width: '100%' }} placeholder="Vendor name" />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select value={form.paymentMode||'Cash'} onChange={e=>up('paymentMode',e.target.value)} style={{ width: '100%' }}>
                {['Cash','Online','Cheque'].map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">{saving?'Saving...':editing?'Update':'Add Expense'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Expense" message="Delete this expense record?" />
    </div>
  )
}
