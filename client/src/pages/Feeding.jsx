import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'

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
    try { await api.post('/feeding', form); api.get('/feeding').then(r => { if(r.data.data?.length) setSchedule(r.data.data) }).catch(()=>{}); toast.success('Feed entry added!') }
    catch { setSchedule(prev=>[{...form, id:Date.now(), animals:[{name:'All Animals'}], date: new Date().toISOString().slice(0,10)},...prev]); toast.success('Added! (demo)') }
    finally { setSaving(false); setModalOpen(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div><h1 className="page-title">Feeding Management</h1><p className="text-sm text-gray-500 mt-0.5">Schedule feeds and track inventory</p></div>
        <button onClick={()=>{setForm(EMPTY);setModalOpen(true)}} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" />Log Feed</button>
      </div>

      {lowStock.length > 0 && (
        <div className="glass-card p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">🚨 Low Stock Alert ({lowStock.length} items)</h3>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(i=>(
              <div key={i.id} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-300">
                {i.feedType}: {i.currentStock}{i.unit} (min: {i.minStock}{i.unit})
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800">
        {['schedule','inventory'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all capitalize ${tab===t?'border-primary-600 text-primary-700':'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t==='schedule'?'📋 Feed Schedule':'📦 Stock Inventory'}
          </button>
        ))}
      </div>

      {tab === 'schedule' ? (
        <div className="space-y-3">
          {schedule.map((f,i)=>(
            <motion.div key={f._id||f.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
              className="glass-card p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/30 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-lg">🌿</span>
                <span className="text-xs font-medium text-primary-700 dark:text-primary-400">{f.time}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 dark:text-gray-100 text-base">{f.feedType}</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {f.quantity}{f.unit} — {f.animals?.map(a=>a.name).join(', ')}
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="text-sm text-gray-400">{f.date?.slice(0,10)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.map((item,i)=>{
            const pct = Math.min(100, Math.round((item.currentStock / (item.minStock*3))*100))
            const isLow = item.currentStock <= item.minStock
            return (
              <motion.div key={item._id||item.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
                className={`glass-card p-5 ${isLow?'border-red-200 dark:border-red-800':''}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{item.feedType}</h3>
                  {isLow && <Badge label="Low Stock" color="red" />}
                </div>
                <div className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100 mb-1">
                  {item.currentStock}<span className="text-base font-normal text-gray-400 ml-1">{item.unit}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mt-2 mb-3">
                  <div className={`h-2 rounded-full transition-all ${isLow?'bg-red-500':'bg-primary-500'}`} style={{width:`${pct}%`}} />
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
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
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Feed Type</label>
            <select value={form.feedType} onChange={e=>up('feedType',e.target.value)} className="input-field">
              {FEED_TYPES.map(f=><option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
              <input type="number" value={form.quantity} onChange={e=>up('quantity',e.target.value)} className="input-field" placeholder="50" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
              <select value={form.unit} onChange={e=>up('unit',e.target.value)} className="input-field">
                {['kg','g','litre'].map(u=><option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
            <input type="time" value={form.time} onChange={e=>up('time',e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea value={form.notes||''} onChange={e=>up('notes',e.target.value)} rows={2} className="input-field resize-none" placeholder="Any special instructions..." />
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'Saving...':'Log Feed'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
