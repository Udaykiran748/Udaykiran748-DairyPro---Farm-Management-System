import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { HiPlus, HiPencil, HiTrash, HiDownload } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import Loader from '../components/common/Loader'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'
import '../styles/Milk.css'

const DEMO_RECORDS = []

const EMPTY = { animalId:'', date: new Date().toISOString().slice(0,10), morningMilk:'', eveningMilk:'', quality:'A', notes:'' }

export default function Milk() {
  const [records, setRecords] = useState(DEMO_RECORDS)
  const [loading, setLoading] = useState(false)
  const [animals, setAnimals] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('records')

  useEffect(() => {
    api.get('/animals').then(r => setAnimals(r.data.data || [])).catch(() => {})
    api.get('/milk').then(r => setRecords(r.data.data || [])).catch(() => {})
  }, [])

  const up = (k,v) => setForm(f=>({...f,[k]:v}))
  const todayTotal = records.filter(r => r.date?.slice(0,10) === new Date().toISOString().slice(0,10)).reduce((s,r) => s + (r.totalMilk||0), 0)
  const allTimeTotal = records.reduce((s,r) => s + (r.totalMilk||0), 0)
  const avgPerAnimal = animals.length ? (allTimeTotal / animals.length).toFixed(1) : 0
  const chartData = []

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    const payload = { ...form, totalMilk: Number(form.morningMilk)+Number(form.eveningMilk), animal: form.animalId }
    try {
      if (editing) {
        await api.put(`/milk/${editing}`, payload)
        toast.success('Record updated!')
      } else {
        await api.post('/milk', payload)
        toast.success('Milk entry added!')
      }
      api.get('/milk').then(r => setRecords(r.data.data || [])).catch(()=>{})
      setModalOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save milk record')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { 
      await api.delete(`/milk/${id}`) 
      setRecords(prev => prev.filter(r => (r._id||r.id)!==id))
      toast.success('Record deleted')
    } catch (err) { toast.error('Failed to delete milk record') }
  }

  return (
    <div className="milk-page">
      <div className="milk-header">
        <div>
          <h1 className="page-title">Milk Production</h1>
          <p className="page-subtitle">Track daily milk collection per animal</p>
        </div>
        <button onClick={()=>{setForm(EMPTY);setEditing(null);setModalOpen(true)}} className="btn btn-primary">
          <HiPlus style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Add Entry
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          {label:"Today's Total",value:`${todayTotal || 0}L`,icon:'🥛',colorClass:'stat-icon-blue'},
          {label:'All-Time Total',value:`${allTimeTotal || 0}L`,icon:'📊',colorClass:'stat-icon-purple'},
          {label:'Avg Per Animal',value:`${avgPerAnimal || 0}L`,icon:'🐄',colorClass:'stat-icon-earth'},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="card stat-card-custom">
            <div className={`stat-icon-wrapper ${s.colorClass}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {['records','chart'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`tab-btn ${tab===t ? 'active' : ''}`}>
            {t === 'records' ? '📋 Records' : '📊 Charts'}
          </button>
        ))}
      </div>

      {tab === 'records' ? (
        <div className="card table-wrapper">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  {['Animal','Date','Morning','Evening','Total','Quality','Actions'].map(h=>(
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r,i)=>(
                  <tr key={r._id||r.id}>
                    <td>
                      <div className="col-animal-name">{r.animal?.name}</div>
                      <div className="col-animal-id">{r.animal?.animalId}</div>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{r.date?.slice(0,10)}</td>
                    <td><span className="text-blue">{r.morningMilk}L</span></td>
                    <td><span className="text-orange">{r.eveningMilk}L</span></td>
                    <td><span className="text-primary-bold">{r.totalMilk}L</span></td>
                    <td><Badge label={r.quality||'A'} color="green" /></td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={()=>{setForm({...r,animalId:r.animal?._id||r.animal?.id||'',date:r.date?.slice(0,10)});setEditing(r._id||r.id);setModalOpen(true)}}
                          className="icon-btn icon-btn-edit"><HiPencil /></button>
                        <button onClick={()=>handleDelete(r._id||r.id)}
                          className="icon-btn icon-btn-delete"><HiTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="charts-grid">
          <div className="card chart-card">
            <h3 className="section-title">Weekly Production (Litres)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{fontSize:12,fill:'#9ca3af'}} />
                <YAxis tick={{fontSize:12,fill:'#9ca3af'}} />
                <Tooltip formatter={(v,n)=>[`${v}L`,n]} contentStyle={{borderRadius:'12px',fontSize:12}} />
                <Bar dataKey="morning" fill="#3b82f6" name="Morning" radius={[4,4,0,0]} stackId="a" />
                <Bar dataKey="evening" fill="#f59e0b" name="Evening" radius={[4,4,0,0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card chart-card">
            <h3 className="section-title">Daily Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{fontSize:12,fill:'#9ca3af'}} />
                <YAxis tick={{fontSize:12,fill:'#9ca3af'}} />
                <Tooltip formatter={(v)=>[`${v}L`,'Total']} contentStyle={{borderRadius:'12px',fontSize:12}} />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={3} dot={{fill:'#22c55e',r:5}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing ? 'Edit Milk Entry' : 'Add Milk Entry'}>
        <form onSubmit={handleSave} className="modal-form">
          <div className="form-group">
            <label className="form-label">Animal</label>
            <select value={form.animalId} onChange={e=>up('animalId',e.target.value)} style={{ width: '100%' }} required>
              <option value="">Select Animal</option>
              {animals.map(a=><option key={a._id||a.id} value={a._id||a.id}>{a.name} ({a.animalId})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" value={form.date} onChange={e=>up('date',e.target.value)} style={{ width: '100%' }} required />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Morning (L)</label>
              <input type="number" step="0.1" value={form.morningMilk} onChange={e=>up('morningMilk',e.target.value)} style={{ width: '100%' }} placeholder="0" required />
            </div>
            <div className="form-group">
              <label className="form-label">Evening (L)</label>
              <input type="number" step="0.1" value={form.eveningMilk} onChange={e=>up('eveningMilk',e.target.value)} style={{ width: '100%' }} placeholder="0" required />
            </div>
          </div>
          {form.morningMilk && form.eveningMilk && (
            <div className="total-display">
              Total: {(Number(form.morningMilk)+Number(form.eveningMilk)).toFixed(1)}L
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Quality</label>
            <select value={form.quality} onChange={e=>up('quality',e.target.value)} style={{ width: '100%' }}>
              {['A+','A','B','C'].map(q=><option key={q} value={q}>Grade {q}</option>)}
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
