
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BlogPostCard from "./blog/BlogPostCard";
import AddBlogPostDialog from "./blog/AddBlogPostDialog";
import EditBlogPostDialog from "./blog/EditBlogPostDialog";
import { BlogPost } from "./blog/types";
import { mockBlogPosts } from "./blog/mockData";
import BlogPostList from "./blog/BlogPostList";

const BlogManagement = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);

  const handleAddPost = (newPost: Omit<BlogPost, 'id'>) => {
    const post = {
      id: blogPosts.length + 1,
      ...newPost
    };
    setBlogPosts([...blogPosts, post]);
    setIsAddDialogOpen(false);
    toast.success("Blog post added successfully");
  };

  const handleEditPost = (updatedPost: BlogPost) => {
    setBlogPosts(blogPosts.map(post => post.id === updatedPost.id ? updatedPost : post));
    setIsEditDialogOpen(false);
    toast.success("Blog post updated successfully");
  };

  const handleDeletePost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setBlogPosts(blogPosts.filter(post => post.id !== id));
      toast.success("Blog post deleted successfully");
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Blog Posts</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add New Post</Button>
      </div>

      <BlogPostList 
        blogPosts={blogPosts} 
        onEdit={openEditDialog} 
        onDelete={handleDeletePost} 
      />

      <AddBlogPostDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddPost}
      />

      <EditBlogPostDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        post={currentPost}
        onSave={handleEditPost}
        setCurrentPost={setCurrentPost}
      />
    </div>
  );
};

export default BlogManagement;
