
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BlogPost } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

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
    category: "",
    content: ""
  });

  const [activeTab, setActiveTab] = useState<string>("details");

  const handleSubmit = () => {
    onAdd(newPost);
    // Reset form
    setNewPost({
      title: "",
      excerpt: "",
      date: new Date().toISOString().split('T')[0],
      category: "",
      content: ""
    });
    setActiveTab("details");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Blog Post</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Basic Details</TabsTrigger>
            <TabsTrigger value="content">Content Editor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="Enter blog post title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                placeholder="Enter category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={newPost.excerpt}
                onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                placeholder="Enter a brief excerpt"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Publication Date</Label>
              <Input
                id="date"
                type="date"
                value={newPost.date}
                onChange={(e) => setNewPost({...newPost, date: e.target.value})}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Blog Content</Label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Write your blog post content here..."
                className="min-h-[300px]"
                rows={12}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {activeTab === "details" ? "Fill in the basic information first" : "Write your content in the editor"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Post</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlogPostDialog;
