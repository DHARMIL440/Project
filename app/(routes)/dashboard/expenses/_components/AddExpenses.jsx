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
  const [currency, setCurrency] = useState('USD');

  // Shared conversion rates between components
  const CURRENCY_CONVERSIONS = {
    'USD': 1,      // 1 USD = 1 USD
    'EUR': 1/0.92, // 1 EUR ≈ 1.087 USD
    'GBP': 1/0.81, // 1 GBP ≈ 1.235 USD
    'INR': 1/82.5, // 1 INR ≈ 0.012 USD
    'JPY': 1/150.0 // 1 JPY ≈ 0.0067 USD
  };

  const PAYMENT_METHODS = [
    'Cash',
    'Credit',
    'Debit',
    'UPI',
    'Cheque'
  ];

  const addNewExpense = async () => {
    if (!name || !amount || !paymentMethod || !currency) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Convert the entered amount to USD based on the selected currency
      const amountInUSD = Number(amount) * CURRENCY_CONVERSIONS[currency];
      
      // Convert to cents and round to nearest cent
      const amountInCents = Math.round(amountInUSD * 100);

      const result = await db.insert(Expenses).values({
        name: name,
        amount: amountInCents,  // Store in cents (integer)
        budgetId: Number(budgetId),
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().toDate(),
        payment_method: paymentMethod,
      }).returning({ insertedId: Expenses.id });

      if (result) {
        refreshData();
        setName('');
        setAmount('');
        setPaymentMethod('Cash');
        setCurrency('USD');
        toast.success("New Expense Added!");
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
          <h2 className="text-gray-400 font-medium my-1">Currency</h2>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-[#3a3a3a] text-gray-200 rounded-lg p-2 w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            {Object.keys(CURRENCY_CONVERSIONS).map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
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