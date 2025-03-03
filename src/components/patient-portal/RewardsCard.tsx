
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Trophy, 
  Gift, 
  CreditCard, 
  Coins,
  Calendar 
} from "lucide-react";
import { toast } from "sonner";

type RewardTransaction = {
  id: string;
  date: string;
  amount: number;
  points: number;
  type: "earned" | "redeemed";
  description: string;
};

const RewardsCard = () => {
  const { auth, updateProfile } = useAuth();
  const rewardPoints = auth.rewardPoints || 0;
  const rewardValue = Math.floor(rewardPoints);

  // Mock transaction history
  const [transactions, setTransactions] = useState<RewardTransaction[]>([
    {
      id: "tx1",
      date: "2023-10-15",
      amount: 5000,
      points: 50,
      type: "earned",
      description: "Regular checkup"
    },
    {
      id: "tx2",
      date: "2023-11-03",
      amount: 3000,
      points: 30,
      type: "earned",
      description: "Blood test"
    },
    {
      id: "tx3",
      date: "2023-11-20",
      amount: 0,
      points: 20,
      type: "redeemed",
      description: "Discount on consultation"
    },
    {
      id: "tx4",
      date: "2023-12-05",
      amount: 8000,
      points: 80,
      type: "earned",
      description: "Health checkup package"
    }
  ]);

  const handleRedeem = () => {
    if (rewardPoints < 10) {
      toast.error("You need at least 10 points to redeem rewards");
      return;
    }
    
    toast.success(`Reward code generated! You can use it on your next visit.`);
    
    // In a real app, this would call an API to generate a redemption code
    // and update the user's points balance
  };

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <CardTitle>Patient Rewards</CardTitle>
          </div>
        </div>
        <CardDescription>
          Earn 1 rupee worth of points for every 100 rupees spent
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="h-5 w-5 text-indigo-600" />
              <h3 className="font-medium text-indigo-900">Available Points</h3>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-indigo-700">{rewardPoints}</span>
              <span className="ml-2 text-indigo-600">points</span>
            </div>
            <p className="mt-2 text-sm text-indigo-700">
              Worth ₹{rewardValue} on your next visit
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-5 w-5 text-emerald-600" />
              <h3 className="font-medium text-emerald-900">Redeem Rewards</h3>
            </div>
            <p className="text-sm text-emerald-700 mb-3">
              Use your points for discounts on future services
            </p>
            <Button 
              onClick={handleRedeem} 
              variant="default" 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Redeem Now
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Transaction History
          </h3>
          <div className="overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Description</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 flex items-center gap-2 whitespace-nowrap">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {tx.date}
                      </td>
                      <td className="px-4 py-3">{tx.description}</td>
                      <td className="px-4 py-3 text-right">
                        {tx.type === "earned" ? `₹${tx.amount}` : "-"}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${
                        tx.type === "earned" 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {tx.type === "earned" ? `+${tx.points}` : `-${tx.points}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsCard;
