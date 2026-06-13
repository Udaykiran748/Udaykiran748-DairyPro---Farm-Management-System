import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, HiChartBar, HiHeart, HiUsers, HiShoppingCart } from 'react-icons/hi'
import '../styles/Home.css'

const FEATURES = [
  { icon: '🐄', title: 'Animal Management', desc: 'Track all cows & buffaloes, health status, breeds, and production capacity.', to: '/animals', color: 'linear-gradient(135deg, #4ADE80, #16A34A)' },
  { icon: '🥛', title: 'Milk Production', desc: 'Log morning & evening milk sessions. Auto-calculate daily and monthly totals.', to: '/milk', color: 'linear-gradient(135deg, #60A5FA, #2563EB)' },
  { icon: '🌿', title: 'Feeding Schedule', desc: 'Manage feed types, schedules, stock inventory and low-stock alerts.', to: '/feeding', color: 'linear-gradient(135deg, #34D399, #059669)' },
  { icon: '💊', title: 'Health & Vaccines', desc: 'Track vaccinations, treatments, vet visits and upcoming health reminders.', to: '/health', color: 'linear-gradient(135deg, #F87171, #DC2626)' },
  { icon: '👥', title: 'Employees', desc: 'Manage farm staff, attendance, salaries and task assignments.', to: '/employees', color: 'linear-gradient(135deg, #C084FC, #9333EA)' },
  { icon: '📊', title: 'Sales & Reports', desc: 'Billing, customer management, profit-loss analysis and exportable reports.', to: '/reports', color: 'linear-gradient(135deg, #FBBF24, #D97706)' },
]

const STATS = [
  { value: '500+', label: 'Farms Using DairyPro' },
  { value: '50K+', label: 'Animals Tracked' },
  { value: '₹2Cr+', label: 'Revenue Managed' },
  { value: '99.9%', label: 'Uptime' },
]

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-pattern" />
        <div className="hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="hero-icon">🐄</div>
            <h1 className="hero-title">
              Smart Dairy Farm<br />
              <span className="hero-title-highlight">Management System</span>
            </h1>
            <p className="hero-subtitle">
              Complete farm management for dairy owners, farmers, and milk collection centers. Track animals, milk, sales, health, and profits — all in one platform.
            </p>
            <div className="hero-actions">
              <Link to="/dashboard" className="hero-btn-primary">
                Open Dashboard <HiArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
              </Link>
              <Link to="/about" className="hero-btn-secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="home-section">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="card stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home-section">
        <div className="section-header">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-desc">From tracking individual cows to managing your entire farm business — DairyPro has you covered.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="card feature-card" onClick={() => window.location.href = f.to}>
              <div className="feature-icon-wrapper" style={{ background: f.color }}>
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-link">
                Open <HiArrowRight style={{ width: '1rem', height: '1rem' }} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="card cta-card">
          <div className="cta-icon">🌾</div>
          <h2 className="section-title">Ready to Transform Your Farm?</h2>
          <p className="cta-desc">Join hundreds of dairy farmers who manage their farm smarter with DairyPro.</p>
          <Link to="/dashboard" className="btn btn-primary cta-btn">
            Get Started Free <HiArrowRight style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.5rem' }} />
          </Link>
        </div>
      </section>
    </div>
  )
}
