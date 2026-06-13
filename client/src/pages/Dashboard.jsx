import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../services/api'
import StatCard from '../components/common/StatCard'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'
import '../styles/Dashboard.css'

const MOCK_WEEKLY = [
  { day: 'Mon', milk: 112 }, { day: 'Tue', milk: 118 }, { day: 'Wed', milk: 109 },
  { day: 'Thu', milk: 122 }, { day: 'Fri', milk: 115 }, { day: 'Sat', milk: 125 }, { day: 'Sun', milk: 120 }
]
const MOCK_PIE = [
  { name: 'Feed', value: 18000, color: '#22c55e' },
  { name: 'Medicine', value: 3500, color: '#f59e0b' },
  { name: 'Salary', value: 37000, color: '#3b82f6' },
  { name: 'Electricity', value: 2200, color: '#8b5cf6' },
  { name: 'Other', value: 1500, color: '#ef4444' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(r => setStats(r.data.data))
      .catch(() => toast.error('Failed to load dashboard stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader text="Loading dashboard..." />

  const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${n?.toLocaleString('en-IN')}`

  return (
    <div className="dashboard-page">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="card dashboard-welcome">
        <div className="welcome-content">
          <div>
            <h1 className="welcome-title">Good morning! 🌅</h1>
            <p className="welcome-subtitle">Here's your farm overview for today</p>
          </div>
          <div className="welcome-date-container">
            <div className="welcome-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
            <div className="welcome-weather">🌤 28°C | Clear skies</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid-4">
        {[
          { icon: '🐄', label: 'Total Animals', value: stats?.totalAnimals || 0, sub: 'Active herd', color: 'green' },
          { icon: '🥛', label: "Today's Milk", value: `${stats?.todayMilkProduction || 0}L`, sub: 'Total production', color: 'blue', trend: 5 },
          { icon: '💰', label: 'Monthly Income', value: fmt(stats?.monthlyIncome), sub: `${stats?.monthlySalesQty || 0}L sold`, color: 'earth', trend: 12 },
          { icon: '📈', label: 'Net Profit', value: fmt(stats?.monthlyProfit), sub: 'This month', color: stats?.monthlyProfit >= 0 ? 'green' : 'red' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Second Row */}
      <div className="stats-grid-4">
        {[
          { icon: '👥', label: 'Employees', value: stats?.totalEmployees || 0, sub: 'Farm staff', color: 'purple' },
          { icon: '💊', label: 'Vaccinations Due', value: stats?.upcomingVaccinations || 0, sub: 'Within 7 days', color: 'red' },
          { icon: '💸', label: 'Monthly Expenses', value: fmt(stats?.monthlyExpenses), sub: 'Total costs', color: 'earth' },
          { icon: '📦', label: 'Low Stock Alerts', value: '2', sub: 'Items to reorder', color: 'red' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Weekly Milk Chart */}
        <div className="card chart-card-large">
          <h3 className="section-title">Weekly Milk Production</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_WEEKLY} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(v) => [`${v}L`, 'Milk']} />
              <Bar dataKey="milk" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Pie */}
        <div className="card chart-card-small">
          <h3 className="section-title">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={MOCK_PIE} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name }) => name} labelLine={false}>
                {MOCK_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {MOCK_PIE.map((e, i) => (
              <div key={i} className="pie-legend-item">
                <div className="pie-legend-label">
                  <div className="pie-legend-color" style={{ background: e.color }} />
                  <span>{e.name}</span>
                </div>
                <span className="pie-legend-value">₹{e.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts & Activity */}
      <div className="alerts-grid">
        <div className="card">
          <h3 className="section-title">🔔 Recent Alerts</h3>
          <div className="alerts-container">
            {[
              { type: 'info', msg: 'Feed stock low: Hay (15kg remaining)', time: '2h ago' },
              { type: 'success', msg: 'Milk collection completed: 121L total', time: '6h ago' },
            ].map((a, i) => (
              <div key={i} className={`alert-item alert-${a.type}`}>
                <span>{a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✅' : 'ℹ️'}</span>
                <div className="alert-content">
                  <p className="alert-message">{a.msg}</p>
                  <p className="alert-time">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">📋 Today's Schedule</h3>
          <div className="schedule-container">
            {[
              { time: '05:00', task: 'Morning milk collection', done: true },
              { time: '07:00', task: 'Feed all animals (Hay + Concentrate)', done: true },
              { time: '17:00', task: 'Evening milk collection', done: false },
            ].map((s, i) => (
              <div key={i} className={`schedule-item ${s.done ? 'done' : ''}`}>
                <div className="schedule-time">{s.time}</div>
                <div className="schedule-dot" />
                <span className="schedule-task">{s.task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
