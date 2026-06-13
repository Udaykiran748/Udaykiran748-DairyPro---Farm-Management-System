import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiPhone, HiMail } from 'react-icons/hi'
import api from '../services/api'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Badge from '../components/common/Badge'
import toast from 'react-hot-toast'
import '../styles/Employees.css'

const ROLES = ['Milkman', 'Farm Worker', 'Veterinary Assistant', 'Accountant', 'Supervisor', 'Driver', 'Security', 'Cook']
const EMPTY = { employeeId: '', name: '', role: '', phone: '', email: '', salary: '', joinDate: '', address: '' }

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/employees').then(r => { if (r.data.data?.length) setEmployees(r.data.data) }).catch(() => { })
  }, [])

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const totalSalary = employees.reduce((s, e) => s + (e.salary || 0), 0)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { const r = await api.put(`/employees/${editing}`, form); setEmployees(prev => prev.map(e => (e._id || e.id) === editing ? r.data.data : e)); toast.success('Updated!') }
      else { const r = await api.post('/employees', form); setEmployees(prev => [r.data.data, ...prev]); toast.success('Employee added!') }
      setModalOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save employee')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/employees/${deleteId}`)
      setEmployees(prev => prev.filter(e => (e._id || e.id) !== deleteId))
      toast.success('Employee removed'); setDeleteId(null)
    } catch (err) { toast.error('Failed to delete employee') }
  }

  return (
    <div className="employees-page">
      <div className="employees-header">
        <div><h1 className="page-title">Employees</h1><p className="page-subtitle">Manage farm staff, salaries, and attendance</p></div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setModalOpen(true) }} className="btn btn-primary"><HiPlus style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />Add Employee</button>
      </div>

      <div className="stats-grid-4">
        {[
          { label: 'Total Staff', value: employees.length, icon: '👥', colorClass: 'stat-icon-blue' },
          { label: 'Monthly Payroll', value: `₹${totalSalary.toLocaleString('en-IN')}`, icon: '💰', colorClass: 'stat-icon-primary' },
          { label: 'Avg Attendance', value: `${Math.round(employees.reduce((s, e) => s + (e.attendance || 0), 0) / Math.max(employees.length, 1))} days`, icon: '📅', colorClass: 'stat-icon-purple' },
          { label: 'Active', value: employees.filter(e => e.isActive !== false).length, icon: '✅', colorClass: 'stat-icon-earth' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card stat-card-custom">
            <div className={`stat-icon-wrapper ${s.colorClass}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="employees-grid">
        {employees.map((emp, i) => (
          <motion.div key={emp._id || emp.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
            className="card employee-card">
            <div className="employee-header-row">
              <div className="employee-avatar">
                {emp.name?.charAt(0)}
              </div>
              <div className="employee-actions">
                <button onClick={() => { setForm({ ...emp, joinDate: emp.joinDate?.slice(0, 10) || '' }); setEditing(emp._id || emp.id); setModalOpen(true) }}
                  className="icon-btn icon-btn-edit"><HiPencil /></button>
                <button onClick={() => setDeleteId(emp._id || emp.id)}
                  className="icon-btn icon-btn-delete"><HiTrash /></button>
              </div>
            </div>
            <h3 className="employee-name">{emp.name}</h3>
            <Badge label={emp.role} color="blue" />
            <div className="employee-contact">
              <div className="contact-item"><HiPhone />{emp.phone}</div>
              {emp.email && <div className="contact-item"><HiMail />{emp.email}</div>}
            </div>
            <div className="employee-footer">
              <div><div className="employee-footer-label">Salary</div><div className="employee-salary">₹{emp.salary?.toLocaleString('en-IN')}</div></div>
              <div className="employee-attendance"><div className="employee-footer-label">Attendance</div><div className="employee-attendance-val">{emp.attendance || 0}/30</div></div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Employee' : 'Add Employee'} size="lg">
        <form onSubmit={handleSave} className="modal-form-grid">
          {[
            { label: 'Employee ID', key: 'employeeId', placeholder: 'E005', req: true },
            { label: 'Full Name', key: 'name', placeholder: 'John Doe', req: true },
            { label: 'Phone', key: 'phone', type: 'tel', placeholder: '9876543210', req: true },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'john@farm.com' },
            { label: 'Salary (₹)', key: 'salary', type: 'number', placeholder: '10000', req: true },
            { label: 'Join Date', key: 'joinDate', type: 'date', req: true },
          ].map(({ label, key, type = 'text', placeholder = '', req = false }) => (
            <div className="form-group" key={key}>
              <label className="form-label">{label}</label>
              <input type={type} value={form[key] || ''} onChange={e => up(key, e.target.value)} style={{ width: '100%' }} placeholder={placeholder} required={req} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Role</label>
            <select value={form.role || ''} onChange={e => up('role', e.target.value)} style={{ width: '100%' }} required>
              <option value="">Select Role</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" value={form.address || ''} onChange={e => up('address', e.target.value)} style={{ width: '100%' }} placeholder="Village, District" />
          </div>
          <div className="modal-footer">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Add Employee'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Remove Employee" message="Are you sure you want to remove this employee?" />
    </div>
  )
}
