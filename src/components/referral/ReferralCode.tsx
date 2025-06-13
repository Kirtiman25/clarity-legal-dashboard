
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReferralCodeProps {
  referralCode?: string;
}

const ReferralCode = ({ referralCode }: ReferralCodeProps) => {
  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Referral Code</label>
          <div className="flex space-x-2 mt-1">
            <Input 
              value={referralCode || 'Loading...'} 
              readOnly 
              className="font-mono text-lg"
            />
            <Button onClick={copyReferralCode} variant="outline" disabled={!referralCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Referral Link</label>
          <div className="flex space-x-2 mt-1">
            <Input 
              value={referralCode ? `${window.location.origin}?ref=${referralCode}` : 'Loading...'} 
              readOnly 
              className="text-sm"
            />
            <Button onClick={copyReferralLink} variant="outline" disabled={!referralCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900">How it works:</h4>
          <ul className="text-sm text-blue-800 mt-2 space-y-1">
            <li>• Share your referral code or link with friends</li>
            <li>• Earn ₹500 for each successful referral</li>
            <li>• Your friends get exclusive benefits too!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCode;
