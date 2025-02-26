
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";

const Blog = () => {
  const articles = [
    {
      title: "How to Manage Diabetes with Diet & Exercise",
      excerpt: "Learn effective strategies for managing diabetes through lifestyle changes...",
      date: "March 15, 2024",
      category: "Diabetes Management"
    },
    {
      title: "The Best Foods for Heart Health",
      excerpt: "Discover the top heart-healthy foods that can help prevent cardiovascular disease...",
      date: "March 12, 2024",
      category: "Heart Health"
    },
    {
      title: "How to Stay Fit After 40",
      excerpt: "Expert tips and strategies for maintaining fitness and health as you age...",
      date: "March 10, 2024",
      category: "Fitness"
    },
    {
      title: "10 Signs You Should See a Doctor",
      excerpt: "Important health symptoms you shouldn't ignore and when to seek medical help...",
      date: "March 8, 2024",
      category: "General Health"
    }
  ];

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
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{article.date}</span>
                      <button className="text-primary hover:text-primary/80">Read More →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200">
                Subscribe to our newsletter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
