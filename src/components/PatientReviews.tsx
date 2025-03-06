
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Star } from 'lucide-react';

const PatientReviews = () => {
  const { auth } = useAuth();
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState("5");
  const [name, setName] = useState(auth.isAuthenticated ? auth.name || "" : "");
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call for submission
    setTimeout(() => {
      toast.success("Thank you for your review!");
      setIsSubmitting(false);
      setIsWritingReview(false);
      setRating("5");
      setReviewText("");
      // In a real implementation, we'd save this to a database
    }, 1000);
  };

  const sampleReviews = [
    {
      id: 1,
      name: "Aisha Khan",
      rating: 5,
      date: "2 weeks ago",
      text: "Dr. Manzoor is exceptional! He took the time to understand my concerns and explained my treatment options clearly. The clinic is clean and modern, and the staff is very friendly."
    },
    {
      id: 2,
      name: "Rahul Sharma",
      rating: 5,
      date: "1 month ago",
      text: "Had an emergency with my son, and we received prompt attention at Doctor Uncle. The pediatrician was excellent with children, making my son feel at ease during the examination."
    },
    {
      id: 3,
      name: "Priya Patel",
      rating: 4,
      date: "2 months ago",
      text: "Great family clinic! The appointment system is efficient, and I rarely have to wait. The doctors are knowledgeable and caring. Only suggestion would be to extend weekend hours."
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Patient Testimonials</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Read what our patients have to say about their experience at Doctor Uncle Family Clinic
          </p>
        </div>

        {!isWritingReview ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleReviews.map((review) => (
              <Card key={review.id} className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.date}</CardDescription>
                    </div>
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{review.text}</p>
                </CardContent>
              </Card>
            ))}
            
            {/* Write Review Card */}
            <Card className="h-full flex flex-col justify-center items-center p-8 border-dashed border-2 bg-white/50 hover:bg-white transition-colors duration-200">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Share Your Experience</h3>
                <p className="text-gray-600 mb-6">
                  We value your feedback. Let us know about your visit to Doctor Uncle Family Clinic.
                </p>
                <Button onClick={() => setIsWritingReview(true)} className="w-full">
                  Write a Review
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Write Your Review</CardTitle>
              <CardDescription>
                Share your experience at Doctor Uncle Family Clinic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Your Rating</Label>
                  <RadioGroup 
                    value={rating} 
                    onValueChange={setRating}
                    className="flex space-x-2"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <div key={value} className="flex items-center space-x-1">
                        <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                        <Label htmlFor={`rating-${value}`} className="flex">
                          {Array(value).fill(0).map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea 
                    id="review" 
                    value={reviewText} 
                    onChange={(e) => setReviewText(e.target.value)} 
                    required 
                    placeholder="Share details of your experience at our clinic"
                    rows={5}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsWritingReview(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </section>
  );
};

export default PatientReviews;
