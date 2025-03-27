import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { db } from '../firebase'
import { collection, addDoc, getDocs, query, where, onSnapshot, deleteDoc, doc, setDoc } from 'firebase/firestore'
import Modal from '../components/Modal'
import CustomSelect from '../components/CustomSelect'

const BudgetContainer = styled.div`
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

const Section = styled.div`
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

  &:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.25rem;
    }
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #2ecc71;
  }
`

const Button = styled.button`
  padding: 0.75rem;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #27ae60;
  }

  &:active {
    transform: scale(0.98);
  }
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
  background: #f8f9fa;
  border-radius: 8px;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #2c3e50;
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 0.9rem;
    color: #7f8c8d;
  }
`

const DeleteButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #cc0000;
  }

  &:active {
    transform: scale(0.98);
  }
`

const Amount = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
`

function Budget() {
  const [mainIncome, setMainIncome] = useState('')
  const [debitOrders, setDebitOrders] = useState([])
  const [newDebitName, setNewDebitName] = useState('')
  const [newDebitAmount, setNewDebitAmount] = useState('')
  const [newDebitDueDate, setNewDebitDueDate] = useState(1)
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' })
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null, type: null })

  useEffect(() => {
    const unsubBudget = onSnapshot(
      doc(db, 'budgetSettings', 'mainIncome'),
      (doc) => {
        if (doc.exists()) {
          setMainIncome(doc.data().amount || '')
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

    return () => {
      unsubBudget()
      unsubDebitOrders()
      unsubCategories()
    }
  }, [])

  const handleIncomeSubmit = async (e) => {
    e.preventDefault()

    try {
      await setDoc(doc(db, 'budgetSettings', 'mainIncome'), {
        amount: Number(mainIncome)
      })
      setError(null)
    } catch (error) {
      setError('Failed to update income: ' + error.message)
    }
  }

  const handleDebitSubmit = async (e) => {
    e.preventDefault()

    try {
      await addDoc(collection(db, 'debitOrders'), {
        name: newDebitName,
        amount: Number(newDebitAmount),
        dueDate: Number(newDebitDueDate)
      })
      setNewDebitName('')
      setNewDebitAmount('')
      setNewDebitDueDate(1)
      setError(null)
    } catch (error) {
      setError('Failed to add debit order: ' + error.message)
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()

    try {
      await addDoc(collection(db, 'categories'), newCategory)
      setNewCategory({ name: '', type: 'expense' })
      setError(null)
    } catch (error) {
      setError('Failed to add category: ' + error.message)
    }
  }

  const handleDelete = (item, type) => {
    setDeleteModal({ isOpen: true, item, type })
  }

  const confirmDelete = async () => {
    try {
      const { item, type } = deleteModal
      if (type === 'debit') {
        await deleteDoc(doc(db, 'debitOrders', item.id))
      } else if (type === 'category') {
        await deleteDoc(doc(db, 'categories', item.id))
      }
      setDeleteModal({ isOpen: false, item: null, type: null })
      setError(null)
    } catch (error) {
      setError('Failed to delete item: ' + error.message)
    }
  }

  return (
    <BudgetContainer>
      <Header>
        <h1>Budget Settings</h1>
      </Header>

      <main>
        {error && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            borderRadius: '8px',
            marginBottom: '1rem' 
          }}>
            {error}
          </div>
        )}

        <Section>
          <h2>Monthly Income</h2>
          <Form onSubmit={handleIncomeSubmit}>
            <Input
              type="number"
              placeholder="Main Monthly Income"
              step="0.01"
              value={mainIncome}
              onChange={(e) => setMainIncome(e.target.value)}
              required
            />
            <Button type="submit">Update Income</Button>
          </Form>
        </Section>

        <Section>
          <h2>Debit Orders</h2>
          <Form onSubmit={handleDebitSubmit}>
            <Input
              type="text"
              placeholder="Name"
              value={newDebitName}
              onChange={(e) => setNewDebitName(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Amount"
              step="0.01"
              value={newDebitAmount}
              onChange={(e) => setNewDebitAmount(e.target.value)}
              required
            />
            <CustomSelect
              value={newDebitDueDate}
              onChange={(value) => setNewDebitDueDate(Number(value))}
              options={Array.from({ length: 31 }, (_, i) => ({
                value: i + 1,
                label: `Day ${i + 1}`
              }))}
              placeholder="Select due date"
              label="Select due date"
            />
            <Button type="submit">Add Debit Order</Button>
          </Form>

          <List>
            {debitOrders.map(debit => (
              <ListItem key={debit.id}>
                <div>
                  <h3>{debit.name}</h3>
                  <p>Due: Day {debit.dueDate}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Amount>R{Number(debit.amount).toFixed(2)}</Amount>
                  <DeleteButton onClick={() => handleDelete(debit, 'debit')}>
                    Delete
                  </DeleteButton>
                </div>
              </ListItem>
            ))}
          </List>
        </Section>

        <Section>
          <h2>Categories</h2>
          <Form onSubmit={handleCategorySubmit}>
            <Input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
            />
            <CustomSelect
              value={newCategory.type}
              onChange={(value) => setNewCategory({ ...newCategory, type: value })}
              options={[
                { value: 'expense', label: 'Expense' },
                { value: 'income', label: 'Income' }
              ]}
              placeholder="Select category type"
              label="Select category type"
            />
            <Button type="submit">Add Category</Button>
          </Form>

          <List>
            {categories.map(category => (
              <ListItem key={category.id}>
                <div>
                  <h3>{category.name}</h3>
                  <p>Type: {category.type}</p>
                </div>
                <DeleteButton onClick={() => handleDelete(category, 'category')}>
                  Delete
                </DeleteButton>
              </ListItem>
            ))}
          </List>
        </Section>
      </main>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, type: null })}
        title={`Delete ${deleteModal.type === 'debit' ? 'Debit Order' : 'Category'}`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        variant="danger"
      >
        Are you sure you want to delete {deleteModal.item?.name}? 
        {deleteModal.type === 'category' && ' All transactions with this category will be affected.'}
        This action cannot be undone.
      </Modal>
    </BudgetContainer>
  )
}

export default Budget
