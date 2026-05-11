import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiPhone, HiMail } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'

const ROLES = ['Milkman','Farm Worker','Veterinary Assistant','Accountant','Supervisor','Driver','Security','Cook']
const DEMO = [
  {id:1,employeeId:'E001',name:'Raju Kumar',role:'Milkman',salary:12000,attendance:26,phone:'9876543210',email:'raju@farm.com',joinDate:'2022-01-10',isActive:true},
  {id:2,employeeId:'E002',name:'Suresh Yadav',role:'Farm Worker',salary:10000,attendance:28,phone:'9765432109',email:'suresh@farm.com',joinDate:'2021-05-15',isActive:true},
  {id:3,employeeId:'E003',name:'Meena Devi',role:'Accountant',salary:15000,attendance:27,phone:'9654321098',email:'meena@farm.com',joinDate:'2023-03-01',isActive:true},
  {id:4,employeeId:'E004',name:'Prashant Singh',role:'Supervisor',salary:18000,attendance:29,phone:'9543210987',email:'prashant@farm.com',joinDate:'2020-08-20',isActive:true},
]
const EMPTY = { employeeId:'', name:'', role:'', phone:'', email:'', salary:'', joinDate:'', address:'' }

export default function Employees() {
  const [employees, setEmployees] = useState(DEMO)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/employees').then(r => { if(r.data.data?.length) setEmployees(r.data.data) }).catch(()=>{})
  }, [])

  const up = (k,v) => setForm(f=>({...f,[k]:v}))
  const totalSalary = employees.reduce((s,e)=>s+(e.salary||0), 0)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { const r = await api.put(`/employees/${editing}`, form); setEmployees(prev=>prev.map(e=>(e._id||e.id)===editing?r.data.data:e)); toast.success('Updated!') }
      else { const r = await api.post('/employees', form); setEmployees(prev=>[r.data.data,...prev]); toast.success('Employee added!') }
    } catch {
      if (editing) { setEmployees(prev=>prev.map(e=>(e._id||e.id)===editing?{...e,...form}:e)); toast.success('Updated! (demo)') }
      else { setEmployees(prev=>[{...form,id:Date.now()},...prev]); toast.success('Added! (demo)') }
    } finally { setSaving(false); setModalOpen(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/employees/${deleteId}`) } catch {}
    setEmployees(prev=>prev.filter(e=>(e._id||e.id)!==deleteId))
    toast.success('Employee removed'); setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div><h1 className="page-title">Employees</h1><p className="text-sm text-gray-500 mt-0.5">Manage farm staff, salaries, and attendance</p></div>
        <button onClick={()=>{setForm(EMPTY);setEditing(null);setModalOpen(true)}} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" />Add Employee</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {label:'Total Staff',value:employees.length,icon:'👥',color:'bg-blue-500'},
          {label:'Monthly Payroll',value:`₹${totalSalary.toLocaleString('en-IN')}`,icon:'💰',color:'bg-primary-500'},
          {label:'Avg Attendance',value:`${Math.round(employees.reduce((s,e)=>s+(e.attendance||0),0)/Math.max(employees.length,1))} days`,icon:'📅',color:'bg-purple-500'},
          {label:'Active',value:employees.filter(e=>e.isActive!==false).length,icon:'✅',color:'bg-earth-500'},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="glass-card p-4">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl text-white mb-3`}>{s.icon}</div>
            <div className="text-xl font-display font-bold text-gray-800 dark:text-gray-100">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {employees.map((emp,i)=>(
          <motion.div key={emp._id||emp.id} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:i*0.07}}
            className="glass-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                {emp.name?.charAt(0)}
              </div>
              <div className="flex gap-1">
                <button onClick={()=>{setForm({...emp,joinDate:emp.joinDate?.slice(0,10)||''});setEditing(emp._id||emp.id);setModalOpen(true)}}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"><HiPencil className="w-4 h-4" /></button>
                <button onClick={()=>setDeleteId(emp._id||emp.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"><HiTrash className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">{emp.name}</h3>
            <Badge label={emp.role} color="blue" />
            <div className="mt-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2"><HiPhone className="w-3.5 h-3.5" />{emp.phone}</div>
              {emp.email && <div className="flex items-center gap-2"><HiMail className="w-3.5 h-3.5" />{emp.email}</div>}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div><div className="text-xs text-gray-400">Salary</div><div className="font-bold text-primary-600 dark:text-primary-400">₹{emp.salary?.toLocaleString('en-IN')}</div></div>
              <div className="text-right"><div className="text-xs text-gray-400">Attendance</div><div className="font-bold text-gray-700 dark:text-gray-300">{emp.attendance||0}/30</div></div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing ? 'Edit Employee' : 'Add Employee'} size="lg">
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {label:'Employee ID',key:'employeeId',placeholder:'E005'},
            {label:'Full Name',key:'name',placeholder:'John Doe'},
            {label:'Phone',key:'phone',type:'tel',placeholder:'9876543210'},
            {label:'Email',key:'email',type:'email',placeholder:'john@farm.com'},
            {label:'Salary (₹)',key:'salary',type:'number',placeholder:'10000'},
            {label:'Join Date',key:'joinDate',type:'date'},
          ].map(({label,key,type='text',placeholder=''})=>(
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input type={type} value={form[key]||''} onChange={e=>up(key,e.target.value)} className="input-field" placeholder={placeholder} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select value={form.role||''} onChange={e=>up('role',e.target.value)} className="input-field">
              <option value="">Select Role</option>
              {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <input type="text" value={form.address||''} onChange={e=>up('address',e.target.value)} className="input-field" placeholder="Village, District" />
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={()=>setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'Saving...':editing?'Update':'Add Employee'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete}
        title="Remove Employee" message="Are you sure you want to remove this employee?" />
    </div>
  )
}
