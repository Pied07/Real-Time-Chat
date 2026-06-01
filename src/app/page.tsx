import React from 'react'
import Dashboard from './home/page'
import Navbar from './components/navbar/page'
import Footer from './components/footer/page'

function page() {
  return (
    <div>
        <Navbar />
        <Dashboard />
        <Footer />
    </div>
  )
}

export default page