
import React from "react";
import { BlogPost } from "./types";
import BlogPostCard from "./BlogPostCard";

interface BlogPostListProps {
  blogPosts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (id: number) => void;
}

const BlogPostList = ({ blogPosts, onEdit, onDelete }: BlogPostListProps) => {
  if (blogPosts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No blog posts available. Click "Add New Post" to create one.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {blogPosts.map(post => (
        <BlogPostCard 
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BlogPostList;
