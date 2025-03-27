import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { db } from '../firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const AnalyticsContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 1.5rem;
  
  h1 {
    font-size: 1.5rem;
    color: #2c3e50;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const StatCard = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;

  h3 {
    color: #666;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  p {
    font-size: 1.25rem;
    font-weight: bold;
    color: ${props => props.color || '#2c3e50'};
    margin: 0;
  }
`

function Analytics() {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    averageIncome: 0,
    averageExpense: 0
  })

  useEffect(() => {
    fetchTransactionStats()
  }, [])

  const fetchTransactionStats = async () => {
    try {
      const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"))
      const querySnapshot = await getDocs(q)
      let totalIncome = 0
      let totalExpenses = 0
      let incomeCount = 0
      let expenseCount = 0

      querySnapshot.forEach((doc) => {
        const transaction = doc.data()
        if (transaction.type === 'income') {
          totalIncome += transaction.amount
          incomeCount++
        } else {
          totalExpenses += transaction.amount
          expenseCount++
        }
      })

      setStats({
        totalIncome,
        totalExpenses,
        averageIncome: incomeCount ? totalIncome / incomeCount : 0,
        averageExpense: expenseCount ? totalExpenses / expenseCount : 0
      })
    } catch (error) {
      console.error("Error fetching transaction stats:", error)
    }
  }

  return (
    <AnalyticsContainer>
      <Header>
        <h1>Analytics</h1>
      </Header>

      <StatsGrid>
        <StatCard color="#2ecc71">
          <h3>Total Income</h3>
          <p>${stats.totalIncome.toFixed(2)}</p>
        </StatCard>
        <StatCard color="#e74c3c">
          <h3>Total Expenses</h3>
          <p>${stats.totalExpenses.toFixed(2)}</p>
        </StatCard>
        <StatCard color="#2ecc71">
          <h3>Average Income</h3>
          <p>${stats.averageIncome.toFixed(2)}</p>
        </StatCard>
        <StatCard color="#e74c3c">
          <h3>Average Expense</h3>
          <p>${stats.averageExpense.toFixed(2)}</p>
        </StatCard>
      </StatsGrid>
    </AnalyticsContainer>
  )
}

export default Analytics
