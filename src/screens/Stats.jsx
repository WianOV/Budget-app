import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';

const Stats = () => {
  const [stats, setStats] = useState({
    totalIncome: 0,
    transactions: {},
    categories: [],
    totalSpent: 0,
    savingsPercentage: 0
  });

  useEffect(() => {
    // Fetch main income
    const unsubIncome = onSnapshot(
      doc(db, 'budgetSettings', 'mainIncome'),
      (doc) => {
        if (doc.exists()) {
          setStats(prev => ({
            ...prev,
            totalIncome: doc.data().amount || 0
          }));
        }
      }
    );

    // Fetch transactions and categories
    const unsubTransactions = onSnapshot(
      collection(db, 'transactions'),
      (snapshot) => {
        console.log('Raw transactions:', snapshot.docs.map(doc => doc.data())); // Debug log
        
        // Group transactions by category
        const transactionsByCategory = {};
        let totalSpent = 0;

        snapshot.docs.forEach(doc => {
          const transaction = doc.data();
          console.log('Processing transaction:', transaction); // Debug log
          
          const category = transaction.category || 'Uncategorized';
          const amount = Number(transaction.amount) || 0;
          
          if (!transactionsByCategory[category]) {
            transactionsByCategory[category] = {
              total: 0,
              count: 0,
              items: []
            };
          }
          
          transactionsByCategory[category].total += amount;
          transactionsByCategory[category].count += 1;
          transactionsByCategory[category].items.push({
            id: doc.id,
            ...transaction,
            amount // Ensure amount is a number
          });
          
          totalSpent += amount;
        });

        console.log('Grouped transactions:', transactionsByCategory); // Debug log
        
        setStats(prev => ({
          ...prev,
          transactions: transactionsByCategory,
          totalSpent,
          savingsPercentage: calculateSavingsPercentage(
            prev.totalIncome,
            totalSpent
          )
        }));
      }
    );

    // Fetch categories
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setStats(prev => ({
          ...prev,
          categories: categoriesData
        }));
      }
    );

    return () => {
      unsubIncome();
      unsubTransactions();
      unsubCategories();
    };
  }, []);

  const calculateSavingsPercentage = (income, spent) => {
    if (!income) return 0;
    const savings = income - spent;
    return ((savings / income) * 100).toFixed(1);
  };

  return (
    <StatsContainer>
      <Header>
        <h1>Spending Analysis</h1>
      </Header>

      <StatCards>
        <StatCard>
          <StatTitle>Monthly Overview</StatTitle>
          <StatValue>R{(stats.totalIncome || 0).toLocaleString()}</StatValue>
          <StatLabel>Total Income</StatLabel>
          <StatValue>R{(stats.totalSpent || 0).toLocaleString()}</StatValue>
          <StatLabel>Total Spent</StatLabel>
          <StatValue>{stats.savingsPercentage}%</StatValue>
          <StatLabel>Savings Rate</StatLabel>
        </StatCard>

        <StatCard>
          <StatTitle>Categories Overview</StatTitle>
          <CategoryList>
            {Object.entries(stats.transactions)
              .sort(([, a], [, b]) => b.total - a.total)
              .map(([category, data]) => (
                <CategoryItem key={category}>
                  <CategoryHeader>
                    <CategoryName>{category}</CategoryName>
                    <CategoryTotal>R{data.total.toLocaleString()}</CategoryTotal>
                  </CategoryHeader>
                  <CategoryProgress>
                    <ProgressBar 
                      width={((data.total / (stats.totalSpent || 1)) * 100).toFixed(1)}
                      isTop={data.total === Math.max(...Object.values(stats.transactions).map(t => t.total))}
                    />
                  </CategoryProgress>
                  <CategoryDetails>
                    <CategoryCount>{data.count} transaction{data.count !== 1 ? 's' : ''}</CategoryCount>
                    <CategoryPercentage>
                      {((data.total / (stats.totalSpent || 1)) * 100).toFixed(1)}%
                    </CategoryPercentage>
                  </CategoryDetails>
                </CategoryItem>
              ))}
            {Object.keys(stats.transactions).length === 0 && (
              <EmptyState>No transactions recorded yet</EmptyState>
            )}
          </CategoryList>
        </StatCard>
      </StatCards>
    </StatsContainer>
  );
};

const StatsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 1.5rem;
  
  h1 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 0;
  }
`;

const StatCards = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StatTitle = styled.h2`
  font-size: 1.25rem;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
  color: #3498db;
  margin: 0.5rem 0;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 1.5rem;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryItem = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CategoryName = styled.div`
  font-weight: 500;
  color: #2c3e50;
  flex: 1;
  margin: 0 1rem;
`;

const CategoryTotal = styled.div`
  font-weight: 500;
  color: #e74c3c;
`;

const CategoryCount = styled.div`
  color: #7f8c8d;
  font-size: 0.875rem;
`;

const CategoryProgress = styled.div`
  background: #eee;
  height: 6px;
  border-radius: 3px;
  margin: 0.5rem 0;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  background: #3498db;
  height: 100%;
  width: ${props => props.width}%;
  transition: width 0.3s ease;
`;

const CategoryDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const CategoryPercentage = styled.div`
  color: #7f8c8d;
  text-align: right;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #95a5a6;
  padding: 2rem;
`;

export default Stats;
