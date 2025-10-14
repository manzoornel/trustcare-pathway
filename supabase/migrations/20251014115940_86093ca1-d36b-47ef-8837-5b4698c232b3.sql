-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'hr', 'manager', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- DROP the insecure ehr_integration policy
DROP POLICY IF EXISTS "Administrators can manage EHR integration" ON public.ehr_integration;

-- Create secure ehr_integration policies (admin only)
CREATE POLICY "Only admins can view EHR integration"
  ON public.ehr_integration
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert EHR integration"
  ON public.ehr_integration
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update EHR integration"
  ON public.ehr_integration
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete EHR integration"
  ON public.ehr_integration
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Add proper SELECT policy to jobs table (admin and hr only)
CREATE POLICY "Admins and HR can view job applications"
  ON public.jobs
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr')
  );

-- Add UPDATE policy for application status management
CREATE POLICY "Admins and HR can update job applications"
  ON public.jobs
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr')
  );

-- Add DELETE policy for GDPR compliance
CREATE POLICY "Only admins can delete job applications"
  ON public.jobs
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Add SELECT policy to ehr_sync_history for admins
CREATE POLICY "Admins can view EHR sync history"
  ON public.ehr_sync_history
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add INSERT policy for patient_profiles (users can create their own)
CREATE POLICY "Users can create their own profile"
  ON public.patient_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create admin_profiles table for admin-specific data
CREATE TABLE public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their own admin profile"
  ON public.admin_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can update their own admin profile"
  ON public.admin_profiles
  FOR UPDATE
  USING (auth.uid() = id);