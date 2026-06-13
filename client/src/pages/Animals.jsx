import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiSearch } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import toast from 'react-hot-toast'
import '../styles/Animals.css'

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
      .catch(() => toast.error('Failed to load animals'))
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save animal')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { 
      await api.delete(`/animals/${deleteId}`) 
      setAnimals(prev => prev.filter(a => (a._id||a.id) !== deleteId))
      toast.success('Animal deleted')
      setDeleteId(null)
    } catch (err) { toast.error('Failed to delete animal') }
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
    <div className="animals-page">
      {/* Header */}
      <div className="animals-header">
        <div>
          <h1 className="page-title">Animal Management</h1>
          <p className="page-subtitle">Manage all your cows and buffaloes</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <HiPlus style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Add Animal
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s,i) => (
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="card stat-item">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="card filters-bar">
        <div className="search-wrapper">
          <HiSearch className="search-icon" />
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by name, ID, breed..." className="search-input w-full" style={{ width: '100%' }} />
        </div>
        <div className="filter-buttons">
          {['All','Cow','Buffalo'].map(t => (
            <button key={t} onClick={()=>setFilterType(t)}
              className={`filter-btn ${filterType===t ? 'active' : ''}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? <Loader /> : filtered.length === 0 ? (
        <EmptyState icon="🐄" title="No animals found" message="Add your first animal to get started"
          action={<button onClick={openAdd} className="btn btn-primary">Add Animal</button>} />
      ) : (
        <div className="card table-wrapper">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  {['ID','Name','Type/Breed','Age','Milk Cap.','Status','Pregnant','Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <motion.tr key={a._id||a.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}>
                    <td className="col-id">{a.animalId}</td>
                    <td className="col-name">{a.name}</td>
                    <td>
                      <div>{a.type}</div>
                      <div className="col-breed">{a.breed}</div>
                    </td>
                    <td>{a.age}y</td>
                    <td>{a.milkCapacity}L</td>
                    <td><Badge label={a.healthStatus} color={healthColor[a.healthStatus]||'gray'} /></td>
                    <td>{a.isPregnant ? <Badge label="Yes" color="purple" /> : <Badge label="No" color="gray" />}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={()=>openEdit(a)} className="icon-btn icon-btn-edit">
                          <HiPencil />
                        </button>
                        <button onClick={()=>setDeleteId(a._id||a.id)} className="icon-btn icon-btn-delete">
                          <HiTrash />
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
        <form onSubmit={handleSave} className="modal-form-grid">
          {[
            {label:'Animal ID',key:'animalId',type:'text',placeholder:'A001'},
            {label:'Name',key:'name',type:'text',placeholder:'Bessie'},
            {label:'Age (years)',key:'age',type:'number',placeholder:'4'},
            {label:'Weight (kg)',key:'weight',type:'number',placeholder:'480'},
            {label:'Milk Capacity (L/day)',key:'milkCapacity',type:'number',placeholder:'20'},
            {label:'Purchase Price (₹)',key:'purchasePrice',type:'number',placeholder:'80000'},
            {label:'Purchase Date',key:'purchaseDate',type:'date',placeholder:''},
          ].map(({label,key,type,placeholder}) => (
            <div className="form-group" key={key}>
              <label className="form-label">{label}</label>
              <input type={type} value={form[key]||''} onChange={e=>up(key,e.target.value)}
                style={{ width: '100%' }} placeholder={placeholder} />
            </div>
          ))}
          {[
            {label:'Type',key:'type',options:['Cow','Buffalo']},
            {label:'Breed',key:'breed',options:BREEDS},
            {label:'Gender',key:'gender',options:['Female','Male']},
            {label:'Health Status',key:'healthStatus',options:HEALTH_OPTIONS},
          ].map(({label,key,options}) => (
            <div className="form-group" key={key}>
              <label className="form-label">{label}</label>
              <select value={form[key]||''} onChange={e=>up(key,e.target.value)} style={{ width: '100%' }}>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div className="form-group form-full-width">
            <label className="form-label">Notes</label>
            <textarea value={form.notes||''} onChange={e=>up('notes',e.target.value)} rows={2}
              style={{ width: '100%', resize: 'none' }} placeholder="Any additional notes..." />
          </div>
          <div className="form-group form-full-width checkbox-group">
            <input type="checkbox" id="pregnant" checked={!!form.isPregnant} onChange={e=>up('isPregnant',e.target.checked)}
              className="checkbox-input" />
            <label htmlFor="pregnant" className="form-label" style={{ marginBottom: 0 }}>Currently Pregnant</label>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">
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

const DEMO_ANIMALS = []
