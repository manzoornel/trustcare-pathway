
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "What insurance plans do you accept?",
      answer: "We accept most major insurance plans, including Medicare, Medicaid, Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealthcare. Please contact our office to verify your specific coverage."
    },
    {
      question: "How do I schedule an appointment?",
      answer: "You can schedule an appointment by calling our office, using our online booking system on the Appointments page, or by visiting our clinic in person."
    },
    {
      question: "What should I bring to my first appointment?",
      answer: "Please bring your insurance card, photo ID, a list of current medications, medical records if available, and any relevant information about your medical history."
    },
    {
      question: "Do you offer telemedicine services?",
      answer: "Yes, we offer telemedicine services for certain types of appointments. Please call our office to determine if your visit is eligible for a virtual appointment."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services, appointments, and policies.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 py-4' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
