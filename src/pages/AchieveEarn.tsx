
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Calendar, DollarSign } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const AchieveEarn = () => {
  const [bonusOffers, setBonusOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBonusOffers();
    }
  }, [user]);

  const fetchBonusOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bonus_offers')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBonusOffers(data || []);
    } catch (error) {
      console.error('Error fetching bonus offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      Target,
      Calendar,
      DollarSign,
      Trophy
    };
    return icons[iconName as keyof typeof icons] || Trophy;
  };

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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header title="Achieve and Earn" />
        
        <div className="container mx-auto px-4 pt-20 pb-24">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bonus Challenges</h2>
            <p className="text-gray-600">Complete these challenges to earn extra rewards</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading challenges...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {bonusOffers.map((offer: any) => {
                  const IconComponent = getIconComponent(offer.icon_name);
                  const current = 0; // This would come from actual progress tracking
                  const status = getStatusBadge(current, offer.target);
                  const progress = getProgressPercentage(current, offer.target);
                  
                  return (
                    <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`${offer.color || 'bg-blue-500'} p-2 rounded-lg`}>
                              <IconComponent className="h-5 w-5 text-white" />
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
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">
                                Progress: {current}/{offer.target}
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
            </>
          )}
        </div>

        <Navigation />
      </div>
    </ProtectedRoute>
  );
};

export default AchieveEarn;
