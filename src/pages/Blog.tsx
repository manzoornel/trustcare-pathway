
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const { toast } = useToast();

  const articles = [
    {
      title: "How to Manage Diabetes with Diet & Exercise",
      excerpt: "Learn effective strategies for managing diabetes through lifestyle changes...",
      content: "Diabetes management requires a multi-faceted approach, with diet and exercise being key components. A balanced diet rich in fiber, lean proteins, and healthy fats helps regulate blood sugar levels. Complex carbohydrates should be favored over simple sugars. Regular physical activity improves insulin sensitivity and helps maintain a healthy weight. Aim for at least 150 minutes of moderate activity per week, spread across several days. Always consult with your healthcare provider before making significant changes to your routine, especially if you're on medication. Monitoring blood glucose regularly helps you understand how your body responds to different foods and activities, allowing for personalized adjustments to your management plan.",
      date: "March 15, 2024",
      category: "Diabetes Management"
    },
    {
      title: "The Best Foods for Heart Health",
      excerpt: "Discover the top heart-healthy foods that can help prevent cardiovascular disease...",
      content: "A heart-healthy diet is essential for preventing cardiovascular disease. Focus on consuming plenty of fruits, vegetables, whole grains, and legumes which provide fiber and important nutrients. Include fatty fish like salmon or mackerel twice a week for omega-3 fatty acids. Choose healthy fats such as olive oil, avocados, and nuts while limiting saturated and trans fats. Reduce sodium intake by avoiding processed foods and using herbs and spices instead of salt for flavoring. Berries, leafy greens, whole grains, beans, and dark chocolate (in moderation) are particularly beneficial for heart health. Remember that consistency matters more than perfection - making these foods regular parts of your diet will benefit your heart in the long run.",
      date: "March 12, 2024",
      category: "Heart Health"
    },
    {
      title: "How to Stay Fit After 40",
      excerpt: "Expert tips and strategies for maintaining fitness and health as you age...",
      content: "Staying fit after 40 requires adapting your approach to exercise and nutrition. Focus on strength training 2-3 times weekly to preserve muscle mass, which naturally declines with age. Include weight-bearing exercises to maintain bone density and prevent osteoporosis. Don't neglect flexibility and balance work through activities like yoga or tai chi to reduce injury risk. High-intensity interval training can be more time-efficient and effective than long cardio sessions. Recovery becomes increasingly important - ensure adequate sleep and allow more rest between intense workouts. Nutrition should emphasize protein intake to support muscle maintenance, along with plenty of fruits and vegetables for their anti-inflammatory properties. Stay consistent with your routine, but listen to your body and adjust as needed. Remember that maintaining fitness as you age is about quality of life, not just aesthetics.",
      date: "March 10, 2024",
      category: "Fitness"
    },
    {
      title: "10 Signs You Should See a Doctor",
      excerpt: "Important health symptoms you shouldn't ignore and when to seek medical help...",
      content: "Certain symptoms warrant prompt medical attention. Unexplained weight loss, persistent fever, severe headaches (especially if sudden or accompanied by neurological symptoms), shortness of breath, chest pain, abdominal pain, changes in bowel habits lasting more than a few days, unusual bleeding, severe joint pain, and persistent fatigue are all signs that shouldn't be ignored. While many symptoms can be caused by minor conditions, these particular signs could indicate serious underlying health issues. Early intervention often leads to better outcomes, so it's better to err on the side of caution. If you're experiencing multiple symptoms simultaneously or any symptom is severe or persistent, schedule an appointment with your doctor. For emergency symptoms like severe chest pain, difficulty breathing, or signs of stroke, seek immediate emergency care.",
      date: "March 8, 2024",
      category: "General Health"
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Here you would typically send the email to your backend
    // Simulating API call with timeout
    setTimeout(() => {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our newsletter at " + email,
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  const toggleArticle = (index: number) => {
    setExpandedArticle(expandedArticle === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Health Blog | Expert Medical Tips from Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Read expert health articles, fitness tips, and medical guides from the doctors at Doctor Uncle Family Clinic."
        />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 px-4 max-w-7xl mx-auto">
          <div className="py-12">
            <h1 className="text-4xl font-bold mb-8">Stay Healthy with Expert Advice!</h1>
            <p className="text-lg text-gray-600 mb-12">
              Our blog features trusted medical tips, fitness advice, and disease prevention 
              strategies to keep you and your family healthy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="text-sm text-primary font-semibold mb-2">{article.category}</div>
                    <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {expandedArticle === index ? article.content : article.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{article.date}</span>
                      <Button 
                        variant="ghost" 
                        className="text-primary hover:text-primary/80"
                        onClick={() => toggleArticle(index)}
                      >
                        {expandedArticle === index ? "Show Less" : "Read More →"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-secondary/10 p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold text-center mb-6">Subscribe to our newsletter</h2>
              <p className="text-center text-gray-600 mb-6">
                Get the latest health tips and medical advice directly to your inbox
              </p>
              
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="mb-4">
                  <Label htmlFor="email" className="mb-2 block">Email address</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe Now"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
