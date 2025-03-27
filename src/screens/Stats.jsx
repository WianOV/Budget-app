import React from 'react'
import styled from 'styled-components'

const StatsContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0.75rem;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (min-width: 768px) {
    padding: 1rem;
  }
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 1rem;
  
  h1 {
    font-size: 1.25rem;
    color: #2c3e50;
    margin: 0;
  }

  @media (min-width: 768px) {
    margin-bottom: 1.5rem;
    h1 {
      font-size: 1.5rem;
    }
  }
`

function Stats() {
  return (
    <StatsContainer>
      <Header>
        <h1>Stats</h1>
      </Header>
      <div>
        {/* Stats content will be added here */}
        <p style={{ textAlign: 'center', color: '#95a5a6' }}>
          Coming soon...
        </p>
      </div>
    </StatsContainer>
  )
}

export default Stats
