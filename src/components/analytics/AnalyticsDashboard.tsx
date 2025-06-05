
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, DollarSign, Users, CheckSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  monthlyEarnings: Array<{ month: string; amount: number }>;
  taskCompletion: Array<{ date: string; completed: number; pending: number }>;
  earningsBreakdown: Array<{ source: string; amount: number; color: string }>;
  totalStats: {
    totalEarnings: number;
    completedTasks: number;
    pendingTasks: number;
    growthRate: number;
  };
}

const AnalyticsDashboard = () => {
  const { userProfile } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    monthlyEarnings: [],
    taskCompletion: [],
    earningsBreakdown: [],
    totalStats: {
      totalEarnings: 0,
      completedTasks: 0,
      pendingTasks: 0,
      growthRate: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      fetchAnalyticsData();
    }
  }, [userProfile]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch earnings data
      const { data: earnings } = await supabase
        .from('earnings')
        .select('*')
        .eq('user_id', userProfile?.id);

      // Fetch tasks data
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userProfile?.id);

      // Process monthly earnings
      const monthlyEarnings = processMonthlyEarnings(earnings || []);
      
      // Process task completion data
      const taskCompletion = processTaskCompletion(tasks || []);
      
      // Process earnings breakdown
      const earningsBreakdown = processEarningsBreakdown(earnings || []);
      
      // Calculate total stats
      const totalEarnings = earnings?.reduce((sum, earning) => sum + Number(earning.amount), 0) || 0;
      const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
      const pendingTasks = tasks?.filter(task => task.status === 'pending').length || 0;
      
      setAnalytics({
        monthlyEarnings,
        taskCompletion,
        earningsBreakdown,
        totalStats: {
          totalEarnings,
          completedTasks,
          pendingTasks,
          growthRate: 12.5 // Mock growth rate
        }
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyEarnings = (earnings: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      amount: Math.floor(Math.random() * 5000) + 1000 // Mock data
    }));
  };

  const processTaskCompletion = (tasks: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: Math.floor(Math.random() * 5) + 1,
        pending: Math.floor(Math.random() * 3) + 1
      };
    }).reverse();
    
    return last7Days;
  };

  const processEarningsBreakdown = (earnings: any[]) => {
    return [
      { source: 'Tasks', amount: 15000, color: '#8884d8' },
      { source: 'Referrals', amount: 3000, color: '#82ca9d' },
      { source: 'Bonuses', amount: 2000, color: '#ffc658' },
      { source: 'Other', amount: 500, color: '#ff7300' }
    ];
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">₹{analytics.totalStats.totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold">{analytics.totalStats.completedTasks}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.totalStats.pendingTasks}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-blue-600">+{analytics.totalStats.growthRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Completion Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.taskCompletion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
                <Line type="monotone" dataKey="pending" stroke="#ff7300" name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Earnings Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.earningsBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, amount }) => `${source}: ₹${amount}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {analytics.earningsBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Task Completion Rate</span>
                <span className="font-semibold">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Earnings per Task</span>
                <span className="font-semibold">₹2,500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="font-semibold">2.3 days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
