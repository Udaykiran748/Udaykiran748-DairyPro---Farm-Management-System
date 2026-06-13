import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'
import '../styles/Health.css'

const TYPES = ['Vaccination','Treatment','Check-up','Surgery','Deworming']
const typeColor = { Vaccination:'blue', Treatment:'red', 'Check-up':'green', Surgery:'red', Deworming:'yellow' }
const DEMO = []
const EMPTY = { animalId:'', type:'Vaccination', date:new Date().toISOString().slice(0,10), description:'', doctor:'', cost:'', nextDueDate:'', status:'Completed', notes:'' }

export default function Health() {
  const [records, setRecords] = useState(DEMO)
  const [animals, setAnimals] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    api.get('/animals').then(r => setAnimals(r.data.data)).catch(()=>{})
    api.get('/health').then(r => { if(r.data.data?.length) setRecords(r.data.data) }).catch(()=>{})
  }, [])

  const up = (k,v) => setForm(f=>({...f,[k]:v}))
  const filtered = filter === 'All' ? records : records.filter(r=>r.type===filter)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { await api.put(`/health/${editing}`, form); toast.success('Updated!') }
      else { await api.post('/health', {...form, animal: form.animalId}); toast.success('Record added!') }
      api.get('/health').then(r => { if(r.data.data?.length) setRecords(r.data.data) }).catch(()=>{})
      setModalOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save health record')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { 
      await api.delete(`/health/${deleteId}`) 
      setRecords(prev=>prev.filter(r=>(r._id||r.id)!==deleteId))
      toast.success('Deleted'); setDeleteId(null)
    } catch (err) { toast.error('Failed to delete record') }
  }

  const upcoming = records.filter(r => r.nextDueDate && new Date(r.nextDueDate) > new Date() && new Date(r.nextDueDate) < new Date(Date.now()+30*86400000))

  return (
    <div className="health-page">
      <div className="health-header">
        <div>
          <h1 className="page-title">Health & Vaccination</h1>
          <p className="page-subtitle">Medical history, vaccinations, and vet visits</p>
        </div>
        <button onClick={()=>{setForm(EMPTY);setEditing(null);setModalOpen(true)}} className="btn btn-primary">
          <HiPlus style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Add Record
        </button>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="card upcoming-box">
          <h3 className="upcoming-title">⚠️ Upcoming ({upcoming.length})</h3>
          <div className="upcoming-items">
            {upcoming.map(r=>(
              <div key={r._id||r.id} className="upcoming-item">
                <span className="upcoming-name">{r.animal?.name}</span>
                <span className="upcoming-separator">—</span>
                <span className="upcoming-desc">{r.description}</span>
                <span className="upcoming-date">{r.nextDueDate?.slice(0,10)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid-5">
        {['All',...TYPES].map(t=>(
          <button key={t} onClick={()=>setFilter(t)}
            className={`filter-card ${filter===t ? 'active' : ''}`}>
            <div className="filter-card-value">{t==='All' ? records.length : records.filter(r=>r.type===t).length}</div>
            <div className="filter-card-label">{t==='All'?'Total':t}</div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card table-wrapper">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                {['Animal','Type','Date','Description','Doctor','Cost','Next Due','Status','Actions'].map(h=>(
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r,i)=>(
                <tr key={r._id||r.id}>
                  <td>
                    <div className="col-animal-name">{r.animal?.name}</div>
                    <div className="col-animal-id">{r.animal?.animalId}</div>
                  </td>
                  <td><Badge label={r.type} color={typeColor[r.type]||'gray'} /></td>
                  <td className="cell-nowrap">{r.date?.slice(0,10)}</td>
                  <td className="cell-truncate" title={r.description}>{r.description}</td>
                  <td className="cell-nowrap">{r.doctor}</td>
                  <td className="cell-cost">₹{r.cost?.toLocaleString('en-IN')}</td>
                  <td className="cell-nowrap">{r.nextDueDate?.slice(0,10) || '—'}</td>
                  <td><Badge label={r.status} color={r.status==='Completed'?'green':r.status==='Ongoing'?'yellow':'blue'} /></td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={()=>{setForm({...r,animalId:r.animal?._id||r.animal?.id||'',date:r.date?.slice(0,10),nextDueDate:r.nextDueDate?.slice(0,10)||''});setEditing(r._id||r.id);setModalOpen(true)}}
                        className="icon-btn icon-btn-edit"><HiPencil /></button>
                      <button onClick={()=>setDeleteId(r._id||r.id)} className="icon-btn icon-btn-delete"><HiTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing ? 'Edit Health Record' : 'Add Health Record'} size="lg">
        <form onSubmit={handleSave} className="modal-form-grid">
          <div className="form-group">
            <label className="form-label">Animal</label>
            <select value={form.animalId} onChange={e=>up('animalId',e.target.value)} style={{ width: '100%' }} required>
              <option value="">Select Animal</option>
              {animals.map(a=><option key={a._id||a.id} value={a._id||a.id}>{a.name} ({a.animalId})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select value={form.type} onChange={e=>up('type',e.target.value)} style={{ width: '100%' }}>
              {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" value={form.date} onChange={e=>up('date',e.target.value)} style={{ width: '100%' }} required />
          </div>
          <div className="form-group">
            <label className="form-label">Doctor</label>
            <input type="text" value={form.doctor} onChange={e=>up('doctor',e.target.value)} style={{ width: '100%' }} placeholder="Dr. Name" />
          </div>
          <div className="form-group form-full-width">
            <label className="form-label">Description</label>
            <input type="text" value={form.description} onChange={e=>up('description',e.target.value)} style={{ width: '100%' }} placeholder="Treatment details..." required />
          </div>
          <div className="form-group">
            <label className="form-label">Cost (₹)</label>
            <input type="number" value={form.cost} onChange={e=>up('cost',e.target.value)} style={{ width: '100%' }} placeholder="0" />
          </div>
          <div className="form-group">
            <label className="form-label">Next Due Date</label>
            <input type="date" value={form.nextDueDate} onChange={e=>up('nextDueDate',e.target.value)} style={{ width: '100%' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select value={form.status} onChange={e=>up('status',e.target.value)} style={{ width: '100%' }}>
              {['Completed','Ongoing','Scheduled'].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Add Record'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Record" message="Delete this health record?" />
    </div>
  )
}
