import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../services/api'
import StatCard from '../components/common/StatCard'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

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
      .catch(() => {
        // Use mock data for demo
        setStats({
          totalAnimals: 28, totalEmployees: 5, todayMilkProduction: 121,
          monthlyIncome: 145200, monthlyExpenses: 62200, monthlyProfit: 83000,
          upcomingVaccinations: 3, monthlySalesQty: 2620
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader text="Loading dashboard..." />

  const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${n?.toLocaleString('en-IN')}`

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 bg-gradient-to-r from-primary-600 to-emerald-600 text-white border-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-display font-bold">Good morning! 🌅</h1>
            <p className="text-primary-100 text-sm mt-1">Here's your farm overview for today</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
            <div className="text-primary-200 text-xs mt-0.5">🌤 28°C | Clear skies</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Milk Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="section-title mb-4">Weekly Milk Production</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_WEEKLY} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(v) => [`${v}L`, 'Milk']} />
              <Bar dataKey="milk" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Pie */}
        <div className="glass-card p-5">
          <h3 className="section-title mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={MOCK_PIE} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name }) => name} labelLine={false}>
                {MOCK_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {MOCK_PIE.map((e, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{e.name}</span>
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">₹{e.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="section-title mb-4">🔔 Recent Alerts</h3>
          <div className="space-y-3">
            {[
              { type: 'warning', msg: 'Vaccination due for Lakshmi (A001) in 3 days', time: 'Today' },
              { type: 'info', msg: 'Feed stock low: Hay (15kg remaining)', time: '2h ago' },
              { type: 'success', msg: 'Milk collection completed: 121L total', time: '6h ago' },
              { type: 'warning', msg: 'Nandini (A003) showing signs of fatigue', time: 'Yesterday' },
            ].map((a, i) => (
              <div key={i} className={`flex gap-3 p-3 rounded-xl text-sm ${
                a.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/20' :
                a.type === 'success' ? 'bg-green-50 dark:bg-green-950/20' : 'bg-blue-50 dark:bg-blue-950/20'}`}>
                <span className="flex-shrink-0">{a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✅' : 'ℹ️'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 dark:text-gray-300">{a.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="section-title mb-4">📋 Today's Schedule</h3>
          <div className="space-y-3">
            {[
              { time: '05:00', task: 'Morning milk collection', done: true },
              { time: '07:00', task: 'Feed all animals (Hay + Concentrate)', done: true },
              { time: '09:00', task: 'Health check for Kaveri (A004)', done: false },
              { time: '17:00', task: 'Evening milk collection', done: false },
              { time: '18:00', task: 'Vaccination reminder: Ganga (A002)', done: false },
            ].map((s, i) => (
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl text-sm ${s.done ? 'opacity-50' : ''}`}>
                <div className={`w-14 text-xs font-mono font-medium ${s.done ? 'text-gray-400' : 'text-primary-600'}`}>{s.time}</div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.done ? 'bg-gray-300' : 'bg-primary-500'}`} />
                <span className={s.done ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}>{s.task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
