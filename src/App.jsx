import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import GlobalStyles from './styles/GlobalStyles'
import Dashboard from './screens/Dashboard'
import Budget from './screens/Budget'
import Settings from './screens/Settings'
import Stats from './screens/Stats'
import BudgetIcon from './icons/BudgetIcon'
import HomeIcon from './icons/HomeIcon'
import SettingsIcon from './icons/SettingsIcon'
import StatsIcon from './icons/StatsIcon'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f6fa;
`

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 56px; /* Height of the navigation bar */
  height: calc(100vh - 56px);
`

const NavBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: #95a5a6;
    font-size: 0.8rem;
    padding: 0.5rem;
    transition: color 0.2s;
    min-width: 64px;

    svg {
      width: 24px;
      height: 24px;
      margin-bottom: 4px;
    }

    &.active {
      color: #2ecc71;
    }
  }
`

function App() {
  return (
    <Router>
      <GlobalStyles />
      <AppContainer>
        <MainContent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainContent>
        
        <NavBar>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            <HomeIcon />
            <span>Home</span>
          </NavLink>
          <NavLink to="/budget" className={({ isActive }) => isActive ? 'active' : ''}>
            <BudgetIcon />
            <span>Budget</span>
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => isActive ? 'active' : ''}>
            <StatsIcon />
            <span>Stats</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            <SettingsIcon />
            <span>Settings</span>
          </NavLink>
        </NavBar>
      </AppContainer>
    </Router>
  )
}

export default App
