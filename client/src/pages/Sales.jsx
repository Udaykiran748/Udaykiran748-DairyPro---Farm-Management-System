import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiDocumentText } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'

const DEMO_CUSTOMERS = [
  {id:'C001',name:'Sharma Dairy',type:'Wholesale',phone:'9812345678',dailyQuantity:40,ratePerLitre:52,pendingAmount:1040},
  {id:'C002',name:'Ravi Household',type:'Retail',phone:'9723456789',dailyQuantity:3,ratePerLitre:60,pendingAmount:0},
  {id:'C003',name:'School Canteen',type:'Retail',phone:'9634567890',dailyQuantity:8,ratePerLitre:55,pendingAmount:220},
]
const DEMO_SALES = [
  {id:1,customer:{name:'Sharma Dairy'},date:'2025-05-07',quantity:40,ratePerLitre:52,totalAmount:2080,paidAmount:2080,pendingAmount:0,paymentStatus:'Paid',invoiceNo:'INV-001'},
  {id:2,customer:{name:'Ravi Household'},date:'2025-05-07',quantity:3,ratePerLitre:60,totalAmount:180,paidAmount:180,pendingAmount:0,paymentStatus:'Paid',invoiceNo:'INV-002'},
  {id:3,customer:{name:'School Canteen'},date:'2025-05-07',quantity:8,ratePerLitre:55,totalAmount:440,paidAmount:220,pendingAmount:220,paymentStatus:'Partial',invoiceNo:'INV-003'},
]
const SALE_EMPTY = { customerId:'', date:new Date().toISOString().slice(0,10), quantity:'', ratePerLitre:'', paidAmount:'', paymentMode:'Cash', notes:'' }
const CUST_EMPTY = { customerId:'', name:'', type:'Retail', phone:'', email:'', address:'', dailyQuantity:'', ratePerLitre:'', }

export default function Sales() {
  const [tab, setTab] = useState('sales')
  const [sales, setSales] = useState(DEMO_SALES)
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS)
  const [saleModal, setSaleModal] = useState(false)
  const [custModal, setCustModal] = useState(false)
  const [saleForm, setSaleForm] = useState(SALE_EMPTY)
  const [custForm, setCustForm] = useState(CUST_EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/customers').then(r => { if(r.data.data?.length) setCustomers(r.data.data) }).catch(()=>{})
    api.get('/sales').then(r => { if(r.data.data?.length) setSales(r.data.data) }).catch(()=>{})
  }, [])

  const totalRevenue = sales.reduce((s,r)=>s+(r.totalAmount||0), 0)
  const totalPending = customers.reduce((s,c)=>s+(c.pendingAmount||0), 0)
  const totalQty = sales.reduce((s,r)=>s+(r.quantity||0), 0)

  const upS = (k,v) => setSaleForm(f=>({...f,[k]:v}))
  const upC = (k,v) => setCustForm(f=>({...f,[k]:v}))

  const handleSaveSale = async (e) => {
    e.preventDefault(); setSaving(true)
    const total = Number(saleForm.quantity) * Number(saleForm.ratePerLitre)
    const payload = { ...saleForm, totalAmount: total, pendingAmount: total - (Number(saleForm.paidAmount)||0) }
    try { const r = await api.post('/sales', {...payload, customer: saleForm.customerId}); setSales(prev=>[r.data.data,...prev]); toast.success('Sale added!') }
    catch { setSales(prev=>[{...payload, id:Date.now(), customer:{name:customers.find(c=>(c._id||c.id)===saleForm.customerId)?.name||'Customer'}, invoiceNo:'INV-'+Date.now()},...prev]); toast.success('Added! (demo)') }
    finally { setSaving(false); setSaleModal(false) }
  }

  const handleSaveCust = async (e) => {
    e.preventDefault(); setSaving(true)
    try { const r = await api.post('/customers', custForm); setCustomers(prev=>[r.data.data,...prev]); toast.success('Customer added!') }
    catch { setCustomers(prev=>[{...custForm,id:Date.now()},...prev]); toast.success('Added! (demo)') }
    finally { setSaving(false); setCustModal(false) }
  }

  const statusColor = { Paid:'green', Pending:'red', Partial:'yellow' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div><h1 className="page-title">Sales & Billing</h1><p className="text-sm text-gray-500 mt-0.5">Manage customers, sales, and invoices</p></div>
        <div className="flex gap-2">
          <button onClick={()=>{setCustForm(CUST_EMPTY);setCustModal(true)}} className="btn-ghost flex items-center gap-2"><HiPlus className="w-4 h-4" />Add Customer</button>
          <button onClick={()=>{setSaleForm(SALE_EMPTY);setSaleModal(true)}} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" />New Sale</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {label:'Total Revenue',value:`₹${totalRevenue.toLocaleString('en-IN')}`,icon:'💰',color:'bg-primary-500'},
          {label:'Total Qty Sold',value:`${totalQty}L`,icon:'🥛',color:'bg-blue-500'},
          {label:'Pending Dues',value:`₹${totalPending.toLocaleString('en-IN')}`,icon:'⏳',color:'bg-red-500'},
          {label:'Customers',value:customers.length,icon:'👥',color:'bg-purple-500'},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="glass-card p-4">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl text-white mb-3`}>{s.icon}</div>
            <div className="text-xl font-display font-bold text-gray-800 dark:text-gray-100">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800">
        {['sales','customers'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all capitalize ${tab===t ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'sales' ? '🧾 Sales Records' : '👥 Customers'}
          </button>
        ))}
      </div>

      {tab === 'sales' ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-primary-50 dark:bg-gray-800/60">
                {['Invoice','Customer','Date','Qty','Rate','Total','Paid','Pending','Status'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {sales.map(s=>(
                  <tr key={s._id||s.id} className="hover:bg-primary-50/40 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.invoiceNo}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">{s.customer?.name}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.date?.slice(0,10)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{s.quantity}L</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{s.ratePerLitre}/L</td>
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-gray-100">₹{s.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-primary-600 dark:text-primary-400">₹{s.paidAmount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-red-500">{s.pendingAmount > 0 ? `₹${s.pendingAmount.toLocaleString('en-IN')}` : '—'}</td>
                    <td className="px-4 py-3"><Badge label={s.paymentStatus} color={statusColor[s.paymentStatus]||'gray'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c,i)=>(
            <motion.div key={c._id||c.id} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:i*0.07}} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{c.name}</h3>
                  <Badge label={c.type} color={c.type==='Wholesale'?'purple':'blue'} />
                </div>
                <div className="text-2xl font-display font-bold text-primary-600 dark:text-primary-400">{c.dailyQuantity}L<span className="text-xs font-normal text-gray-400">/day</span></div>
              </div>
              <div className="space-y-1.5 text-sm text-gray-500">
                <div>📞 {c.phone}</div>
                <div>💰 Rate: ₹{c.ratePerLitre}/L</div>
              </div>
              {c.pendingAmount > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-red-500 font-medium">⚠️ Pending: ₹{c.pendingAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={saleModal} onClose={()=>setSaleModal(false)} title="Record Sale">
        <form onSubmit={handleSaveSale} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
            <select value={saleForm.customerId} onChange={e=>upS('customerId',e.target.value)} className="input-field" required>
              <option value="">Select Customer</option>
              {customers.map(c=><option key={c._id||c.id} value={c._id||c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input type="date" value={saleForm.date} onChange={e=>upS('date',e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity (L)</label>
              <input type="number" step="0.1" value={saleForm.quantity} onChange={e=>upS('quantity',e.target.value)} className="input-field" placeholder="0" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate (₹/L)</label>
              <input type="number" step="0.5" value={saleForm.ratePerLitre} onChange={e=>upS('ratePerLitre',e.target.value)} className="input-field" placeholder="55" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paid Amount (₹)</label>
              <input type="number" value={saleForm.paidAmount} onChange={e=>upS('paidAmount',e.target.value)} className="input-field" placeholder="0" />
            </div>
          </div>
          {saleForm.quantity && saleForm.ratePerLitre && (
            <div className="p-3 bg-primary-50 dark:bg-primary-950/30 rounded-xl text-center">
              <span className="font-bold text-primary-700 dark:text-primary-300">
                Total: ₹{(Number(saleForm.quantity)*Number(saleForm.ratePerLitre)).toLocaleString('en-IN')}
              </span>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Mode</label>
            <select value={saleForm.paymentMode} onChange={e=>upS('paymentMode',e.target.value)} className="input-field">
              {['Cash','Online','Credit'].map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={()=>setSaleModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'Saving...':'Record Sale'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={custModal} onClose={()=>setCustModal(false)} title="Add Customer" size="lg">
        <form onSubmit={handleSaveCust} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{label:'Customer ID',key:'customerId'},{label:'Name',key:'name'},{label:'Phone',key:'phone',type:'tel'},{label:'Email',key:'email',type:'email'}].map(({label,key,type='text'})=>(
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input type={type} value={custForm[key]||''} onChange={e=>upC(key,e.target.value)} className="input-field" required={['customerId','name','phone'].includes(key)} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select value={custForm.type} onChange={e=>upC('type',e.target.value)} className="input-field">
              {['Retail','Wholesale','Cooperative'].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate (₹/L)</label>
            <input type="number" step="0.5" value={custForm.ratePerLitre||''} onChange={e=>upC('ratePerLitre',e.target.value)} className="input-field" placeholder="55" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Qty (L)</label>
            <input type="number" value={custForm.dailyQuantity||''} onChange={e=>upC('dailyQuantity',e.target.value)} className="input-field" placeholder="10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <input type="text" value={custForm.address||''} onChange={e=>upC('address',e.target.value)} className="input-field" />
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={()=>setCustModal(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'Saving...':'Add Customer'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
