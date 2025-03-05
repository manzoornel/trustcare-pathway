
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

type RewardTransaction = {
  id: string;
  date: string;
  amount: number;
  points: number;
  type: "earned" | "redeemed";
  description: string;
};

const RewardsCard = () => {
  const { auth } = useAuth();
  const rewardPoints = auth.rewardPoints || 0;
  const rewardValue = Math.floor(rewardPoints);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // State for transactions
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!auth.userId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('reward_transactions')
          .select('*')
          .eq('patient_id', auth.userId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setTransactions(data as RewardTransaction[]);
        }
      } catch (error) {
        console.error('Error fetching reward transactions:', error);
        toast.error('Failed to load reward transactions');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [auth.userId]);

  const handleRedeem = async () => {
    if (!auth.userId) {
      toast.error("You need to be logged in to redeem rewards");
      return;
    }
    
    if (rewardPoints < 10) {
      toast.error("You need at least 10 points to redeem rewards");
      return;
    }
    
    setIsRedeeming(true);
    
    try {
      // Create a new transaction
      const pointsToRedeem = 10;
      const { error: transactionError } = await supabase
        .from('reward_transactions')
        .insert({
          patient_id: auth.userId,
          date: new Date().toISOString().split('T')[0],
          points: pointsToRedeem,
          type: 'redeemed',
          description: 'Discount on consultation'
        });
        
      if (transactionError) throw transactionError;
      
      // Update user's points
      const { error: updateError } = await supabase
        .from('patient_rewards')
        .update({ points: rewardPoints - pointsToRedeem })
        .eq('patient_id', auth.userId);
        
      if (updateError) throw updateError;
      
      // Refresh the transaction list
      const { data: newTransactions, error: fetchError } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('patient_id', auth.userId)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      if (newTransactions) {
        setTransactions(newTransactions as RewardTransaction[]);
      }
      
      toast.success(`Reward code generated! You can use it on your next visit.`);
    } catch (error: any) {
      console.error('Error redeeming rewards:', error);
      toast.error(error.message || 'Failed to redeem rewards');
    } finally {
      setIsRedeeming(false);
    }
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
              disabled={isRedeeming || rewardPoints < 10}
            >
              {isRedeeming ? "Processing..." : "Redeem Now"}
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Transaction History
          </h3>
          <div className="overflow-hidden rounded-lg border">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No transactions yet</div>
            ) : (
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
                          {tx.type === "earned" ? `₹${tx.amount || 0}` : "-"}
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsCard;
