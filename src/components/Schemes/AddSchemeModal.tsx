import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Scheme } from '@/types';

interface AddSchemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScheme: (scheme: Scheme) => void;
}

const availableSchemes = [
  'PM Awas Yojana',
  'Digital India Initiative',
  'Skill Development Program',
  'Pradhan Mantri Mudra Yojana',
  'Ayushman Bharat',
  'PM Kisan Samman Nidhi',
  'Swachh Bharat Mission',
  'Make in India',
  'Startup India',
  'Beti Bachao Beti Padhao'
];

export function AddSchemeModal({ isOpen, onClose, onAddScheme }: AddSchemeModalProps) {
  const [formData, setFormData] = useState({
    schemeName: '',
    applicantName: '',
    age: '',
    gender: '',
    income: '',
    address: '',
    phoneNumber: '',
    email: '',
    documents: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const checkEligibility = (schemeName: string, age: number, income: number): boolean => {
    // Simple eligibility logic based on scheme
    switch (schemeName) {
      case 'PM Awas Yojana':
        return income <= 300000 && age >= 21 && age <= 55;
      case 'Digital India Initiative':
        return age >= 18 && age <= 60;
      case 'Skill Development Program':
        return age >= 18 && age <= 45 && income <= 500000;
      case 'Pradhan Mantri Mudra Yojana':
        return age >= 18 && income <= 1000000;
      case 'Ayushman Bharat':
        return income <= 500000;
      case 'PM Kisan Samman Nidhi':
        return income <= 200000;
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.schemeName || !formData.applicantName || !formData.age || !formData.gender || !formData.income) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const age = parseInt(formData.age);
      const income = parseInt(formData.income);

      if (isNaN(age) || isNaN(income)) {
        toast({
          title: "Validation Error",
          description: "Age and income must be valid numbers.",
          variant: "destructive",
        });
        return;
      }

      const eligibilityMatch = checkEligibility(formData.schemeName, age, income);

      const newScheme: Scheme = {
        id: Date.now().toString(),
        name: formData.schemeName,
        applicantName: formData.applicantName,
        age,
        gender: formData.gender,
        income,
        eligibilityMatch,
        status: 'Applied',
        appliedAt: new Date().toISOString(),
        isNew: true,
        // Additional fields for extended scheme data
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        documents: formData.documents,
        description: formData.description
      };

      onAddScheme(newScheme);
      
      toast({
        title: "Scheme Application Submitted",
        description: `Application for ${formData.schemeName} has been submitted successfully.`,
      });

      // Reset form
      setFormData({
        schemeName: '',
        applicantName: '',
        age: '',
        gender: '',
        income: '',
        address: '',
        phoneNumber: '',
        email: '',
        documents: '',
        description: ''
      });

      onClose();
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit scheme application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Scheme Application
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Scheme Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schemeName">Scheme Name *</Label>
              <Select value={formData.schemeName} onValueChange={(value) => handleInputChange('schemeName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a scheme" />
                </SelectTrigger>
                <SelectContent>
                  {availableSchemes.map((scheme) => (
                    <SelectItem key={scheme} value={scheme}>
                      {scheme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicantName">Applicant Name *</Label>
              <Input
                id="applicantName"
                value={formData.applicantName}
                onChange={(e) => handleInputChange('applicantName', e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter age"
                min="1"
                max="100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="income">Annual Income (₹) *</Label>
              <Input
                id="income"
                type="number"
                value={formData.income}
                onChange={(e) => handleInputChange('income', e.target.value)}
                placeholder="Enter annual income"
                min="0"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter complete address"
              rows={2}
            />
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <Label htmlFor="documents">Required Documents</Label>
            <Textarea
              id="documents"
              value={formData.documents}
              onChange={(e) => handleInputChange('documents', e.target.value)}
              placeholder="List the documents submitted (e.g., Aadhar Card, Income Certificate, etc.)"
              rows={2}
            />
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="description">Additional Information</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Any additional information or special circumstances"
              rows={3}
            />
          </div>

          {/* Eligibility Preview */}
          {formData.schemeName && formData.age && formData.income && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Eligibility Check Preview</h4>
              <div className="text-sm">
                <p className="mb-1">Scheme: <strong>{formData.schemeName}</strong></p>
                <p className="mb-1">Age: <strong>{formData.age} years</strong></p>
                <p className="mb-1">Income: <strong>₹{parseInt(formData.income || '0').toLocaleString()}</strong></p>
                <p className={`font-medium ${
                  checkEligibility(formData.schemeName, parseInt(formData.age), parseInt(formData.income))
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  Status: {checkEligibility(formData.schemeName, parseInt(formData.age), parseInt(formData.income))
                    ? '✅ Eligible' 
                    : '❌ Not Eligible'}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}