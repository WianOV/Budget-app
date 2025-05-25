import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

const AddTransaction = () => {
  const [transaction, setTransaction] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const categoriesData = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(cat => cat.type === 'expense'); // Only show expense categories
        setCategories(categoriesData);
      }
    );

    return () => unsubCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    if (!transaction.description.trim()) {
      setError('Please enter a description');
      return;
    }

    if (!transaction.amount || Number(transaction.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!transaction.category) {
      setError('Please select a category');
      return;
    }

    try {
      // Only add transaction when form is submitted
      await addDoc(collection(db, 'transactions'), {
        description: transaction.description.trim(),
        amount: Number(transaction.amount),
        category: transaction.category,
        date: transaction.date,
        createdAt: new Date()
      });

      // Reset form after successful submission
      setTransaction({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      setError(''); // Clear any previous errors
    } catch (error) {
      setError('Failed to add transaction: ' + error.message);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Add Transaction</h1>
      </Header>

      <Form 
        onSubmit={handleSubmit}
        autoComplete="off" // Prevent form auto-submission
      >
        {error && <Error>{error}</Error>}
        
        <FormGroup>
          <Label>Description</Label>
          <Input
            type="text"
            value={transaction.description}
            onChange={(e) => setTransaction(prev => ({ 
              ...prev, 
              description: e.target.value 
            }))}
            placeholder="What did you spend on?"
            required
            autoComplete="off" // Prevent auto-complete
          />
        </FormGroup>

        <FormGroup>
          <Label>Amount</Label>
          <Input
            type="number"
            value={transaction.amount}
            onChange={(e) => setTransaction(prev => ({ 
              ...prev, 
              amount: e.target.value 
            }))}
            placeholder="How much did you spend?"
            step="0.01"
            min="0"
            required
            autoComplete="off" // Prevent auto-complete
          />
        </FormGroup>

        <FormGroup>
          <Label>Category</Label>
          <Select
            value={transaction.category}
            onChange={(e) => {
              e.preventDefault(); // Prevent any form submission
              const value = e.target.value;
              setTransaction(prev => ({ 
                ...prev, 
                category: value
              }));
            }}
            required
            autoComplete="off" // Prevent auto-complete
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Date</Label>
          <Input
            type="date"
            value={transaction.date}
            onChange={(e) => setTransaction(prev => ({ 
              ...prev, 
              date: e.target.value 
            }))}
            required
            autoComplete="off" // Prevent auto-complete
          />
        </FormGroup>

        <Button type="submit">Add Transaction</Button>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 0;
  }
`;

const Form = styled.form`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #2980b9;
  }
`;

const Error = styled.div`
  color: #e74c3c;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #fdf0ed;
  border-radius: 6px;
`;

export default AddTransaction;
