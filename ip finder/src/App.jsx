import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [userIp, setUserIp] = useState('')
  const [searchIp, setSearchIp] = useState('')
  const [ipDetails, setIpDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserIp = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json')
        setUserIp(response.data.ip)
        setSearchIp(response.data.ip) 
      } catch (err) {
        setError('Failed to fetch your IP address')
        console.error(err)
      }
    }
    
    fetchUserIp()
  }, [])

  const fetchIpDetails = async (e) => {
    e.preventDefault()
    if (!searchIp) return
    
    setLoading(true)
    setError('')
    setIpDetails(null)
    
    try {
      const response = await axios.get(`https://ipapi.co/${searchIp}/json/`)
      setIpDetails(response.data)
    } catch (err) {
      setError('Failed to fetch IP details. Please try again with a valid IP address.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const Logo = () => (
    <svg className="app-logo" width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#blueGradient)" />
      <path d="M32 2C32 2 32 32 32 62" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3" />
      <path d="M32 2C32 2 32 32 32 62" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3" transform="rotate(45 32 32)" />
      <path d="M32 2C32 2 32 32 32 62" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3" transform="rotate(90 32 32)" />
      <path d="M32 2C32 2 32 32 32 62" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3" transform="rotate(135 32 32)" />
      <ellipse cx="32" cy="32" rx="30" ry="10" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" fill="none" />
      <ellipse cx="32" cy="32" rx="30" ry="20" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3" fill="none" />
      <path d="M32 15C28.13 15 25 18.13 25 22C25 27.25 32 35 32 35C32 35 39 27.25 39 22C39 18.13 35.87 15 32 15ZM32 25C30.34 25 29 23.66 29 22C29 20.34 30.34 19 32 19C33.66 19 35 20.34 35 22C35 23.66 33.66 25 32 25Z" fill="#ffffff" />
      <defs>
        <linearGradient id="blueGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  )

  return (
    <div className="ip-finder-container">
      <header>
        <Logo />
        <h1>IP Address Finder</h1>
        <p className="subtitle">Get detailed information about any IP address</p>
      </header>

      <div className="user-ip-section">
        <h2>Your IP Address</h2>
        <div className="ip-box">{userIp || 'Loading...'}</div>
      </div>

      <div className="search-section">
        <h2>Search IP Details</h2>
        <form onSubmit={fetchIpDetails}>
          <div className="input-group">
            <input
              type="text"
              value={searchIp}
              onChange={(e) => setSearchIp(e.target.value)}
              placeholder="Enter an IP address"
              pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
              title="Please enter a valid IP address (e.g., 192.168.1.1)"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Loading IP details...</div>}

      {ipDetails && (
        <div className="results-section">
          <h2>IP Details</h2>
          <div className="details-card">
            <div className="detail-row">
              <span className="label">IP Address:</span>
              <span className="value">{ipDetails.ip}</span>
            </div>
            <div className="detail-row">
              <span className="label">Location:</span>
              <span className="value">{ipDetails.city}, {ipDetails.region}, {ipDetails.country_name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Postal Code:</span>
              <span className="value">{ipDetails.postal || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Latitude/Longitude:</span>
              <span className="value">{ipDetails.latitude}, {ipDetails.longitude}</span>
            </div>
            <div className="detail-row">
              <span className="label">ISP:</span>
              <span className="value">{ipDetails.org || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Timezone:</span>
              <span className="value">{ipDetails.timezone}</span>
            </div>
            {ipDetails.country_flag && (
              <div className="detail-row">
                <span className="label">Country Flag:</span>
                <span className="value flag-container">
                  <img 
                    src={ipDetails.country_flag} 
                    alt={`Flag of ${ipDetails.country_name}`} 
                    className="country-flag"
                    width="32"
                    height="24" 
                  />
                  {ipDetails.country_name}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} IP Address Finder • Created by Jaydeep • Powered by ipapi.co</p>
      </footer>
    </div>
  )
}

export default App
