
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, Mail, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SupportOption } from './types';

const SupportOptions = () => {
  const handleSupportAction = (action: string) => {
    switch (action) {
      case 'Start Chat':
        toast({
          title: "Starting Live Chat",
          description: "Connecting you to our support team...",
        });
        break;
      case 'Call Now':
        window.open('tel:+919876543210', '_self');
        toast({
          title: "Calling Support",
          description: "Opening phone dialer...",
        });
        break;
      case 'Send Email':
        window.open('mailto:support@clarcatalyst.com?subject=Support Request', '_blank');
        toast({
          title: "Opening Email",
          description: "Your email client will open shortly...",
        });
        break;
      case 'View Docs':
        toast({
          title: "Documentation",
          description: "Opening documentation in new tab...",
        });
        window.open('#', '_blank');
        break;
      default:
        break;
    }
  };

  const supportOptions: SupportOption[] = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageSquare,
      action: "Start Chat",
      color: "bg-blue-500"
    },
    {
      title: "Phone Support",
      description: "Call us at +91-9876543210",
      icon: Phone,
      action: "Call Now",
      color: "bg-green-500"
    },
    {
      title: "Email Support",
      description: "Send us an email at support@clarcatalyst.com",
      icon: Mail,
      action: "Send Email",
      color: "bg-purple-500"
    },
    {
      title: "Documentation",
      description: "Browse our comprehensive guides",
      icon: FileText,
      action: "View Docs",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {supportOptions.map((option, index) => (
        <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`${option.color} p-3 rounded-lg`}>
                <option.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => handleSupportAction(option.action)}
              >
                {option.action}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SupportOptions;
