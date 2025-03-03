
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BlogPost } from "./types";

interface AddBlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (post: Omit<BlogPost, 'id'>) => void;
}

const AddBlogPostDialog = ({ open, onOpenChange, onAdd }: AddBlogPostDialogProps) => {
  const [newPost, setNewPost] = useState<Omit<BlogPost, 'id'>>({
    title: "",
    excerpt: "",
    date: new Date().toISOString().split('T')[0],
    category: ""
  });

  const handleSubmit = () => {
    onAdd(newPost);
    // Reset form
    setNewPost({
      title: "",
      excerpt: "",
      date: new Date().toISOString().split('T')[0],
      category: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlogPostDialog;
