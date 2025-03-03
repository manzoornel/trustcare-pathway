
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { BlogPost } from "./types";

interface BlogPostCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: number) => void;
}

const BlogPostCard = ({ post, onEdit, onDelete }: BlogPostCardProps) => {
  return (
    <Card key={post.id} className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">{post.title}</h3>
            <div className="flex space-x-4 text-sm text-gray-500 mb-2">
              <span>{post.date}</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">{post.category}</span>
            </div>
            <p className="text-gray-600">{post.excerpt}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(post)}
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(post.id)}
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
