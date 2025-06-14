
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SupportOptions from './SupportOptions';
import SupportFAQ from './SupportFAQ';
import SupportContactForm from './SupportContactForm';
import SupportAnalytics from './SupportAnalytics';

const SupportCenter = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
        <p className="text-gray-600 mt-2">We're here to help you succeed</p>
      </div>

      <Tabs defaultValue="support" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="support" className="space-y-6">
          <SupportOptions />
          <SupportFAQ />
          <SupportContactForm />
        </TabsContent>
        
        <TabsContent value="analytics">
          <SupportAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportCenter;
