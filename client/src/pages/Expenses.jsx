import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'

const CATS = ['Feed','Medicine','Salary','Electricity','Water','Maintenance','Equipment','Other']
const CAT_COLORS = { Feed:'#22c55e', Medicine:'#ef4444', Salary:'#3b82f6', Electricity:'#f59e0b', Water:'#06b6d4', Maintenance:'#8b5cf6', Equipment:'#f97316', Other:'#6b7280' }
const DEMO = [
  {id:1,category:'Feed',amount:18000,date:'2025-05-01',description:'Monthly hay and concentrate'},
  {id:2,category:'Medicine',amount:3500,date:'2025-05-02',description:'Vitamins and deworming'},
  {id:3,category:'Salary',amount:37000,date:'2025-05-05',description:'Staff salaries'},
  {id:4,category:'Electricity',amount:2200,date:'2025-05-05',description:'Monthly bill'},
  {id:5,category:'Maintenance',amount:1500,date:'2025-05-03',description:'Equipment repair'},
]
const EMPTY = { category:'Feed', amount:'', date:new Date().toISOString().slice(0,10), description:'', paidTo:'', paymentMode:'Cash' }

export default function Expenses() {
  const [expenses, setExpenses] = useState(DEMO)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/expenses').then(r => { if(r.data.data?.length) setExpenses(r.data.data) }).catch(()=>{})
  }, [])

  const up = (k,v) => setForm(f=>({...f,[k]:v}))
  const total = expenses.reduce((s,e)=>s+(e.amount||0),0)
  const pieData = CATS.map(c=>({ name:c, value:expenses.filter(e=>e.category===c).reduce((s,e)=>s+(e.amount||0),0), color:CAT_COLORS[c] })).filter(d=>d.value>0)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { const r = await api.put(`/expenses/${editing}`, form); setExpenses(prev=>prev.map(ex=>(ex._id||ex.id)===editing?r.data.data:ex)); toast.success('Updated!') }
      else { const r = await api.post('/expenses', form); setExpenses(prev=>[r.data.data,...prev]); toast.success('Expense added!') }
    } catch {
      if (editing) { setExpenses(prev=>prev.map(ex=>(ex._id||ex.id)===editing?{...ex,...form}:ex)); toast.success('Updated! (demo)') }
      else { setExpenses(prev=>[{...form,id:Date.now()},...prev]); toast.success('Added! (demo)') }
    } finally { setSaving(false); setModalOpen(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/expenses/${deleteId}`) } catch {}
    setExpenses(prev=>prev.filter(e=>(e._id||e.id)!==deleteId))
    toast.success('Deleted'); setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div><h1 className="page-title">Expense Tracking</h1><p className="text-sm text-gray-500 mt-0.5">Monitor all farm expenses and costs</p></div>
        <button onClick={()=>{setForm(EMPTY);setEditing(null);setModalOpen(true)}} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" />Add Expense</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {label:'This Month',value:`₹${total.toLocaleString('en-IN')}`,icon:'💸',color:'bg-red-500'},
          {label:'Largest',value:`₹${Math.max(...expenses.map(e=>e.amount||0)).toLocaleString('en-IN')}`,icon:'📈',color:'bg-orange-500'},
          {label:'Categories',value:new Set(expenses.map(e=>e.category)).size,icon:'📂',color:'bg-blue-500'},
          {label:'Avg/Day',value:`₹${Math.round(total/30).toLocaleString('en-IN')}`,icon:'📅',color:'bg-purple-500'},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="glass-card p-4">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl text-white mb-3`}>{s.icon}</div>
            <div className="text-xl font-display font-bold text-gray-800 dark:text-gray-100">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5">
          <h3 className="section-title mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={65} dataKey="value">
              {pieData.map((d,i)=><Cell key={i} fill={d.color} />)}
            </Pie><Tooltip formatter={v=>[`₹${v.toLocaleString('en-IN')}`,'']} /></PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map((d,i)=>(
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{background:d.color}} /><span className="text-gray-600 dark:text-gray-400">{d.name}</span></div>
                <span className="font-medium text-gray-700 dark:text-gray-300">₹{d.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-primary-50 dark:bg-gray-800/60">
                {['Category','Amount','Date','Description','Payment','Actions'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {expenses.map(exp=>(
                  <tr key={exp._id||exp.id} className="hover:bg-primary-50/40 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{background:CAT_COLORS[exp.category]||'#6b7280'}} />
                        <span className="font-medium text-gray-800 dark:text-gray-100">{exp.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-red-600 dark:text-red-400">₹{exp.amount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{exp.date?.slice(0,10)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-36 truncate">{exp.description}</td>
                    <td className="px-4 py-3"><Badge label={exp.paymentMode||'Cash'} color="gray" /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={()=>{setForm({...exp,date:exp.date?.slice(0,10)});setEditing(exp._id||exp.id);setModalOpen(true)}} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={()=>setDeleteId(exp._id||exp.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><HiTrash className="w-4 h-4" /></button>
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
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select value={form.category} onChange={e=>up('category',e.target.value)} className="input-field">
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e=>up('amount',e.target.value)} className="input-field" placeholder="0" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input type="date" value={form.date} onChange={e=>up('date',e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input type="text" value={form.description} onChange={e=>up('description',e.target.value)} className="input-field" placeholder="Details..." required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paid To</label>
              <input type="text" value={form.paidTo||''} onChange={e=>up('paidTo',e.target.value)} className="input-field" placeholder="Vendor name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Mode</label>
              <select value={form.paymentMode||'Cash'} onChange={e=>up('paymentMode',e.target.value)} className="input-field">
                {['Cash','Online','Cheque'].map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'Saving...':editing?'Update':'Add Expense'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Expense" message="Delete this expense record?" />
    </div>
  )
}
