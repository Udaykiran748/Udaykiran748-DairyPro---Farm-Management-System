import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiDocumentText } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'
import '../styles/Sales.css'

const SALE_EMPTY = { customerId:'', date:new Date().toISOString().slice(0,10), quantity:'', ratePerLitre:'', paidAmount:'', paymentMode:'Cash', notes:'' }
const CUST_EMPTY = { customerId:'', name:'', type:'Retail', phone:'', email:'', address:'', dailyQuantity:'', ratePerLitre:'', }

export default function Sales() {
  const [tab, setTab] = useState('sales')
  const [sales, setSales] = useState([])
  const [customers, setCustomers] = useState([])
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
    try { 
      const r = await api.post('/sales', {...payload, customer: saleForm.customerId}); 
      setSales(prev=>[r.data.data,...prev]); 
      toast.success('Sale added!') 
      setSaleModal(false)
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to save sale')
    } finally { setSaving(false) }
  }

  const handleSaveCust = async (e) => {
    e.preventDefault(); setSaving(true)
    try { 
      const r = await api.post('/customers', custForm); 
      setCustomers(prev=>[r.data.data,...prev]); 
      toast.success('Customer added!') 
      setCustModal(false)
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to save customer')
    } finally { setSaving(false) }
  }

  const statusColor = { Paid:'green', Pending:'red', Partial:'yellow' }

  return (
    <div className="sales-page">
      <div className="sales-header">
        <div><h1 className="page-title">Sales & Billing</h1><p className="page-subtitle">Manage customers, sales, and invoices</p></div>
        <div className="header-actions">
          <button onClick={()=>{setCustForm(CUST_EMPTY);setCustModal(true)}} className="btn btn-outline"><HiPlus style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />Add Customer</button>
          <button onClick={()=>{setSaleForm(SALE_EMPTY);setSaleModal(true)}} className="btn btn-primary"><HiPlus style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />New Sale</button>
        </div>
      </div>

      <div className="stats-grid-4">
        {[
          {label:'Total Revenue',value:`₹${totalRevenue.toLocaleString('en-IN')}`,icon:'💰',colorClass:'stat-icon-primary'},
          {label:'Total Qty Sold',value:`${totalQty}L`,icon:'🥛',colorClass:'stat-icon-blue'},
          {label:'Pending Dues',value:`₹${totalPending.toLocaleString('en-IN')}`,icon:'⏳',colorClass:'stat-icon-red'},
          {label:'Customers',value:customers.length,icon:'👥',colorClass:'stat-icon-purple'},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="card stat-card-custom">
            <div className={`stat-icon-wrapper ${s.colorClass}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="tabs-container">
        {['sales','customers'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`tab-btn ${tab===t ? 'active' : ''}`}>
            {t === 'sales' ? '🧾 Sales Records' : '👥 Customers'}
          </button>
        ))}
      </div>

      {tab === 'sales' ? (
        <div className="card table-wrapper">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr>
                {['Invoice','Customer','Date','Qty','Rate','Total','Paid','Pending','Status'].map(h=>(
                  <th key={h}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {sales.map(s=>(
                  <tr key={s._id||s.id}>
                    <td className="cell-invoice">{s.invoiceNo}</td>
                    <td className="cell-customer">{s.customer?.name}</td>
                    <td className="cell-nowrap">{s.date?.slice(0,10)}</td>
                    <td>{s.quantity}L</td>
                    <td>₹{s.ratePerLitre}/L</td>
                    <td className="cell-bold">₹{s.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="cell-paid">₹{s.paidAmount?.toLocaleString('en-IN')}</td>
                    <td className={s.pendingAmount > 0 ? 'cell-pending' : ''}>{s.pendingAmount > 0 ? `₹${s.pendingAmount.toLocaleString('en-IN')}` : '—'}</td>
                    <td><Badge label={s.paymentStatus} color={statusColor[s.paymentStatus]||'gray'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="customers-grid">
          {customers.map((c,i)=>(
            <motion.div key={c._id||c.id} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:i*0.07}} className="card customer-card">
              <div className="customer-header-row">
                <div>
                  <h3 className="customer-name">{c.name}</h3>
                  <Badge label={c.type} color={c.type==='Wholesale'?'purple':'blue'} />
                </div>
                <div className="customer-qty">{c.dailyQuantity}L<span className="customer-qty-unit">/day</span></div>
              </div>
              <div className="customer-details">
                <div>📞 {c.phone}</div>
                <div>💰 Rate: ₹{c.ratePerLitre}/L</div>
              </div>
              {c.pendingAmount > 0 && (
                <div className="customer-pending-alert">
                  ⚠️ Pending: ₹{c.pendingAmount.toLocaleString('en-IN')}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={saleModal} onClose={()=>setSaleModal(false)} title="Record Sale">
        <form onSubmit={handleSaveSale} className="modal-form">
          <div className="form-group">
            <label className="form-label">Customer</label>
            <select value={saleForm.customerId} onChange={e=>upS('customerId',e.target.value)} style={{ width: '100%' }} required>
              <option value="">Select Customer</option>
              {customers.map(c=><option key={c._id||c.id} value={c._id||c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" value={saleForm.date} onChange={e=>upS('date',e.target.value)} style={{ width: '100%' }} required />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity (L)</label>
              <input type="number" step="0.1" value={saleForm.quantity} onChange={e=>upS('quantity',e.target.value)} style={{ width: '100%' }} placeholder="0" required />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Rate (₹/L)</label>
              <input type="number" step="0.5" value={saleForm.ratePerLitre} onChange={e=>upS('ratePerLitre',e.target.value)} style={{ width: '100%' }} placeholder="55" required />
            </div>
            <div className="form-group">
              <label className="form-label">Paid Amount (₹)</label>
              <input type="number" value={saleForm.paidAmount} onChange={e=>upS('paidAmount',e.target.value)} style={{ width: '100%' }} placeholder="0" />
            </div>
          </div>
          {saleForm.quantity && saleForm.ratePerLitre && (
            <div className="total-display">
              Total: ₹{(Number(saleForm.quantity)*Number(saleForm.ratePerLitre)).toLocaleString('en-IN')}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Payment Mode</label>
            <select value={saleForm.paymentMode} onChange={e=>upS('paymentMode',e.target.value)} style={{ width: '100%' }}>
              {['Cash','Online','Credit'].map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={()=>setSaleModal(false)} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">{saving?'Saving...':'Record Sale'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={custModal} onClose={()=>setCustModal(false)} title="Add Customer" size="lg">
        <form onSubmit={handleSaveCust} className="modal-form-grid-responsive">
          {[{label:'Customer ID',key:'customerId'},{label:'Name',key:'name'},{label:'Phone',key:'phone',type:'tel'},{label:'Email',key:'email',type:'email'}].map(({label,key,type='text'})=>(
            <div className="form-group" key={key}>
              <label className="form-label">{label}</label>
              <input type={type} value={custForm[key]||''} onChange={e=>upC(key,e.target.value)} style={{ width: '100%' }} required={['customerId','name','phone'].includes(key)} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Type</label>
            <select value={custForm.type} onChange={e=>upC('type',e.target.value)} style={{ width: '100%' }}>
              {['Retail','Wholesale','Cooperative'].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Rate (₹/L)</label>
            <input type="number" step="0.5" value={custForm.ratePerLitre||''} onChange={e=>upC('ratePerLitre',e.target.value)} style={{ width: '100%' }} placeholder="55" required />
          </div>
          <div className="form-group">
            <label className="form-label">Daily Qty (L)</label>
            <input type="number" value={custForm.dailyQuantity||''} onChange={e=>upC('dailyQuantity',e.target.value)} style={{ width: '100%' }} placeholder="10" />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" value={custForm.address||''} onChange={e=>upC('address',e.target.value)} style={{ width: '100%' }} />
          </div>
          <div className="form-full-width modal-footer">
            <button type="button" onClick={()=>setCustModal(false)} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">{saving?'Saving...':'Add Customer'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
