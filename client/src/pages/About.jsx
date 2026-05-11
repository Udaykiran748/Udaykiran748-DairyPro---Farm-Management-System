import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass-card p-8 text-center">
        <div className="text-6xl mb-4 animate-float">🏡</div>
        <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100 mb-3">Green Valley Dairy Farm</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">Established in 2010, we are committed to providing the highest quality dairy products through ethical, sustainable farming practices.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {icon:'🌿',title:'Organic Farming',desc:'All our cattle graze on pesticide-free, natural pastures. No artificial growth hormones.'},
          {icon:'🐄',title:'Animal Welfare',desc:'Our animals are treated with love and care, following strict welfare guidelines.'},
          {icon:'🥛',title:'Pure Quality',desc:'Farm-fresh milk tested daily. A+ grade quality delivered directly to customers.'},
        ].map((f,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*0.1}} className="glass-card p-6 text-center">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-display font-semibold text-gray-800 dark:text-gray-100 text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{opacity:0}} whileInView={{opacity:1}} className="glass-card p-6">
        <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 mb-4">Our Story</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Green Valley Dairy Farm was started with just 5 cows in a small village in 2010. Over the years, we have grown to a herd of 30+ animals, serving over 50 households and 3 wholesale distributors. Our mission is to bring pure, chemical-free dairy products to every table while supporting the livelihoods of our farm workers and the local community.</p>
      </motion.div>
    </div>
  )
}
