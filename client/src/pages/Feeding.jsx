import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'
import '../styles/Feeding.css'

const FEED_TYPES = ['Hay','Green Fodder','Concentrate','Silage','Wheat Straw','Rice Straw','Mineral Mix','Cotton Seed Cake']
const DEMO_SCHEDULE = [
  {id:1,feedType:'Hay',quantity:50,unit:'kg',time:'06:00 AM',animals:[{name:'All Animals'}],date:'2025-05-07'},
  {id:2,feedType:'Concentrate',quantity:25,unit:'kg',time:'07:00 AM',animals:[{name:'Lactating Cows'}],date:'2025-05-07'},
  {id:3,feedType:'Green Fodder',quantity:100,unit:'kg',time:'12:00 PM',animals:[{name:'All Animals'}],date:'2025-05-07'},
  {id:4,feedType:'Mineral Mix',quantity:2,unit:'kg',time:'06:00 PM',animals:[{name:'All Animals'}],date:'2025-05-07'},
]
const DEMO_INVENTORY = [
  {id:1,feedType:'Hay',currentStock:350,unit:'kg',minStock:100,pricePerUnit:8,supplier:'Ram Traders'},
  {id:2,feedType:'Concentrate',currentStock:80,unit:'kg',minStock:50,pricePerUnit:25,supplier:'AgriMart'},
  {id:3,feedType:'Green Fodder',currentStock:40,unit:'kg',minStock:100,pricePerUnit:3,supplier:'Local Farm'},
  {id:4,feedType:'Mineral Mix',currentStock:15,unit:'kg',minStock:10,pricePerUnit:120,supplier:'VetSupply'},
]
const EMPTY = { feedType:'Hay', quantity:'', unit:'kg', time:'', notes:'' }

export default function Feeding() {
  const [schedule, setSchedule] = useState(DEMO_SCHEDULE)
  const [inventory, setInventory] = useState(DEMO_INVENTORY)
  const [tab, setTab] = useState('schedule')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/feeding/inventory').then(r => { if(r.data.data?.length) setInventory(r.data.data) }).catch(()=>{})
    api.get('/feeding').then(r => { if(r.data.data?.length) setSchedule(r.data.data) }).catch(()=>{})
  }, [])

  const up = (k,v) => setForm(f=>({...f,[k]:v}))
  const lowStock = inventory.filter(i => i.currentStock <= i.minStock)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try { 
      await api.post('/feeding', form); 
      api.get('/feeding').then(r => { if(r.data.data?.length) setSchedule(r.data.data) }).catch(()=>{}); 
      toast.success('Feed entry added!') 
      setModalOpen(false)
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to save feed entry')
    } finally { setSaving(false) }
  }

  return (
    <div className="feeding-page">
      <div className="feeding-header">
        <div><h1 className="page-title">Feeding Management</h1><p className="page-subtitle">Schedule feeds and track inventory</p></div>
        <button onClick={()=>{setForm(EMPTY);setModalOpen(true)}} className="btn btn-primary"><HiPlus style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />Log Feed</button>
      </div>

      {lowStock.length > 0 && (
        <div className="card alert-box">
          <h3 className="alert-title">🚨 Low Stock Alert ({lowStock.length} items)</h3>
          <div className="alert-tags">
            {lowStock.map(i=>(
              <div key={i.id} className="alert-tag">
                {i.feedType}: {i.currentStock}{i.unit} (min: {i.minStock}{i.unit})
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tabs-container">
        {['schedule','inventory'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`tab-btn ${tab===t?'active':''}`}>
            {t==='schedule'?'📋 Feed Schedule':'📦 Stock Inventory'}
          </button>
        ))}
      </div>

      {tab === 'schedule' ? (
        <div className="schedule-list">
          {schedule.map((f,i)=>(
            <motion.div key={f._id||f.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
              className="card schedule-item">
              <div className="schedule-icon-box">
                <span className="schedule-icon">🌿</span>
                <span className="schedule-time">{f.time}</span>
              </div>
              <div className="schedule-content">
                <div className="schedule-title">{f.feedType}</div>
                <div className="schedule-desc">
                  {f.quantity}{f.unit} — {f.animals?.map(a=>a.name).join(', ')}
                </div>
              </div>
              <div className="schedule-date">
                {f.date?.slice(0,10)}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="inventory-grid">
          {inventory.map((item,i)=>{
            const pct = Math.min(100, Math.round((item.currentStock / (item.minStock*3))*100))
            const isLow = item.currentStock <= item.minStock
            return (
              <motion.div key={item._id||item.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
                className={`card inventory-card ${isLow?'low-stock':''}`}>
                <div className="inventory-card-header">
                  <h3 className="inventory-title">{item.feedType}</h3>
                  {isLow && <Badge label="Low Stock" color="red" />}
                </div>
                <div className="inventory-stock">
                  {item.currentStock}<span className="inventory-unit">{item.unit}</span>
                </div>
                <div className="progress-track">
                  <div className={`progress-bar ${isLow?'progress-danger':'progress-primary'}`} style={{width:`${pct}%`}} />
                </div>
                <div className="inventory-details">
                  <div>Min required: {item.minStock}{item.unit}</div>
                  <div>Price: ₹{item.pricePerUnit}/{item.unit}</div>
                  <div>Supplier: {item.supplier}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title="Log Feed Entry">
        <form onSubmit={handleSave} className="modal-form">
          <div className="form-group">
            <label className="form-label">Feed Type</label>
            <select value={form.feedType} onChange={e=>up('feedType',e.target.value)} style={{ width: '100%' }}>
              {FEED_TYPES.map(f=><option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input type="number" value={form.quantity} onChange={e=>up('quantity',e.target.value)} style={{ width: '100%' }} placeholder="50" required />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <select value={form.unit} onChange={e=>up('unit',e.target.value)} style={{ width: '100%' }}>
                {['kg','g','litre'].map(u=><option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input type="time" value={form.time} onChange={e=>up('time',e.target.value)} style={{ width: '100%' }} required />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea value={form.notes||''} onChange={e=>up('notes',e.target.value)} rows={2} style={{ width: '100%', resize: 'none' }} placeholder="Any special instructions..." />
          </div>
          <div className="modal-footer">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">{saving?'Saving...':'Log Feed'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
