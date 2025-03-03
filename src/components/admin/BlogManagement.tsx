
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

const BlogManagement = () => {
  // Mock data - in a real application, this would come from an API or database
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "How to Manage Diabetes with Diet & Exercise",
      excerpt: "Learn effective strategies for managing diabetes through lifestyle changes...",
      date: "March 15, 2024",
      category: "Diabetes Management"
    },
    {
      id: 2,
      title: "The Best Foods for Heart Health",
      excerpt: "Discover the top heart-healthy foods that can help prevent cardiovascular disease...",
      date: "March 12, 2024",
      category: "Heart Health"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState<Omit<BlogPost, 'id'>>({
    title: "",
    excerpt: "",
    date: new Date().toISOString().split('T')[0],
    category: ""
  });

  const handleAddPost = () => {
    const post = {
      id: blogPosts.length + 1,
      ...newPost
    };
    setBlogPosts([...blogPosts, post]);
    setIsAddDialogOpen(false);
    toast.success("Blog post added successfully");
    setNewPost({
      title: "",
      excerpt: "",
      date: new Date().toISOString().split('T')[0],
      category: ""
    });
  };

  const handleEditPost = () => {
    if (!currentPost) return;
    setBlogPosts(blogPosts.map(post => post.id === currentPost.id ? currentPost : post));
    setIsEditDialogOpen(false);
    toast.success("Blog post updated successfully");
  };

  const handleDeletePost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setBlogPosts(blogPosts.filter(post => post.id !== id));
      toast.success("Blog post deleted successfully");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Blog Posts</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add New Post</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {blogPosts.map(post => (
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
                    onClick={() => {
                      setCurrentPost(post);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Blog Post Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="Enter blog post title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category">Category</label>
              <Input
                id="category"
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                placeholder="Enter category"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="excerpt">Excerpt</label>
              <Input
                id="excerpt"
                value={newPost.excerpt}
                onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                placeholder="Enter a brief excerpt"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date">Publication Date</label>
              <Input
                id="date"
                type="date"
                value={newPost.date}
                onChange={(e) => setNewPost({...newPost, date: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPost}>Add Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Blog Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {currentPost && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-title">Title</label>
                <Input
                  id="edit-title"
                  value={currentPost.title}
                  onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-category">Category</label>
                <Input
                  id="edit-category"
                  value={currentPost.category}
                  onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-excerpt">Excerpt</label>
                <Input
                  id="edit-excerpt"
                  value={currentPost.excerpt}
                  onChange={(e) => setCurrentPost({...currentPost, excerpt: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-date">Publication Date</label>
                <Input
                  id="edit-date"
                  type="date"
                  value={currentPost.date}
                  onChange={(e) => setCurrentPost({...currentPost, date: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditPost}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
