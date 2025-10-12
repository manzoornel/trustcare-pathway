import React, { useState, useEffect } from "react";
import { supabase } from "../firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Upload, FileText, User, Mail, Phone, Briefcase } from "lucide-react";

interface UploadFormProps {
  availablePositions?: Array<{ id: string; title: string }>;
  selectedPosition?: string;
}

export default function UploadForm({
  availablePositions = [],
  selectedPosition = "",
}: UploadFormProps) {
  const [form, setForm] = useState({
    full_name: "",
    position: selectedPosition || "",
    phone: "",
    email: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Keep form position synced with prop
  useEffect(() => {
    setForm((prev) => ({ ...prev, position: selectedPosition }));
  }, [selectedPosition]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return setFile(null);

    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const ext = "." + selectedFile.name.split(".").pop()?.toLowerCase();

    if (selectedFile.size > maxSize) {
      toast.error("❌ File too large! Please select a file under 10MB.");
      setFile(null);
      return;
    }

    if (!allowedTypes.includes(ext)) {
      toast.error("❌ Invalid file type. Only PDF, DOC, or DOCX are allowed.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    toast.success(
      `✅ Selected: ${selectedFile.name} (${(
        selectedFile.size /
        1024 /
        1024
      ).toFixed(1)} MB)`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!form.full_name.trim()) return toast.error("⚠️ Full name is required.");
    if (!form.position.trim()) return toast.error("⚠️ Position is required.");
    if (!form.phone.trim()) return toast.error("⚠️ Phone number is required.");
    if (!form.email.trim()) return toast.error("⚠️ Email is required.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email))
      return toast.error("⚠️ Enter a valid email address.");
    if (!file) return toast.error("⚠️ Please upload your resume/CV.");

    try {
      setUploading(true);
      toast.info("📤 Uploading your application... Please wait.");

      // Sanitize file name
      const sanitizeFileName = (name: string) =>
        name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const safeFileName = sanitizeFileName(file.name);

      // 1️⃣ Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("upload")
        .upload(`job-applications/${Date.now()}_${safeFileName}`, file);

      if (error) throw error;

      // 2️⃣ Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("upload")
        .getPublicUrl(data.path);
      const fileUrl = publicUrlData.publicUrl;

      // 3️⃣ Insert data into Supabase table
      const { error: insertError } = await supabase.from("jobs").insert([
        {
          full_name: form.full_name,
          position: form.position,
          phone: form.phone,
          email: form.email,
          file_url: fileUrl,
        },
      ]);

      if (insertError) throw insertError;

      toast.success(
        `🎉 Application submitted successfully for ${form.position}!`
      );

      // Reset form
      setForm({
        full_name: "",
        position: selectedPosition || "",
        phone: "",
        email: "",
      });
      setFile(null);
    } catch (err: any) {
      console.error(err);
      toast.error(
        `❌ Submission failed: ${err.message || "Please try again later."}`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Briefcase className="h-5 w-5" />
          Job Application Form
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="full_name"
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Enter your full name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="position"
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <Briefcase className="h-4 w-4" />
                Position
              </Label>
              <Input
                id="position"
                name="position"
                value={form.position}
                readOnly
                placeholder="No position selected"
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="resume"
              className="flex items-center gap-2 text-sm sm:text-base"
            >
              <Upload className="h-4 w-4" />
              Resume/CV
            </Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Accepted formats: PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>

          <Button
            type="submit"
            disabled={uploading}
            className="w-full h-11 sm:h-12 text-sm sm:text-base"
          >
            {uploading ? "Submitting Application..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
