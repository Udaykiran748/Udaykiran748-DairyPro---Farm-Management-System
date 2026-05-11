import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

const TYPES = ['Vaccination','Treatment','Check-up','Surgery','Deworming']
const typeColor = { Vaccination:'blue', Treatment:'red', 'Check-up':'green', Surgery:'red', Deworming:'yellow' }
const DEMO = [
  {id:1,animal:{name:'Lakshmi',animalId:'A001'},type:'Vaccination',date:'2025-04-10',description:'FMD Vaccine',doctor:'Dr. Sharma',cost:500,nextDueDate:'2025-10-10',status:'Completed'},
  {id:2,animal:{name:'Nandini',animalId:'A003'},type:'Treatment',date:'2025-04-22',description:'Mastitis treatment',doctor:'Dr. Patel',cost:1200,nextDueDate:null,status:'Completed'},
  {id:3,animal:{name:'Ganga',animalId:'A002'},type:'Vaccination',date:'2025-03-15',description:'HS Vaccine',doctor:'Dr. Sharma',cost:400,nextDueDate:'2025-09-15',status:'Completed'},
  {id:4,animal:{name:'Kaveri',animalId:'A004'},type:'Check-up',date:'2025-05-01',description:'Pregnancy check',doctor:'Dr. Patel',cost:800,nextDueDate:'2025-06-01',status:'Ongoing'},
]
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
    } catch {
      const mockAnimal = animals.find(a=>(a._id||a.id)===form.animalId) || {name:'Animal',animalId:form.animalId}
      const rec = { id: Date.now(), animal: mockAnimal, ...form }
      if (editing) { setRecords(prev=>prev.map(r=>(r._id||r.id)===editing?rec:r)); toast.success('Updated! (demo)') }
      else { setRecords(prev=>[rec,...prev]); toast.success('Added! (demo)') }
    } finally { setSaving(false); setModalOpen(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/health/${deleteId}`) } catch {}
    setRecords(prev=>prev.filter(r=>(r._id||r.id)!==deleteId))
    toast.success('Deleted'); setDeleteId(null)
  }

  const upcoming = records.filter(r => r.nextDueDate && new Date(r.nextDueDate) > new Date() && new Date(r.nextDueDate) < new Date(Date.now()+30*86400000))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Health & Vaccination</h1>
          <p className="text-sm text-gray-500 mt-0.5">Medical history, vaccinations, and vet visits</p>
        </div>
        <button onClick={()=>{setForm(EMPTY);setEditing(null);setModalOpen(true)}} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-5 h-5" /> Add Record
        </button>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="glass-card p-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">⚠️ Upcoming ({upcoming.length})</h3>
          <div className="flex flex-wrap gap-3">
            {upcoming.map(r=>(
              <div key={r._id||r.id} className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-sm">
                <span className="font-medium text-yellow-800 dark:text-yellow-300">{r.animal?.name}</span>
                <span className="text-yellow-600 dark:text-yellow-400">—</span>
                <span className="text-yellow-700 dark:text-yellow-400">{r.description}</span>
                <span className="text-xs text-yellow-500">{r.nextDueDate?.slice(0,10)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {['All',...TYPES].map(t=>(
          <button key={t} onClick={()=>setFilter(t)}
            className={`p-3 rounded-xl text-sm font-medium text-center transition-all ${filter===t ? 'bg-primary-600 text-white shadow-card' : 'glass-card hover:shadow-card'}`}>
            <div className="font-bold text-lg">{t==='All' ? records.length : records.filter(r=>r.type===t).length}</div>
            <div className={filter===t ? 'text-primary-100' : 'text-gray-500'}>{t==='All'?'Total':t}</div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-50 dark:bg-gray-800/60">
                {['Animal','Type','Date','Description','Doctor','Cost','Next Due','Status','Actions'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((r,i)=>(
                <tr key={r._id||r.id} className="hover:bg-primary-50/40 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">{r.animal?.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{r.animal?.animalId}</div>
                  </td>
                  <td className="px-4 py-3"><Badge label={r.type} color={typeColor[r.type]||'gray'} /></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{r.date?.slice(0,10)}</td>
                  <td className="px-4 py-3 max-w-48 truncate text-gray-700 dark:text-gray-300">{r.description}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{r.doctor}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">₹{r.cost?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{r.nextDueDate?.slice(0,10) || '—'}</td>
                  <td className="px-4 py-3"><Badge label={r.status} color={r.status==='Completed'?'green':r.status==='Ongoing'?'yellow':'blue'} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={()=>{setForm({...r,animalId:r.animal?._id||r.animal?.id||'',date:r.date?.slice(0,10),nextDueDate:r.nextDueDate?.slice(0,10)||''});setEditing(r._id||r.id);setModalOpen(true)}}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><HiPencil className="w-4 h-4" /></button>
                      <button onClick={()=>setDeleteId(r._id||r.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><HiTrash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing ? 'Edit Health Record' : 'Add Health Record'} size="lg">
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Animal</label>
            <select value={form.animalId} onChange={e=>up('animalId',e.target.value)} className="input-field" required>
              <option value="">Select Animal</option>
              {animals.map(a=><option key={a._id||a.id} value={a._id||a.id}>{a.name} ({a.animalId})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select value={form.type} onChange={e=>up('type',e.target.value)} className="input-field">
              {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input type="date" value={form.date} onChange={e=>up('date',e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor</label>
            <input type="text" value={form.doctor} onChange={e=>up('doctor',e.target.value)} className="input-field" placeholder="Dr. Name" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input type="text" value={form.description} onChange={e=>up('description',e.target.value)} className="input-field" placeholder="Treatment details..." required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost (₹)</label>
            <input type="number" value={form.cost} onChange={e=>up('cost',e.target.value)} className="input-field" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Next Due Date</label>
            <input type="date" value={form.nextDueDate} onChange={e=>up('nextDueDate',e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select value={form.status} onChange={e=>up('status',e.target.value)} className="input-field">
              {['Completed','Ongoing','Scheduled'].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Add Record'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Record" message="Delete this health record?" />
    </div>
  )
}
