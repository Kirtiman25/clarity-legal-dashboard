import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, DollarSign, Building2, Scale } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Tracker = () => {
  const [clientsData, setClientsData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (userProfile) {
      fetchClientsAndEarnings();
    }
  }, [userProfile]);

  const fetchClientsAndEarnings = async () => {
    try {
      // Fetch clients with their cases and earnings
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select(`
          *,
          cases(*),
          earnings(amount)
        `)
        .eq('user_id', userProfile?.id?.toString());

      if (clientsError) throw clientsError;

      // Calculate total earnings
      const { data: earnings, error: earningsError } = await supabase
        .from('earnings')
        .select('amount')
        .eq('user_id', userProfile?.id?.toString());

      if (earningsError) throw earningsError;

      const total = earnings.reduce((sum, earning) => sum + Number(earning.amount), 0);
      setTotalEarnings(total);

      // Process clients data
      const processedClients = clients.map(client => ({
        ...client,
        totalEarnings: client.earnings.reduce((sum: number, earning: any) => sum + Number(earning.amount), 0),
        cases: client.cases || []
      }));

      setClientsData(processedClients);
    } catch (error) {
      console.error('Error fetching clients and earnings:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending_payment':
        return 'destructive';
      case 'pre_due_diligence':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header title="Dashboard" />
        
        <div className="container mx-auto px-4 pt-20 pb-24">
          <Card className="mb-6 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium opacity-90">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8" />
                <span className="text-3xl font-bold">₹{totalEarnings.toLocaleString()}</span>
              </div>
              <p className="text-green-100 text-sm mt-2">
                From {clientsData.length} clients across {clientsData.reduce((sum: number, client: any) => sum + client.cases.length, 0)} cases
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Clients</h2>
            
            {clientsData.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No clients found. Start adding clients to track your earnings.</p>
                </CardContent>
              </Card>
            ) : (
              clientsData.map((client: any) => (
                <Card key={client.id} className="overflow-hidden">
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-500 p-3 rounded-lg">
                              <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{client.name}</CardTitle>
                              <p className="text-gray-600 text-sm">
                                {client.cases.length} cases • ₹{client.totalEarnings.toLocaleString()} earned
                              </p>
                            </div>
                          </div>
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0 border-t border-gray-100">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <Scale className="h-4 w-4" />
                            <span>Cases</span>
                          </h4>
                          
                          {client.cases.length === 0 ? (
                            <p className="text-gray-500 text-sm">No cases found for this client.</p>
                          ) : (
                            client.cases.map((case_item: any) => (
                              <div 
                                key={case_item.id} 
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <h5 className="font-medium text-gray-900">{case_item.name}</h5>
                                  <p className="text-sm text-gray-600">Case ID: {case_item.id.slice(0, 8)}</p>
                                </div>
                                <Badge variant={getStatusColor(case_item.status)}>
                                  {case_item.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {clientsData.reduce((sum: number, client: any) => sum + client.cases.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Cases</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{clientsData.length}</div>
                <div className="text-sm text-gray-600">Active Clients</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Navigation />
      </div>
    </ProtectedRoute>
  );
};

export default Tracker;
