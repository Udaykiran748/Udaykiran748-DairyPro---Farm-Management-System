import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({name:'',email:'',subject:'',message:''})
  const up = (k,v) => setForm(f=>({...f,[k]:v}))
  const handleSubmit = (e) => { e.preventDefault(); toast.success('Message sent! We will get back to you soon.'); setForm({name:'',email:'',subject:'',message:''}) }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h1 className="page-title mb-1">Contact Us</h1>
        <p className="text-gray-500">Get in touch with the farm management team</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {[
            {icon:HiPhone,label:'Phone',value:'+91 98765 43210',color:'bg-primary-500'},
            {icon:HiMail,label:'Email',value:'farm@greenvalley.com',color:'bg-blue-500'},
            {icon:HiLocationMarker,label:'Address',value:'Green Valley Farm, Village Rd, District — 431001',color:'bg-earth-500'},
          ].map(({icon:Icon,label,value,color},i)=>(
            <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}} className="glass-card p-4 flex gap-4">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}><Icon className="w-5 h-5" /></div>
              <div><div className="text-xs text-gray-400 uppercase font-medium tracking-wide">{label}</div><div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">{value}</div></div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="section-title mb-5">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input value={form.name} onChange={e=>up('name',e.target.value)} className="input-field" placeholder="Your name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e=>up('email',e.target.value)} className="input-field" placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input value={form.subject} onChange={e=>up('subject',e.target.value)} className="input-field" placeholder="How can we help?" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea value={form.message} onChange={e=>up('message',e.target.value)} rows={4} className="input-field resize-none" placeholder="Write your message..." required />
            </div>
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}
