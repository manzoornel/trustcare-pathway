
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BlogPost } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface EditBlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
  onSave: (post: BlogPost) => void;
  setCurrentPost: (post: BlogPost | null) => void;
}

const EditBlogPostDialog = ({ 
  open, 
  onOpenChange, 
  post, 
  onSave,
  setCurrentPost 
}: EditBlogPostDialogProps) => {
  const [activeTab, setActiveTab] = useState<string>("details");
  
  useEffect(() => {
    // Reset tab on dialog open/close
    if (open) {
      setActiveTab("details");
    }
  }, [open]);
  
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Blog Post</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Basic Details</TabsTrigger>
            <TabsTrigger value="content">Content Editor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={post.title}
                onChange={(e) => setCurrentPost({...post, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={post.category}
                onChange={(e) => setCurrentPost({...post, category: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-excerpt">Excerpt</Label>
              <Textarea
                id="edit-excerpt"
                value={post.excerpt}
                onChange={(e) => setCurrentPost({...post, excerpt: e.target.value})}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Publication Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={post.date}
                onChange={(e) => setCurrentPost({...post, date: e.target.value})}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-content">Blog Content</Label>
              <Textarea
                id="edit-content"
                value={post.content || ""}
                onChange={(e) => setCurrentPost({...post, content: e.target.value})}
                placeholder="Write your blog post content here..."
                className="min-h-[300px]"
                rows={12}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {activeTab === "details" ? "Edit the basic information" : "Edit your content in the editor"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={() => onSave(post)}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlogPostDialog;
