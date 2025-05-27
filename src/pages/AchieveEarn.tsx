
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Calendar, DollarSign } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

const AchieveEarn = () => {
  const bonusOffers = [
    {
      id: 1,
      title: 'Task Master',
      description: 'Close 3 tasks in a week and earn ₹500',
      reward: '₹500',
      target: 3,
      current: 1,
      timeframe: 'Weekly',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Speed Demon',
      description: 'Complete 5 follow-up tasks in 24 hours',
      reward: '₹300',
      target: 5,
      current: 0,
      timeframe: 'Daily',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Payment Pro',
      description: 'Collect 10 pending payments this month',
      reward: '₹1,000',
      target: 10,
      current: 4,
      timeframe: 'Monthly',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Document Champion',
      description: 'Submit documents for 7 cases this week',
      reward: '₹400',
      target: 7,
      current: 2,
      timeframe: 'Weekly',
      icon: Trophy,
      color: 'bg-orange-500'
    }
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusBadge = (current: number, target: number) => {
    const percentage = getProgressPercentage(current, target);
    if (percentage === 100) return { variant: 'default' as const, text: 'Completed' };
    if (percentage >= 50) return { variant: 'secondary' as const, text: 'In Progress' };
    return { variant: 'outline' as const, text: 'Not Started' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Achieve and Earn" />
      
      <div className="container mx-auto px-4 pt-20 pb-24">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Bonus Challenges</h2>
          <p className="text-gray-600">Complete these challenges to earn extra rewards</p>
        </div>

        <div className="space-y-4">
          {bonusOffers.map((offer) => {
            const status = getStatusBadge(offer.current, offer.target);
            const progress = getProgressPercentage(offer.current, offer.target);
            
            return (
              <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`${offer.color} p-2 rounded-lg`}>
                        <offer.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        <p className="text-sm text-gray-600">{offer.description}</p>
                      </div>
                    </div>
                    <Badge variant={status.variant}>{status.text}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Progress Section */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Progress: {offer.current}/{offer.target}
                        </span>
                        <span className="text-lg font-bold text-green-600">{offer.reward}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{offer.timeframe}</span>
                      </div>
                      
                      {progress === 100 ? (
                        <Button variant="outline" size="sm" disabled>
                          Claim Reward
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Total Potential Earnings</h3>
                <p className="text-green-100 text-sm">Complete all challenges this month</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">₹2,200</div>
                <div className="text-green-100 text-sm">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default AchieveEarn;
