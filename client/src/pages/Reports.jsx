import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts'
import '../styles/Reports.css'

const MONTHLY = [
  {month:'Jan',milk:2800,sales:145600,expenses:58000,profit:87600},
  {month:'Feb',milk:2650,sales:137800,expenses:55000,profit:82800},
  {month:'Mar',milk:2900,sales:150800,expenses:60000,profit:90800},
  {month:'Apr',milk:3100,sales:161200,expenses:62000,profit:99200},
  {month:'May',milk:2620,sales:136240,expenses:62200,profit:74040},
]

export default function Reports() {
  const [tab, setTab] = useState('production')

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div><h1 className="page-title">Reports & Analytics</h1><p className="page-subtitle">Comprehensive farm performance insights</p></div>
        <div className="header-actions">
          <button className="btn btn-outline" style={{ fontSize: '0.875rem' }}>📥 Export Excel</button>
          <button className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>📄 Export PDF</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid-4">
        {[
          {label:'YTD Milk',value:'14,070L',icon:'🥛',trend:'+8%'},
          {label:'YTD Revenue',value:'₹7.31L',icon:'💰',trend:'+12%'},
          {label:'YTD Expenses',value:'₹2.97L',icon:'💸',trend:'+5%'},
          {label:'YTD Profit',value:'₹4.34L',icon:'📈',trend:'+18%'},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="card stat-card-custom">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-trend">{s.trend} vs last year</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {['production','financial','animals'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`tab-btn ${tab===t?'active':''}`}>
            {t==='production'?'🥛 Production':t==='financial'?'💰 Financial':'🐄 Animals'}
          </button>
        ))}
      </div>

      {tab === 'production' && (
        <div className="tab-content">
          <div className="card chart-card">
            <h3 className="section-title">Monthly Milk Production (Litres)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={MONTHLY}>
                <defs>
                  <linearGradient id="milkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{fontSize:12,fill:'#9ca3af'}} />
                <YAxis tick={{fontSize:12,fill:'#9ca3af'}} />
                <Tooltip formatter={v=>[`${v}L`,'Milk']} contentStyle={{borderRadius:'12px',fontSize:12}} />
                <Area type="monotone" dataKey="milk" stroke="#22c55e" strokeWidth={3} fill="url(#milkGrad)" dot={{fill:'#22c55e',r:5}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="monthly-grid-5">
            {MONTHLY.map(m=>(
              <div key={m.month} className="card monthly-card">
                <div className="monthly-value">{m.milk}L</div>
                <div className="monthly-label">{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'financial' && (
        <div className="tab-content">
          <div className="card chart-card">
            <h3 className="section-title">Revenue vs Expenses vs Profit</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{fontSize:12,fill:'#9ca3af'}} />
                <YAxis tick={{fontSize:12,fill:'#9ca3af'}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v,n)=>[`₹${v.toLocaleString('en-IN')}`,n]} contentStyle={{borderRadius:'12px',fontSize:12}} />
                <Legend />
                <Bar dataKey="sales" name="Revenue" fill="#22c55e" radius={[4,4,0,0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4,4,0,0]} />
                <Bar dataKey="profit" name="Profit" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card table-wrapper">
            <div className="table-header">
              <h3 className="section-title" style={{ marginBottom: 0 }}>Monthly Summary Table</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead><tr>
                  {['Month','Milk (L)','Revenue','Expenses','Profit','Margin'].map(h=>(
                    <th key={h}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {MONTHLY.map(m=>(
                    <tr key={m.month}>
                      <td className="cell-month">{m.month}</td>
                      <td className="cell-blue">{m.milk.toLocaleString()}</td>
                      <td className="cell-primary">₹{m.sales.toLocaleString('en-IN')}</td>
                      <td className="cell-red">₹{m.expenses.toLocaleString('en-IN')}</td>
                      <td className="cell-profit">₹{m.profit.toLocaleString('en-IN')}</td>
                      <td className="cell-margin">{Math.round(m.profit/m.sales*100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'animals' && (
        <div className="animals-grid">
          {[].map((a,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="card animal-card">
              <div className="animal-header-row">
                <div>
                  <h3 className="animal-name">{a.name}</h3>
                  <div className="animal-id">{a.id}</div>
                </div>
                <div className="animal-avg-wrapper">
                  <div className="animal-avg-value">{a.avgMilk}L</div>
                  <div className="animal-avg-label">avg/day</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={a.trend.map((v,j)=>({d:j,v}))}>
                  <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="health-score-row">
                <span className="health-score-label">Health Score</span>
                <div className="health-score-track">
                  <div className="progress-track">
                    <div className="progress-bar" style={{width:`${a.healthScore}%`}} />
                  </div>
                  <span className="health-score-value">{a.healthScore}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
