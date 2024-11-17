import React, { useState } from "react";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";
import { db } from "@/utils/dbConfig"; 
import { Expenses } from "@/utils/schema"; 
import { toast } from "sonner";
import moment from 'moment';

function AddExpenses({ budgetId, user, refreshData }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const PAYMENT_METHODS = [
    'Cash',
    'Credit',
    'Debit',
    'UPI',
    'Check'
  ];

  

  const addNewExpense = async () => {
    try {
      const result = await db.insert(Expenses).values({
        name: name,
        amount: Number(amount),
        budgetId: Number(budgetId),
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().toDate(), // Ensure it is a Date object
        paymentMethod: paymentMethod,
      }).returning({ insertedId: Expenses.id });

      if (result) { 
        refreshData();
        toast.success("New Expense Added!");
        setName('');
        setAmount('');
        setPaymentMethod('Cash');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error("Failed to add expense");
    }
  };

  return (
    <div className="border bg-[#121212] p-5 rounded-lg text-gray-300">
      <h2 className="font-bold text-lg mb-4 text-gray-100">Add New Expense</h2>

      <div className="space-y-4">
        <div>
          <h2 className="text-gray-400 font-medium my-1">Expense Name</h2>
          <Input
            placeholder="e.g. Bedroom Decor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#3a3a3a] text-gray-200 placeholder-gray-500 rounded-lg p-2 w-full"
          />
        </div>

        <div>
          <h2 className="text-gray-400 font-medium my-1">Expense Amount</h2>
          <Input
            type="number"
            placeholder="e.g. 1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#3a3a3a] text-gray-200 placeholder-gray-500 rounded-lg p-2 w-full"
          />
        </div>

        <div>
          <h2 className="text-gray-400 font-medium my-1">Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="bg-[#3a3a3a] text-gray-200 rounded-lg p-2 w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>


        <Button 
          disabled={!(name && amount && paymentMethod)} 
          onClick={addNewExpense}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white"
        >
          Add New Expense
        </Button>
      </div>
    </div>
  );
}

export default AddExpenses;
