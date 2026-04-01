import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  folder: string;
  files: string[];
  onChange: (files: string[]) => void;
  maxFiles?: number;
}

const FileUpload = ({ folder, files, onChange, maxFiles = 5 }: FileUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Generate signed URLs for display
  useEffect(() => {
    const generateUrls = async () => {
      const newUrls: Record<string, string> = {};
      for (const path of files) {
        if (!signedUrls[path]) {
          const { data } = await supabase.storage.from("sourcing-attachments").createSignedUrl(path, 3600);
          if (data?.signedUrl) newUrls[path] = data.signedUrl;
        }
      }
      if (Object.keys(newUrls).length > 0) {
        setSignedUrls((prev) => ({ ...prev, ...newUrls }));
      }
    };
    if (files.length > 0) generateUrls();
  }, [files]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected?.length) return;

    if (files.length + selected.length > maxFiles) {
      toast({ title: "Too many files", description: `Maximum ${maxFiles} files allowed.`, variant: "destructive" });
      return;
    }

    setUploading(true);
    const newPaths: string[] = [];

    for (const file of Array.from(selected)) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} exceeds 10MB limit.`, variant: "destructive" });
        continue;
      }

      const ext = file.name.split(".").pop();
      const path = `${user?.id}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from("sourcing-attachments").upload(path, file);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      } else {
        newPaths.push(path);
      }
    }

    onChange([...files, ...newPaths]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (path: string) => {
    onChange(files.filter((f) => f !== path));
  };

  const getFileUrl = (path: string) => signedUrls[path] || "#";

  const getFileName = (path: string) => {
    const parts = path.split("/");
    const name = parts[parts.length - 1];
    return name.replace(/^\d+-[a-z0-9]+\./, "file.");
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
        onChange={upload}
        className="hidden"
      />

      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((path) => (
            <div key={path} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/50">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <a href={getFileUrl(path)} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate flex-1">
                {getFileName(path)}
              </a>
              <button onClick={() => remove(path)} className="text-muted-foreground hover:text-destructive">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length < maxFiles && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Upload className="h-3.5 w-3.5 mr-1.5" />}
          {uploading ? "Uploading..." : "Attach Files"}
        </Button>
      )}
      <p className="text-[10px] text-muted-foreground">PDF, images, docs, max 10MB each, up to {maxFiles} files</p>
    </div>
  );
};

export default FileUpload;
