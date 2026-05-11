import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, HiChartBar, HiHeart, HiUsers, HiShoppingCart } from 'react-icons/hi'

const FEATURES = [
  { icon: '🐄', title: 'Animal Management', desc: 'Track all cows & buffaloes, health status, breeds, and production capacity.', to: '/animals', color: 'from-green-400 to-green-600' },
  { icon: '🥛', title: 'Milk Production', desc: 'Log morning & evening milk sessions. Auto-calculate daily and monthly totals.', to: '/milk', color: 'from-blue-400 to-blue-600' },
  { icon: '🌿', title: 'Feeding Schedule', desc: 'Manage feed types, schedules, stock inventory and low-stock alerts.', to: '/feeding', color: 'from-emerald-400 to-emerald-600' },
  { icon: '💊', title: 'Health & Vaccines', desc: 'Track vaccinations, treatments, vet visits and upcoming health reminders.', to: '/health', color: 'from-red-400 to-red-600' },
  { icon: '👥', title: 'Employees', desc: 'Manage farm staff, attendance, salaries and task assignments.', to: '/employees', color: 'from-purple-400 to-purple-600' },
  { icon: '📊', title: 'Sales & Reports', desc: 'Billing, customer management, profit-loss analysis and exportable reports.', to: '/reports', color: 'from-amber-400 to-amber-600' },
]

const STATS = [
  { value: '500+', label: 'Farms Using DairyPro' },
  { value: '50K+', label: 'Animals Tracked' },
  { value: '₹2Cr+', label: 'Revenue Managed' },
  { value: '99.9%', label: 'Uptime' },
]

export default function Home() {
  return (
    <div className="space-y-16 -m-4 md:-m-6">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-700 text-white px-6 py-20 md:py-32">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="text-7xl mb-6 animate-float">🐄</div>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
              Smart Dairy Farm<br />
              <span className="text-primary-200">Management System</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Complete farm management for dairy owners, farmers, and milk collection centers. Track animals, milk, sales, health, and profits — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl">
                Open Dashboard <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="text-center glass-card p-6">
              <div className="text-3xl font-display font-bold text-primary-600 dark:text-primary-400">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100 mb-3">Everything You Need</h2>
          <p className="text-gray-500 max-w-xl mx-auto">From tracking individual cows to managing your entire farm business — DairyPro has you covered.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 group cursor-pointer" onClick={() => window.location.href = f.to}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-gray-800 dark:text-gray-100 text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              <div className="flex items-center gap-1 mt-4 text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
                Open <HiArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto text-center glass-card p-12 bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-950/30 dark:to-emerald-950/30 border-primary-100">
          <div className="text-5xl mb-4">🌾</div>
          <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100 mb-3">Ready to Transform Your Farm?</h2>
          <p className="text-gray-500 mb-8">Join hundreds of dairy farmers who manage their farm smarter with DairyPro.</p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3.5">
            Get Started Free <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
