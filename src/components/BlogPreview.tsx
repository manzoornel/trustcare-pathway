
import { Link } from 'react-router-dom';

const BlogPreview = () => {
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
      title: "10 Signs You Should See a Doctor",
      excerpt: "Important health symptoms you shouldn't ignore and when to seek medical help...",
      date: "March 8, 2024",
      category: "General Health"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Latest Health Tips</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed with our latest health tips and medical advice from our experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="text-sm text-primary font-semibold mb-2">{article.category}</div>
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{article.date}</span>
                  <Link to="/blog" className="text-primary hover:text-primary/80">Read More →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link 
            to="/blog" 
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
