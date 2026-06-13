import { motion } from 'framer-motion'
import '../styles/Static.css'

export default function About() {
  return (
    <div className="static-page">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="card static-header">
        <div className="static-icon-large">🏡</div>
        <h1 className="static-title-large">Green Valley Dairy Farm</h1>
        <p className="static-desc-large">Established in 2010, we are committed to providing the highest quality dairy products through ethical, sustainable farming practices.</p>
      </motion.div>

      <div className="features-grid-3">
        {[
          {icon:'🌿',title:'Organic Farming',desc:'All our cattle graze on pesticide-free, natural pastures. No artificial growth hormones.'},
          {icon:'🐄',title:'Animal Welfare',desc:'Our animals are treated with love and care, following strict welfare guidelines.'},
          {icon:'🥛',title:'Pure Quality',desc:'Farm-fresh milk tested daily. A+ grade quality delivered directly to customers.'},
        ].map((f,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*0.1}} className="card feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{opacity:0}} whileInView={{opacity:1}} className="card story-card">
        <h2 className="story-title">Our Story</h2>
        <p className="story-text">Green Valley Dairy Farm was started with just 5 cows in a small village in 2010. Over the years, we have grown to a herd of 30+ animals, serving over 50 households and 3 wholesale distributors. Our mission is to bring pure, chemical-free dairy products to every table while supporting the livelihoods of our farm workers and the local community.</p>
      </motion.div>
    </div>
  )
}
