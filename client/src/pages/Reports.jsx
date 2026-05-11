import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts'

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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div><h1 className="page-title">Reports & Analytics</h1><p className="text-sm text-gray-500 mt-0.5">Comprehensive farm performance insights</p></div>
        <div className="flex gap-2">
          <button className="btn-ghost text-sm flex items-center gap-2">📥 Export Excel</button>
          <button className="btn-secondary text-sm flex items-center gap-2">📄 Export PDF</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {label:'YTD Milk',value:'14,070L',icon:'🥛',trend:'+8%'},
          {label:'YTD Revenue',value:'₹7.31L',icon:'💰',trend:'+12%'},
          {label:'YTD Expenses',value:'₹2.97L',icon:'💸',trend:'+5%'},
          {label:'YTD Profit',value:'₹4.34L',icon:'📈',trend:'+18%'},
        ].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="glass-card p-4">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-display font-bold text-gray-800 dark:text-gray-100">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-xs text-primary-600 font-medium mt-1">{s.trend} vs last year</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800 flex-wrap">
        {['production','financial','animals'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all capitalize ${tab===t?'border-primary-600 text-primary-700':'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t==='production'?'🥛 Production':t==='financial'?'💰 Financial':'🐄 Animals'}
          </button>
        ))}
      </div>

      {tab === 'production' && (
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="section-title mb-4">Monthly Milk Production (Litres)</h3>
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
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {MONTHLY.map(m=>(
              <div key={m.month} className="glass-card p-4 text-center">
                <div className="font-bold text-primary-600 dark:text-primary-400 text-lg">{m.milk}L</div>
                <div className="text-xs text-gray-500 mt-1">{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'financial' && (
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="section-title mb-4">Revenue vs Expenses vs Profit</h3>
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
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="section-title">Monthly Summary Table</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-primary-50 dark:bg-gray-800/60">
                  {['Month','Milk (L)','Revenue','Expenses','Profit','Margin'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {MONTHLY.map(m=>(
                    <tr key={m.month} className="hover:bg-primary-50/40 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">{m.month}</td>
                      <td className="px-4 py-3 text-blue-600">{m.milk.toLocaleString()}</td>
                      <td className="px-4 py-3 text-primary-600 font-medium">₹{m.sales.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-red-500">₹{m.expenses.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-primary-700 dark:text-primary-400 font-bold">₹{m.profit.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{Math.round(m.profit/m.sales*100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'animals' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {name:'Lakshmi',id:'A001',avgMilk:21.5,healthScore:92,trend:[20,22,21,23,21,22,22]},
            {name:'Ganga',id:'A002',avgMilk:18.0,healthScore:98,trend:[17,18,19,18,18,17,19]},
            {name:'Nandini',id:'A003',avgMilk:14.0,healthScore:85,trend:[13,14,14,13,15,14,14]},
            {name:'Yamuna',id:'A005',avgMilk:19.5,healthScore:99,trend:[19,20,19,21,19,20,19]},
          ].map((a,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{a.name}</h3>
                  <div className="text-xs text-gray-400 font-mono">{a.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-primary-600 dark:text-primary-400">{a.avgMilk}L</div>
                  <div className="text-xs text-gray-400">avg/day</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={a.trend.map((v,j)=>({d:j,v}))}>
                  <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-gray-500">Health Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-primary-500" style={{width:`${a.healthScore}%`}} />
                  </div>
                  <span className="font-medium text-primary-600 dark:text-primary-400">{a.healthScore}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
