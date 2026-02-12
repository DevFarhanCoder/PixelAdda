import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What file formats do you provide?',
      answer: 'We provide design files in multiple formats including PSD (Photoshop), AI (Adobe Illustrator), CDR (CorelDRAW), and sometimes bundled in ZIP files for convenience.'
    },
    {
      question: 'How do I download my purchased designs?',
      answer: 'After completing your purchase, go to your Dashboard. All your purchased designs will be listed there with download buttons. Click the download button to get your files.'
    },
    {
      question: 'Can I use these designs for commercial projects?',
      answer: 'Yes! Once you purchase a design, you have full commercial rights to use it in your projects, whether personal or commercial.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods through Razorpay including credit/debit cards, UPI, net banking, and digital wallets.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Since these are digital products, refunds are generally not available once the file has been downloaded. However, if you encounter technical issues with the file, please contact us at +91 98203 29571.'
    },
    {
      question: 'Do I need to create an account to purchase?',
      answer: 'Yes, you need to create a free account to purchase and access your downloaded files. This helps us keep track of your purchases and allows you to re-download files anytime.'
    },
    {
      question: 'Are the files editable?',
      answer: 'Yes! All our design files are fully editable. You can customize colors, text, images, and layouts using the respective software (Photoshop, Illustrator, or CorelDRAW).'
    },
    {
      question: 'How long do I have access to my purchased files?',
      answer: 'Forever! Once you purchase a design, you have lifetime access to download it from your dashboard.'
    },
    {
      question: 'Can I request custom designs?',
      answer: 'Currently, we only sell pre-made design templates. For custom design requests, please contact us at +91 98203 29571 to discuss your requirements.'
    },
    {
      question: 'What if I have technical issues with a file?',
      answer: 'If you encounter any technical issues with your downloaded file, please contact us immediately at +91 98203 29571 or email support@pixeladda.com. We\'ll help resolve the issue.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="text-sm text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold tracking-tight mb-4" data-testid="faq-heading">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about Pixeladda
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border rounded-lg"
              data-testid={`faq-item-${index}`}
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/20 transition-colors">
                <h3 className="font-medium pr-8">{faq.question}</h3>
                <ChevronDown className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-6 pb-6 pt-2 text-muted-foreground">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 p-8 bg-muted/20 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <Link to="/contact">
            <Button data-testid="contact-us-button">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
