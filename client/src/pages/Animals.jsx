import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiSearch, HiFilter } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import toast from 'react-hot-toast'

const BREEDS = ['Holstein','Jersey','Murrah','Gir','Sahiwal','Tharparkar','HF Cross','Graded Murrah']
const HEALTH_OPTIONS = ['Excellent','Good','Fair','Poor','Sick']
const healthColor = { Excellent:'green', Good:'green', Fair:'yellow', Poor:'red', Sick:'red' }

const EMPTY = { animalId:'', name:'', type:'Cow', breed:'', age:'', weight:'', gender:'Female',
  isPregnant:false, milkCapacity:'', purchaseDate:'', purchasePrice:'', healthStatus:'Good', notes:'' }

export default function Animals() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const fetchAnimals = () => {
    setLoading(true)
    api.get('/animals')
      .then(r => setAnimals(r.data.data))
      .catch(() => setAnimals(DEMO_ANIMALS))
      .finally(() => setLoading(false))
  }
  useEffect(fetchAnimals, [])

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const openAdd = () => { setForm(EMPTY); setEditing(null); setModalOpen(true) }
  const openEdit = (a) => { setForm({ ...a, purchaseDate: a.purchaseDate?.slice(0,10)||'' }); setEditing(a._id||a.id); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) {
        const r = await api.put(`/animals/${editing}`, form)
        setAnimals(prev => prev.map(a => (a._id||a.id)===editing ? r.data.data : a))
        toast.success('Animal updated!')
      } else {
        const r = await api.post('/animals', form)
        setAnimals(prev => [r.data.data, ...prev])
        toast.success('Animal added!')
      }
      setModalOpen(false)
    } catch {
      // Demo mode: update local state
      if (editing) {
        setAnimals(prev => prev.map(a => (a._id||a.id)===editing ? { ...a, ...form, id: editing } : a))
        toast.success('Animal updated! (demo)')
      } else {
        const newA = { ...form, id: Date.now(), _id: Date.now() }
        setAnimals(prev => [newA, ...prev])
        toast.success('Animal added! (demo)')
      }
      setModalOpen(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/animals/${deleteId}`) } catch {}
    setAnimals(prev => prev.filter(a => (a._id||a.id) !== deleteId))
    toast.success('Animal deleted')
    setDeleteId(null)
  }

  const filtered = animals.filter(a => {
    const matchSearch = a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.animalId?.toLowerCase().includes(search.toLowerCase()) ||
      a.breed?.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'All' || a.type === filterType
    return matchSearch && matchType
  })

  const stats = [
    { label: 'Total', value: animals.length, icon: '🐄' },
    { label: 'Cows', value: animals.filter(a=>a.type==='Cow').length, icon: '🐄' },
    { label: 'Buffaloes', value: animals.filter(a=>a.type==='Buffalo').length, icon: '🐃' },
    { label: 'Pregnant', value: animals.filter(a=>a.isPregnant).length, icon: '🤰' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Animal Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all your cows and buffaloes</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-5 h-5" /> Add Animal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s,i) => (
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="glass-card p-4 text-center">
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by name, ID, breed..." className="input-field pl-9 py-2 text-sm" />
        </div>
        <div className="flex gap-2">
          {['All','Cow','Buffalo'].map(t => (
            <button key={t} onClick={()=>setFilterType(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType===t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? <Loader /> : filtered.length === 0 ? (
        <EmptyState icon="🐄" title="No animals found" message="Add your first animal to get started"
          action={<button onClick={openAdd} className="btn-primary">Add Animal</button>} />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary-50 dark:bg-gray-800/60">
                  {['ID','Name','Type/Breed','Age','Milk Cap.','Status','Pregnant','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((a, i) => (
                  <motion.tr key={a._id||a.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                    className="hover:bg-primary-50/40 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{a.animalId}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">{a.name}</td>
                    <td className="px-4 py-3">
                      <div>{a.type}</div>
                      <div className="text-xs text-gray-400">{a.breed}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{a.age}y</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{a.milkCapacity}L</td>
                    <td className="px-4 py-3"><Badge label={a.healthStatus} color={healthColor[a.healthStatus]||'gray'} /></td>
                    <td className="px-4 py-3">{a.isPregnant ? <Badge label="Yes" color="purple" /> : <Badge label="No" color="gray" />}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={()=>openEdit(a)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors">
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button onClick={()=>setDeleteId(a._id||a.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing ? 'Edit Animal' : 'Add New Animal'} size="lg">
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {label:'Animal ID',key:'animalId',type:'text',placeholder:'A001'},
            {label:'Name',key:'name',type:'text',placeholder:'Lakshmi'},
            {label:'Age (years)',key:'age',type:'number',placeholder:'4'},
            {label:'Weight (kg)',key:'weight',type:'number',placeholder:'480'},
            {label:'Milk Capacity (L/day)',key:'milkCapacity',type:'number',placeholder:'20'},
            {label:'Purchase Price (₹)',key:'purchasePrice',type:'number',placeholder:'80000'},
            {label:'Purchase Date',key:'purchaseDate',type:'date',placeholder:''},
          ].map(({label,key,type,placeholder}) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input type={type} value={form[key]||''} onChange={e=>up(key,e.target.value)}
                className="input-field" placeholder={placeholder} />
            </div>
          ))}
          {[
            {label:'Type',key:'type',options:['Cow','Buffalo']},
            {label:'Breed',key:'breed',options:BREEDS},
            {label:'Gender',key:'gender',options:['Female','Male']},
            {label:'Health Status',key:'healthStatus',options:HEALTH_OPTIONS},
          ].map(({label,key,options}) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <select value={form[key]||''} onChange={e=>up(key,e.target.value)} className="input-field">
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea value={form.notes||''} onChange={e=>up('notes',e.target.value)} rows={2}
              className="input-field resize-none" placeholder="Any additional notes..." />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input type="checkbox" id="pregnant" checked={!!form.isPregnant} onChange={e=>up('isPregnant',e.target.checked)}
              className="w-4 h-4 accent-primary-600" />
            <label htmlFor="pregnant" className="text-sm text-gray-700 dark:text-gray-300">Currently Pregnant</label>
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Animal' : 'Add Animal'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Animal" message="Are you sure you want to delete this animal record? This cannot be undone." />
    </div>
  )
}

const DEMO_ANIMALS = [
  {id:1,animalId:'A001',name:'Lakshmi',type:'Cow',breed:'Holstein',age:4,weight:480,gender:'Female',isPregnant:true,milkCapacity:22,healthStatus:'Good'},
  {id:2,animalId:'A002',name:'Ganga',type:'Cow',breed:'Jersey',age:3,weight:360,gender:'Female',isPregnant:false,milkCapacity:18,healthStatus:'Excellent'},
  {id:3,animalId:'A003',name:'Nandini',type:'Buffalo',breed:'Murrah',age:5,weight:520,gender:'Female',isPregnant:false,milkCapacity:14,healthStatus:'Good'},
  {id:4,animalId:'A004',name:'Kaveri',type:'Cow',breed:'Gir',age:6,weight:400,gender:'Female',isPregnant:true,milkCapacity:12,healthStatus:'Fair'},
  {id:5,animalId:'A005',name:'Yamuna',type:'Cow',breed:'Holstein',age:2,weight:340,gender:'Female',isPregnant:false,milkCapacity:20,healthStatus:'Excellent'},
  {id:6,animalId:'A006',name:'Saraswati',type:'Buffalo',breed:'Graded Murrah',age:4,weight:540,gender:'Female',isPregnant:false,milkCapacity:16,healthStatus:'Good'},
]
