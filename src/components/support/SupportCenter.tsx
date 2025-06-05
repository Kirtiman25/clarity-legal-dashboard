
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageSquare, Phone, Mail, FileText, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SupportCenter = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const faqItems = [
    {
      question: "How do I complete a task?",
      answer: "To complete a task, click on the task card in your Tasks page. Fill in the required information based on the task type (payment details, documents, etc.) and click 'Complete Task'."
    },
    {
      question: "How does the referral system work?",
      answer: "Share your unique referral code with friends. When they sign up and complete their first task, you'll earn ₹500. You can find your referral code in the Refer & Earn section."
    },
    {
      question: "When will I receive my earnings?",
      answer: "Earnings are processed within 3-5 business days after task completion. You can track your earnings in the Tracker section."
    },
    {
      question: "What documents do I need to submit?",
      answer: "Required documents vary by case type. Common documents include client agreements, court orders, and payment receipts. Check the specific task details for requirements."
    },
    {
      question: "How do I change my account settings?",
      answer: "Click on your profile picture in the top right corner and select the appropriate option from the dropdown menu."
    }
  ];

  const supportOptions = [
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
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
        <p className="text-gray-600 mt-2">We're here to help you succeed</p>
      </div>

      {/* Support Options */}
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
                <Button variant="outline">{option.action}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
              />
            </div>
            
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportCenter;
