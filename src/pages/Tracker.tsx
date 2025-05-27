
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, DollarSign, Building2, Scale } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

const Tracker = () => {
  const [user, setUser] = useState<any>(null);
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'ABC Enterprises',
      totalEarnings: 25000,
      cases: [
        { id: 1, name: 'Debt Recovery Case #123', status: 'In Progress' },
        { id: 2, name: 'Legal Notice Case #124', status: 'Completed' },
        { id: 3, name: 'Contract Dispute #125', status: 'Pending Payment' }
      ]
    },
    {
      id: 2,
      name: 'XYZ Corporation',
      totalEarnings: 15000,
      cases: [
        { id: 4, name: 'Cheque Bounce Case #126', status: 'Pre-Due Diligence' },
        { id: 5, name: 'Property Dispute #127', status: 'In Progress' }
      ]
    },
    {
      id: 3,
      name: 'PQR Ltd',
      totalEarnings: 8000,
      cases: [
        { id: 6, name: 'Employment Dispute #128', status: 'Completed' },
        { id: 7, name: 'Tax Advisory #129', status: 'In Progress' }
      ]
    }
  ]);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setUser(userData);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Pending Payment':
        return 'destructive';
      case 'Pre-Due Diligence':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const totalEarnings = clients.reduce((sum, client) => sum + client.totalEarnings, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" />
      
      <div className="container mx-auto px-4 pt-20 pb-24">
        {/* Total Earnings Card */}
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
              From {clients.length} clients across {clients.reduce((sum, client) => sum + client.cases.length, 0)} cases
            </p>
          </CardContent>
        </Card>

        {/* Clients List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Clients</h2>
          
          {clients.map((client) => (
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
                      
                      {client.cases.map((case_item) => (
                        <div 
                          key={case_item.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900">{case_item.name}</h5>
                            <p className="text-sm text-gray-600">Case ID: {case_item.id}</p>
                          </div>
                          <Badge variant={getStatusColor(case_item.status)}>
                            {case_item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {clients.reduce((sum, client) => sum + client.cases.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Cases</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{clients.length}</div>
              <div className="text-sm text-gray-600">Active Clients</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Tracker;
