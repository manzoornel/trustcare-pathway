
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Eye } from "lucide-react";
import { BlogPost } from "./types";
import { useState } from "react";

interface BlogPostCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: number) => void;
}

const BlogPostCard = ({ post, onEdit, onDelete }: BlogPostCardProps) => {
  const [showContent, setShowContent] = useState(false);
  
  const toggleContent = () => {
    setShowContent(!showContent);
  };
  
  return (
    <Card key={post.id} className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div className="w-full">
            <h3 className="text-lg font-bold mb-2">{post.title}</h3>
            <div className="flex space-x-4 text-sm text-gray-500 mb-2">
              <span>{post.date}</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">{post.category}</span>
            </div>
            <p className="text-gray-600">{post.excerpt}</p>
            
            {showContent && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold mb-2">Content Preview:</h4>
                <div className="bg-gray-50 p-3 rounded text-gray-700 max-h-[200px] overflow-y-auto">
                  {post.content || "No content available"}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleContent}
              title={showContent ? "Hide content" : "Show content preview"}
            >
              <Eye className={`h-5 w-5 ${showContent ? 'text-primary' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(post)}
              title="Edit post"
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(post.id)}
              title="Delete post"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
