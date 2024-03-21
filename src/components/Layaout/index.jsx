import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white">
        {/* Aquí irá tu Navbar */}
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-900 text-white">
        {/* Aquí irá tu Footer */}
      </footer>
    </div>
  )
}

export default Layout
