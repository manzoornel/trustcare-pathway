
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Anoop Menon",
      image: "/placeholder.svg",
      text: "Doctor Uncle has been caring for our family for the past 5 years. Their dedication and expertise have made all the difference in my diabetes management.",
      rating: 5
    },
    {
      name: "Priya Lakshmi",
      image: "/placeholder.svg",
      text: "I appreciate the personal attention and care I receive at every visit. The clinic staff is friendly and the doctors take time to listen to my concerns, even when I bring my elderly parents.",
      rating: 5
    },
    {
      name: "Mohammed Rashid",
      image: "/placeholder.svg",
      text: "The clinic's online booking system makes it so easy to schedule appointments, and I never have to wait long to see the doctor. Their home care service was a blessing when my father was unwell.",
      rating: 4
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Patients Say</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We're proud to have earned the trust of our community with our dedication to quality healthcare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i + testimonial.rating} className="w-5 h-5 text-gray-300" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div className="font-semibold">{testimonial.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
