
// Structured Q&A data for Doctor Uncle Family Clinic AI Chat
export interface QAItem {
  question: string;
  answer: string;
}

export interface CategoryData {
  category: string;
  questions: QAItem[];
}

export const qaData: CategoryData[] = [
  {
    category: "Clinic Information",
    questions: [
      {
        question: "What is Doctor Uncle Family Clinic?",
        answer: "Doctor Uncle Family Clinic is a 24/7 healthcare facility providing general medical consultations, specialist care, laboratory services, minor surgeries, home care, and a fully stocked pharmacy."
      },
      {
        question: "What are the clinic's working hours?",
        answer: "Our clinic operates 24/7. You can visit anytime for consultations, lab tests, and pharmacy services."
      },
      {
        question: "How can I book an appointment?",
        answer: "You can book an appointment by calling our reception at +91 XXXXX XXXXX, visiting our website, or walking in directly."
      }
    ]
  },
  {
    category: "Lab Tests",
    questions: [
      {
        question: "What is a normal fasting blood sugar level?",
        answer: "A normal fasting blood sugar level is between 70-100 mg/dL. If your levels are higher, consult our doctor for further evaluation."
      },
      {
        question: "How do I prepare for a lipid profile test?",
        answer: "You need to fast for 9-12 hours before a lipid profile test. Only water is allowed. Visit our lab for sample collection."
      },
      {
        question: "Can I get my lab reports online?",
        answer: "Yes! Visit our website and enter your patient ID to access lab reports. You can also collect them from our reception."
      }
    ]
  },
  {
    category: "Medications",
    questions: [
      {
        question: "Can I buy antibiotics without a prescription?",
        answer: "No, antibiotics require a valid doctor's prescription. Unsupervised antibiotic use can lead to resistance and health risks."
      },
      {
        question: "What is the dosage of paracetamol for fever?",
        answer: "For adults, the usual dose is 500-1000 mg every 6-8 hours, not exceeding 4000 mg per day. For children, dosage depends on weight. Consult our doctor before use."
      },
      {
        question: "Can I take diabetes medication on an empty stomach?",
        answer: "Some diabetes medications, like Metformin, should be taken with food to prevent stomach upset. Always follow your doctor's advice."
      }
    ]
  },
  {
    category: "Symptoms & First Aid",
    questions: [
      {
        question: "I have a fever and sore throat. What should I do?",
        answer: "Stay hydrated, take rest, and monitor your temperature. If fever persists for more than 3 days or you have difficulty swallowing, visit the clinic for consultation."
      },
      {
        question: "What should I do if I have chest pain?",
        answer: "Chest pain can be serious. If you have pain lasting more than a few minutes, along with sweating, nausea, or breathlessness, seek emergency medical help immediately."
      },
      {
        question: "I have stomach pain and vomiting. What could be the reason?",
        answer: "This could be due to food poisoning, gastritis, or viral infection. Drink plenty of fluids. If vomiting persists or you have severe pain, visit our clinic for evaluation."
      }
    ]
  },
  {
    category: "Health Conditions",
    questions: [
      {
        question: "What are the early symptoms of diabetes?",
        answer: "Increased thirst, frequent urination, unexplained weight loss, fatigue, and slow wound healing are common early signs. Get your blood sugar checked for confirmation."
      },
      {
        question: "How can I manage high blood pressure naturally?",
        answer: "Reduce salt intake, exercise regularly, manage stress, avoid smoking, and eat a balanced diet rich in fruits and vegetables."
      },
      {
        question: "How can I prevent dengue fever?",
        answer: "Avoid mosquito bites by using repellents, wearing long sleeves, and eliminating stagnant water where mosquitoes breed."
      }
    ]
  },
  {
    category: "Diet & Wellness",
    questions: [
      {
        question: "What is the best diet for weight loss?",
        answer: "Focus on high-protein, fiber-rich foods, avoid sugar and processed carbs, and stay hydrated. Exercise regularly for best results."
      },
      {
        question: "What should I eat if I have anemia?",
        answer: "Consume iron-rich foods like spinach, liver, eggs, and nuts. Pair them with vitamin C-rich foods like oranges for better absorption."
      },
      {
        question: "How much water should I drink daily?",
        answer: "An average adult should drink 2-3 liters of water per day, but this varies based on climate and activity levels."
      }
    ]
  },
  {
    category: "Emergency Care",
    questions: [
      {
        question: "What should I do in case of a stroke?",
        answer: "If someone has sudden weakness in one side of the body, difficulty speaking, or facial drooping, call emergency services immediately."
      },
      {
        question: "How do I treat a minor burn?",
        answer: "Run cool water over the burn for 10 minutes. Do not apply ice or butter. Cover with a sterile bandage and seek medical help if it's severe."
      },
      {
        question: "What should I do if I suspect food poisoning?",
        answer: "Drink plenty of fluids to stay hydrated. Avoid solid food until symptoms improve. If severe vomiting, dehydration, or fever occurs, visit our clinic."
      }
    ]
  }
];
