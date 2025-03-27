import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import GlobalStyles from './styles/GlobalStyles'
import Dashboard from './screens/Dashboard'
import Budget from './screens/Budget'
import Settings from './screens/Settings'
import Stats from './screens/Stats'
import Login from './screens/Login'
import BudgetIcon from './icons/BudgetIcon'
import HomeIcon from './icons/HomeIcon'
import SettingsIcon from './icons/SettingsIcon'
import StatsIcon from './icons/StatsIcon'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f6fa;
`

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding-bottom: ${56}px; /* Height of the navigation bar */
  height: calc(100vh - ${56}px);
`

const NavBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${56}px;
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
      fill: currentColor;
    }

    &.active {
      color: #3498db;
    }
  }
`

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContainer>
          <GlobalStyles />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainContent>
                  <Dashboard />
                </MainContent>
                <NavBar>
                  <NavLink to="/dashboard"><HomeIcon />Home</NavLink>
                  <NavLink to="/budget"><BudgetIcon />Budget</NavLink>
                  <NavLink to="/stats"><StatsIcon />Stats</NavLink>
                  <NavLink to="/settings"><SettingsIcon />Settings</NavLink>
                </NavBar>
              </ProtectedRoute>
            } />
            
            <Route path="/budget" element={
              <ProtectedRoute>
                <MainContent>
                  <Budget />
                </MainContent>
                <NavBar>
                  <NavLink to="/dashboard"><HomeIcon />Home</NavLink>
                  <NavLink to="/budget"><BudgetIcon />Budget</NavLink>
                  <NavLink to="/stats"><StatsIcon />Stats</NavLink>
                  <NavLink to="/settings"><SettingsIcon />Settings</NavLink>
                </NavBar>
              </ProtectedRoute>
            } />
            
            <Route path="/stats" element={
              <ProtectedRoute>
                <MainContent>
                  <Stats />
                </MainContent>
                <NavBar>
                  <NavLink to="/dashboard"><HomeIcon />Home</NavLink>
                  <NavLink to="/budget"><BudgetIcon />Budget</NavLink>
                  <NavLink to="/stats"><StatsIcon />Stats</NavLink>
                  <NavLink to="/settings"><SettingsIcon />Settings</NavLink>
                </NavBar>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <MainContent>
                  <Settings />
                </MainContent>
                <NavBar>
                  <NavLink to="/dashboard"><HomeIcon />Home</NavLink>
                  <NavLink to="/budget"><BudgetIcon />Budget</NavLink>
                  <NavLink to="/stats"><StatsIcon />Stats</NavLink>
                  <NavLink to="/settings"><SettingsIcon />Settings</NavLink>
                </NavBar>
              </ProtectedRoute>
            } />
          </Routes>
        </AppContainer>
      </AuthProvider>
    </Router>
  )
}

export default App
