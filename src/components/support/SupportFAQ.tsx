
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { FAQItem } from './types';

const SupportFAQ = () => {
  const faqItems: FAQItem[] = [
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

  return (
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
  );
};

export default SupportFAQ;
