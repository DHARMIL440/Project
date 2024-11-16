"use client";
import React, { useEffect, useState } from 'react';
import SideNav from './_components/SideNav';
import DashboardHeader from './_components/DashboardHeader';
import { db } from '../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq, sql } from 'drizzle-orm';

export default function DashboardLayout({ children }) {
  const { user } = useUser();
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserBudgetData();  // Initial fetch when the component mounts
      const intervalId = setInterval(() => {
        fetchUserBudgetData();  // Fetch data every 5 seconds
      }, 5000);

      // Cleanup the interval when the component unmounts or when user changes
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const fetchUserBudgetData = async () => {
    // Query to calculate total budget (sum of amounts from Budgets table)
    const budgetResult = await db
      .select({
        totalBudget: sql`SUM(${Budgets.amount})`.mapWith(Number),
      })
      .from(Budgets)
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));

    // Query to calculate total expenses (sum of amounts from Expenses table)
    const expenseResult = await db
      .select({
        totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
      })
      .from(Expenses)
      .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));

    const totalBudgetAmount = budgetResult[0]?.totalBudget || 0;
    const totalExpenseAmount = expenseResult[0]?.totalSpend || 0;

    setTotalBudget(totalBudgetAmount);
    setTotalExpense(totalExpenseAmount);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-gray-900 to-black min-h-screen">
      <div className='fixed md:w-64 hidden md:block'>
        <SideNav />
      </div>
      <div className='md:ml-64'>
        <DashboardHeader 
          userName={user?.fullName} 
          totalBudget={totalBudget} 
          totalExpense={totalExpense} 
        />
        {children}
      </div>
    </div>
  );
}
