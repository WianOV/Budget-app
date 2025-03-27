import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { db } from './firebase'
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`

const BalanceCard = styled.div`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const BalanceAmount = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0.5rem 0;
`

const TransactionForm = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`

const Button = styled.button`
  background: #4CAF50;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #45a049;
  }
`

const TransactionsContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const TransactionList = styled.div`
  margin-top: 1rem;
`

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background: ${props => props.type === 'income' ? '#f8fff8' : '#fff8f8'};

  h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0.3rem 0 0;
    font-size: 0.9rem;
    color: #666;
  }
`

const Amount = styled.span`
  font-weight: bold;
  color: ${props => props.type === 'income' ? '#2ecc71' : '#e74c3c'};
`

function App() {
  const [transactions, setTransactions] = useState([])
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('income')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"))
      const querySnapshot = await getDocs(q)
      const transactionsData = []
      let totalBalance = 0

      querySnapshot.forEach((doc) => {
        const transaction = { id: doc.id, ...doc.data() }
        transactionsData.push(transaction)
        totalBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount
      })

      setTransactions(transactionsData)
      setBalance(totalBalance)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!amount || !description) return

    try {
      const numAmount = parseFloat(amount)
      await addDoc(collection(db, "transactions"), {
        amount: numAmount,
        description,
        type,
        timestamp: new Date()
      })

      // Reset form
      setAmount('')
      setDescription('')
      setType('income')

      // Refresh transactions
      fetchTransactions()
    } catch (error) {
      console.error("Error adding transaction:", error)
    }
  }

  return (
    <AppContainer>
      <Header>
        <h1>Budgetr</h1>
      </Header>
      
      <main>
        <BalanceCard>
          <h2>Current Balance</h2>
          <BalanceAmount>${balance.toFixed(2)}</BalanceAmount>
        </BalanceCard>

        <TransactionForm>
          <form onSubmit={handleSubmit}>
            <Input 
              type="number" 
              placeholder="Amount" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input 
              type="text" 
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
            <Button type="submit">Add Transaction</Button>
          </form>
        </TransactionForm>

        <TransactionsContainer>
          <h2>Recent Transactions</h2>
          <TransactionList>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} type={transaction.type}>
                <div>
                  <h3>{transaction.description}</h3>
                  <p>{new Date(transaction.timestamp.toDate()).toLocaleDateString()}</p>
                </div>
                <Amount type={transaction.type}>
                  {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                </Amount>
              </TransactionItem>
            ))}
          </TransactionList>
        </TransactionsContainer>
      </main>
    </AppContainer>
  )
}

export default App
