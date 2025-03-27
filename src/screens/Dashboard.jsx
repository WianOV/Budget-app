import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { db } from '../firebase'
import { collection, addDoc, getDocs, query, orderBy, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import Modal from '../components/Modal'
import CustomSelect from '../components/CustomSelect'

const DashboardContainer = styled.div`
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

const BalanceCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    color: #2c3e50;
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    
    h2 {
      font-size: 1.25rem;
    }
  }
`

const BalanceAmount = styled.p`
  font-size: 1.75rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0.5rem 0;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`

const DeleteButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;
  min-width: 60px;

  &:hover {
    background: #cc0000;
  }

  @media (min-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`

const TransactionsContainer = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;

  h2 {
    margin: 0 0 1rem;
    font-size: 1.1rem;
    color: #2c3e50;
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.25rem;
    }
  }
`

const TransactionForm = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin: 0 0 1rem;
    font-size: 1.1rem;
    color: #2c3e50;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    
    h2 {
      font-size: 1.25rem;
    }

    form {
      gap: 1rem;
    }
  }
`

const Input = styled.input`
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  -webkit-appearance: none;

  &:focus {
    outline: none;
    border-color: #2ecc71;
  }

  @media (min-width: 768px) {
    padding: 0.75rem;
  }
`

const Button = styled.button`
  background: #2ecc71;
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: #27ae60;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    padding: 0.75rem;
  }
`

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px; /* Reduced height to prevent overflow */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-right: 0.5rem;
  margin-right: -0.5rem;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  @media (min-width: 768px) {
    gap: 1rem;
    max-height: 350px;
  }
`

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${props => props.type === 'income' ? '#e8f5e9' : '#ffebee'};
  border-radius: 8px;
  transition: transform 0.2s;
  min-height: 64px;

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    padding: 1rem;
  }
`

const CategoryInfo = styled.div`
  flex: 1;
  margin-right: 0.5rem;
  min-width: 0;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #2c3e50;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 0.8rem;
    color: #7f8c8d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (min-width: 768px) {
    h3 {
      font-size: 1.1rem;
    }
    p {
      font-size: 0.9rem;
    }
  }
`

const Amount = styled.span`
  font-weight: bold;
  font-size: 0.9rem;
  color: ${props => props.type === 'income' ? '#27ae60' : '#e74c3c'};
  white-space: nowrap;
  margin: 0 0.5rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`

const BalanceTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: #2c3e50;
`

const BalanceBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
`

const Section = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f7f7f7;
  border-radius: 8px;
  transition: transform 0.2s;
  min-height: 64px;

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    padding: 1rem;
  }
`

function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    categoryName: ''
  })
  const [categories, setCategories] = useState([])
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [debitOrders, setDebitOrders] = useState([])
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, transaction: null })
  const [error, setError] = useState(null)

  // Calculate filtered categories based on transaction type
  const filteredCategories = categories.filter(cat => cat.type === newTransaction.type)

  // Calculate totals
  const totalDebitOrders = debitOrders.reduce((sum, debit) => sum + Number(debit.amount), 0)
  const transactionBalance = transactions.reduce((sum, t) => 
    sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0
  )
  const balance = Number(monthlyIncome) - totalDebitOrders + transactionBalance

  useEffect(() => {
    const unsubTransactions = onSnapshot(
      query(collection(db, 'transactions'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const transactionsData = []
        snapshot.forEach((doc) => {
          transactionsData.push({ id: doc.id, ...doc.data() })
        })
        setTransactions(transactionsData)
      }
    )

    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const categoriesData = []
        snapshot.forEach((doc) => {
          categoriesData.push({ id: doc.id, ...doc.data() })
        })
        setCategories(categoriesData)
      }
    )

    const unsubBudget = onSnapshot(
      doc(db, 'budgetSettings', 'mainIncome'),
      (doc) => {
        if (doc.exists()) {
          setMonthlyIncome(doc.data().amount || 0)
        }
      }
    )

    const unsubDebitOrders = onSnapshot(
      collection(db, 'debitOrders'),
      (snapshot) => {
        const debitOrdersData = []
        snapshot.forEach((doc) => {
          debitOrdersData.push({ id: doc.id, ...doc.data() })
        })
        setDebitOrders(debitOrdersData)
      }
    )

    return () => {
      unsubTransactions()
      unsubCategories()
      unsubBudget()
      unsubDebitOrders()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newTransaction.categoryId) {
      setError('Please select a category')
      return
    }

    try {
      await addDoc(collection(db, 'transactions'), {
        description: newTransaction.description,
        amount: Number(newTransaction.amount),
        type: newTransaction.type,
        categoryId: newTransaction.categoryId,
        categoryName: newTransaction.categoryName,
        timestamp: new Date().toISOString()
      })

      setNewTransaction({
        description: '',
        amount: '',
        type: 'expense',
        categoryId: '',
        categoryName: ''
      })
      setError(null)
    } catch (error) {
      setError('Failed to add transaction: ' + error.message)
    }
  }

  const handleDelete = (transaction) => {
    setDeleteModal({ isOpen: true, transaction })
  }

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'transactions', deleteModal.transaction.id))
      setDeleteModal({ isOpen: false, transaction: null })
      setError(null)
    } catch (error) {
      setError('Failed to delete transaction: ' + error.message)
    }
  }

  return (
    <DashboardContainer>
      <Header>
        <h1>Dashboard</h1>
        <BalanceCard>
          <BalanceTitle>Current Balance</BalanceTitle>
          <BalanceAmount>R{Number(balance).toFixed(2)}</BalanceAmount>
          <BalanceBreakdown>
            <BreakdownItem>
              <span>Monthly Income:</span>
              <span>R{Number(monthlyIncome).toFixed(2)}</span>
            </BreakdownItem>
            <BreakdownItem>
              <span>Total Debit Orders:</span>
              <span>R{Number(totalDebitOrders).toFixed(2)}</span>
            </BreakdownItem>
            <BreakdownItem>
              <span>Transaction Balance:</span>
              <span>R{Number(transactionBalance).toFixed(2)}</span>
            </BreakdownItem>
          </BalanceBreakdown>
        </BalanceCard>
      </Header>

      <Section>
        <h2>Add Transaction</h2>
        <Form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              borderRadius: '8px',
              marginBottom: '0.75rem' 
            }}>
              {error}
            </div>
          )}
          
          <Input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            required
          />
          <Input
            type="number"
            placeholder="Amount"
            step="0.01"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            required
          />
          <CustomSelect
            value={newTransaction.type}
            onChange={(value) => {
              setNewTransaction({ 
                ...newTransaction, 
                type: value,
                categoryId: '',
                categoryName: ''
              })
            }}
            options={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' }
            ]}
            placeholder="Select transaction type"
            label="Select transaction type"
          />
          {filteredCategories.length > 0 ? (
            <CustomSelect
              value={newTransaction.categoryId}
              onChange={(value) => {
                const category = categories.find(cat => cat.id === value)
                if (category) {
                  setNewTransaction({ 
                    ...newTransaction, 
                    categoryId: value,
                    categoryName: category.name
                  })
                }
              }}
              options={filteredCategories.map(cat => ({
                value: cat.id,
                label: cat.name
              }))}
              placeholder="Select category"
              label="Select category"
            />
          ) : (
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: '#fff3e0', 
              color: '#e65100', 
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '0.75rem'
            }}>
              No categories available for {newTransaction.type}. Please add categories in the Budget screen.
            </div>
          )}
          <Button type="submit">Add Transaction</Button>
        </Form>
      </Section>

      <Section>
        <h2>Recent Transactions</h2>
        <List>
          {transactions.map(transaction => (
            <ListItem key={transaction.id}>
              <div>
                <h3>{transaction.description}</h3>
                <p>
                  {transaction.categoryName} • {new Date(transaction.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Amount type={transaction.type}>
                  {transaction.type === 'expense' ? '-' : '+'}R{Number(transaction.amount).toFixed(2)}
                </Amount>
                <DeleteButton onClick={() => handleDelete(transaction)}>
                  Delete
                </DeleteButton>
              </div>
            </ListItem>
          ))}
        </List>
      </Section>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, transaction: null })}
        title="Delete Transaction"
        onConfirm={confirmDelete}
        confirmText="Delete"
        variant="danger"
      >
        Are you sure you want to delete this transaction? This action cannot be undone.
      </Modal>
    </DashboardContainer>
  )
}

export default Dashboard
