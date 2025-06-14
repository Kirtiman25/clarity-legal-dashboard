
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Clock, CheckCircle, AlertCircle, Users, MessageSquare } from 'lucide-react';

const SupportAnalytics = () => {
  // Mock data for support metrics
  const ticketTrends = [
    { month: 'Jan', tickets: 45, resolved: 42 },
    { month: 'Feb', tickets: 52, resolved: 48 },
    { month: 'Mar', tickets: 48, resolved: 45 },
    { month: 'Apr', tickets: 61, resolved: 58 },
    { month: 'May', tickets: 55, resolved: 52 },
    { month: 'Jun', tickets: 67, resolved: 63 }
  ];

  const issueCategories = [
    { name: 'Technical Issues', value: 35, color: '#3b82f6' },
    { name: 'Account Problems', value: 25, color: '#ef4444' },
    { name: 'Billing Questions', value: 20, color: '#f59e0b' },
    { name: 'Feature Requests', value: 15, color: '#10b981' },
    { name: 'Other', value: 5, color: '#8b5cf6' }
  ];

  const responseTimeData = [
    { day: 'Mon', avgTime: 2.5 },
    { day: 'Tue', avgTime: 3.2 },
    { day: 'Wed', avgTime: 2.8 },
    { day: 'Thu', avgTime: 3.5 },
    { day: 'Fri', avgTime: 4.2 },
    { day: 'Sat', avgTime: 2.1 },
    { day: 'Sun', avgTime: 1.8 }
  ];

  const satisfactionData = [
    { month: 'Jan', satisfaction: 4.2 },
    { month: 'Feb', satisfaction: 4.3 },
    { month: 'Mar', satisfaction: 4.1 },
    { month: 'Apr', satisfaction: 4.4 },
    { month: 'May', satisfaction: 4.5 },
    { month: 'Jun', satisfaction: 4.3 }
  ];

  const chartConfig = {
    tickets: { label: 'Total Tickets', color: '#3b82f6' },
    resolved: { label: 'Resolved', color: '#10b981' },
    avgTime: { label: 'Avg Response Time (hrs)', color: '#f59e0b' },
    satisfaction: { label: 'Satisfaction Score', color: '#8b5cf6' }
  };

  const stats = [
    {
      title: 'Total Tickets',
      value: '328',
      change: '+12%',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      title: 'Resolved Tickets',
      value: '308',
      change: '+8%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Avg Response Time',
      value: '2.8hrs',
      change: '-15%',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Satisfaction Score',
      value: '4.3/5',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Support Analytics</h2>
        <p className="text-gray-600 mt-2">Performance metrics and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change} from last month</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={ticketTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="tickets" stroke="var(--color-tickets)" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="var(--color-resolved)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Issue Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={issueCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {issueCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card>
          <CardHeader>
            <CardTitle>Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgTime" fill="var(--color-avgTime)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Customer Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[3.5, 5]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="satisfaction" stroke="var(--color-satisfaction)" fill="var(--color-satisfaction)" fillOpacity={0.3} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportAnalytics;
