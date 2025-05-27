import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar, ChevronDown, Mail, Phone, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

const Support = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBookMeeting = () => {
    // This would typically open Calendly or similar booking system
    window.open('https://calendly.com/legal-expert/15min', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Support" />
      
      <div className="container mx-auto px-4 pt-20 pb-24">
        {/* Book Meeting Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-6 w-6" />
              <span>Book a Meeting</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 opacity-90">
              Schedule a 15-20 minute consultation with our legal experts to discuss your cases and get personalized advice.
            </p>
            <Button 
              onClick={handleBookMeeting}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </CardContent>
        </Card>

        {/* Other Support Options */}
        <Card>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-6 w-6" />
                    <span>Other Support Options</span>
                  </CardTitle>
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Email Support */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-green-500 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Email Support</h3>
                      <p className="text-gray-600 text-sm">Get help via email within 24 hours</p>
                      <a 
                        href="mailto:support@legaldashboard.com" 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        support@legaldashboard.com
                      </a>
                    </div>
                  </div>

                  {/* Phone Support */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-purple-500 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Phone Support</h3>
                      <p className="text-gray-600 text-sm">Call us during business hours</p>
                      <a 
                        href="tel:+911234567890" 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        +91 12345 67890
                      </a>
                      <p className="text-xs text-gray-500 mt-1">
                        Mon-Fri: 9:00 AM - 6:00 PM IST
                      </p>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="bg-red-500 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900">Emergency Contact</h3>
                      <p className="text-red-700 text-sm">For urgent legal matters only</p>
                      <a 
                        href="tel:+911234567891" 
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        +91 12345 67891
                      </a>
                      <p className="text-xs text-red-600 mt-1">
                        Available 24/7 for emergencies
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">How do I track my case progress?</h4>
                <p className="text-gray-600 text-sm">
                  Visit the Tracker page to see all your cases and their current status. You'll receive notifications for important updates.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">When will I receive my earnings?</h4>
                <p className="text-gray-600 text-sm">
                  Earnings are processed within 7-10 business days after successful case completion or client payment receipt.
                </p>
              </div>
              
              <div className="pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">How does the referral program work?</h4>
                <p className="text-gray-600 text-sm">
                  Share your unique referral code with friends. When they sign up and become paid members, you'll earn rewards based on our current offer structure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Support;
