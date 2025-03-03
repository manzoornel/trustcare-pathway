
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BlogPost } from "./types";

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
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Blog Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-title">Title</label>
            <Input
              id="edit-title"
              value={post.title}
              onChange={(e) => setCurrentPost({...post, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-category">Category</label>
            <Input
              id="edit-category"
              value={post.category}
              onChange={(e) => setCurrentPost({...post, category: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-excerpt">Excerpt</label>
            <Input
              id="edit-excerpt"
              value={post.excerpt}
              onChange={(e) => setCurrentPost({...post, excerpt: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-date">Publication Date</label>
            <Input
              id="edit-date"
              type="date"
              value={post.date}
              onChange={(e) => setCurrentPost({...post, date: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave(post)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlogPostDialog;
