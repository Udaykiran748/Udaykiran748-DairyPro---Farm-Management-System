import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { HiPlus, HiPencil, HiTrash, HiDownload } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import Loader from '../components/common/Loader'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'

const DEMO_RECORDS = [
  {id:1,animal:{name:'Lakshmi',animalId:'A001'},date:'2025-05-07',morningMilk:12,eveningMilk:10,totalMilk:22},
  {id:2,animal:{name:'Ganga',animalId:'A002'},date:'2025-05-07',morningMilk:9,eveningMilk:9,totalMilk:18},
  {id:3,animal:{name:'Nandini',animalId:'A003'},date:'2025-05-07',morningMilk:7,eveningMilk:7,totalMilk:14},
  {id:4,animal:{name:'Kaveri',animalId:'A004'},date:'2025-05-07',morningMilk:6,eveningMilk:6,totalMilk:12},
  {id:5,animal:{name:'Yamuna',animalId:'A005'},date:'2025-05-07',morningMilk:11,eveningMilk:9,totalMilk:20},
]
const WEEKLY = [
  {day:'Mon',total:112,morning:58,evening:54},{day:'Tue',total:118,morning:61,evening:57},
  {day:'Wed',total:109,morning:55,evening:54},{day:'Thu',total:122,morning:63,evening:59},
  {day:'Fri',total:115,morning:60,evening:55},{day:'Sat',total:125,morning:65,evening:60},
  {day:'Sun',total:120,morning:62,evening:58},
]
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
    api.get('/animals').then(r => setAnimals(r.data.data)).catch(() => {})
    api.get('/milk').then(r => { if(r.data.data?.length) setRecords(r.data.data) }).catch(() => {})
  }, [])

  const up = (k,v) => setForm(f=>({...f,[k]:v}))
  const todayTotal = records.filter(r => r.date?.slice(0,10) === new Date().toISOString().slice(0,10)).reduce((s,r) => s + (r.totalMilk||0), 0)
  const weekTotal = WEEKLY.reduce((s,d) => s + d.total, 0)

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
      api.get('/milk').then(r => { if(r.data.data?.length) setRecords(r.data.data) }).catch(()=>{})
    } catch {
      const mockAnimal = animals.find(a=>(a._id||a.id)===form.animalId) || { name: 'Animal', animalId: form.animalId }
      const newRecord = { id: Date.now(), animal: mockAnimal, ...payload }
      if (editing) {
        setRecords(prev => prev.map(r => (r._id||r.id)===editing ? newRecord : r))
        toast.success('Updated! (demo)')
      } else {
        setRecords(prev => [newRecord, ...prev])
        toast.success('Added! (demo)')
      }
    } finally { setSaving(false); setModalOpen(false) }
  }

  const handleDelete = async (id) => {
    try { await api.delete(`/milk/${id}`) } catch {}
    setRecords(prev => prev.filter(r => (r._id||r.id)!==id))
    toast.success('Record deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Milk Production</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track daily milk collection per animal</p>
        </div>
        <button onClick={()=>{setForm(EMPTY);setEditing(null);setModalOpen(true)}} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-5 h-5" /> Add Entry
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {label:"Today's Total",value:`${todayTotal || 86}L`,icon:'🥛',color:'bg-blue-500'},
          {label:'Weekly Total',value:`${weekTotal}L`,icon:'📅',color:'bg-primary-500'},
          {label:'Monthly Total',value:`2,620L`,icon:'📊',color:'bg-purple-500'},
          {label:'Avg Per Animal',value:`17.2L`,icon:'🐄',color:'bg-earth-500'},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="glass-card p-4">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl text-white mb-3`}>{s.icon}</div>
            <div className="text-xl font-display font-bold text-gray-800 dark:text-gray-100">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800">
        {['records','chart'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all capitalize ${tab===t ? 'border-primary-600 text-primary-700 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'records' ? '📋 Records' : '📊 Charts'}
          </button>
        ))}
      </div>

      {tab === 'records' ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary-50 dark:bg-gray-800/60">
                  {['Animal','Date','Morning','Evening','Total','Quality','Actions'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {records.map((r,i)=>(
                  <tr key={r._id||r.id} className="hover:bg-primary-50/40 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">
                      <div>{r.animal?.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{r.animal?.animalId}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.date?.slice(0,10)}</td>
                    <td className="px-4 py-3"><span className="font-medium text-blue-600">{r.morningMilk}L</span></td>
                    <td className="px-4 py-3"><span className="font-medium text-orange-500">{r.eveningMilk}L</span></td>
                    <td className="px-4 py-3"><span className="font-bold text-primary-700 dark:text-primary-400">{r.totalMilk}L</span></td>
                    <td className="px-4 py-3"><Badge label={r.quality||'A'} color="green" /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={()=>{setForm({...r,animalId:r.animal?._id||r.animal?.id||'',date:r.date?.slice(0,10)});setEditing(r._id||r.id);setModalOpen(true)}}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={()=>handleDelete(r._id||r.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><HiTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="section-title mb-4">Weekly Production (Litres)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={WEEKLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{fontSize:12,fill:'#9ca3af'}} />
                <YAxis tick={{fontSize:12,fill:'#9ca3af'}} />
                <Tooltip formatter={(v,n)=>[`${v}L`,n]} contentStyle={{borderRadius:'12px',fontSize:12}} />
                <Bar dataKey="morning" fill="#3b82f6" name="Morning" radius={[4,4,0,0]} stackId="a" />
                <Bar dataKey="evening" fill="#f59e0b" name="Evening" radius={[4,4,0,0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-5">
            <h3 className="section-title mb-4">Daily Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={WEEKLY}>
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
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Animal</label>
            <select value={form.animalId} onChange={e=>up('animalId',e.target.value)} className="input-field" required>
              <option value="">Select Animal</option>
              {animals.map(a=><option key={a._id||a.id} value={a._id||a.id}>{a.name} ({a.animalId})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input type="date" value={form.date} onChange={e=>up('date',e.target.value)} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Morning (L)</label>
              <input type="number" step="0.1" value={form.morningMilk} onChange={e=>up('morningMilk',e.target.value)} className="input-field" placeholder="0" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Evening (L)</label>
              <input type="number" step="0.1" value={form.eveningMilk} onChange={e=>up('eveningMilk',e.target.value)} className="input-field" placeholder="0" required />
            </div>
          </div>
          {form.morningMilk && form.eveningMilk && (
            <div className="p-3 bg-primary-50 dark:bg-primary-950/30 rounded-xl text-center">
              <span className="font-bold text-primary-700 dark:text-primary-300 text-lg">
                Total: {(Number(form.morningMilk)+Number(form.eveningMilk)).toFixed(1)}L
              </span>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quality</label>
            <select value={form.quality} onChange={e=>up('quality',e.target.value)} className="input-field">
              {['A+','A','B','C'].map(q=><option key={q} value={q}>Grade {q}</option>)}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
