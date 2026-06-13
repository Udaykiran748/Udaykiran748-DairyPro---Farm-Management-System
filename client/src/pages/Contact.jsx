import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi'
import toast from 'react-hot-toast'
import '../styles/Static.css'

export default function Contact() {
  const [form, setForm] = useState({name:'',email:'',subject:'',message:''})
  const up = (k,v) => setForm(f=>({...f,[k]:v}))
  const handleSubmit = (e) => { e.preventDefault(); toast.success('Message sent! We will get back to you soon.'); setForm({name:'',email:'',subject:'',message:''}) }

  return (
    <div className="static-page">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h1 className="page-title contact-header">Contact Us</h1>
        <p className="page-subtitle">Get in touch with the farm management team</p>
      </motion.div>

      <div className="contact-layout">
        <div className="contact-info-col">
          {[
            {icon:HiPhone,label:'Phone',value:'+91 98765 43210',colorClass:'icon-bg-primary'},
            {icon:HiMail,label:'Email',value:'farm@greenvalley.com',colorClass:'icon-bg-blue'},
            {icon:HiLocationMarker,label:'Address',value:'Green Valley Farm, Village Rd, District — 431001',colorClass:'icon-bg-earth'},
          ].map(({icon:Icon,label,value,colorClass},i)=>(
            <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}} className="card contact-info-card">
              <div className={`contact-icon-wrapper ${colorClass}`}><Icon style={{ width: '1.25rem', height: '1.25rem' }} /></div>
              <div><div className="contact-info-label">{label}</div><div className="contact-info-value">{value}</div></div>
            </motion.div>
          ))}
        </div>

        <div className="card contact-form-card">
          <h2 className="section-title">Send a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input value={form.name} onChange={e=>up('name',e.target.value)} style={{ width: '100%' }} placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" value={form.email} onChange={e=>up('email',e.target.value)} style={{ width: '100%' }} placeholder="your@email.com" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input value={form.subject} onChange={e=>up('subject',e.target.value)} style={{ width: '100%' }} placeholder="How can we help?" required />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea value={form.message} onChange={e=>up('message',e.target.value)} rows={4} style={{ width: '100%', resize: 'none' }} placeholder="Write your message..." required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}
