
-- Enable RLS on all tables that don't have it yet
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Tasks table policies
CREATE POLICY "Users can view their own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Cases table policies
CREATE POLICY "Users can view their own cases" ON public.cases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cases" ON public.cases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cases" ON public.cases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cases" ON public.cases
  FOR DELETE USING (auth.uid() = user_id);

-- Clients table policies
CREATE POLICY "Users can view their own clients" ON public.clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clients" ON public.clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" ON public.clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" ON public.clients
  FOR DELETE USING (auth.uid() = user_id);

-- Earnings table policies
CREATE POLICY "Users can view their own earnings" ON public.earnings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own earnings" ON public.earnings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own earnings" ON public.earnings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own earnings" ON public.earnings
  FOR DELETE USING (auth.uid() = user_id);

-- Referrals table policies
CREATE POLICY "Users can view referrals they made" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can view referrals they received" ON public.referrals
  FOR SELECT USING (auth.uid() = referred_id);

CREATE POLICY "Users can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Bonus offers - read-only for all authenticated users
CREATE POLICY "Authenticated users can view bonus offers" ON public.bonus_offers
  FOR SELECT TO authenticated USING (true);

-- Gifts - read-only for all authenticated users
CREATE POLICY "Authenticated users can view gifts" ON public.gifts
  FOR SELECT TO authenticated USING (true);

-- Add input validation functions
CREATE OR REPLACE FUNCTION public.validate_email(email text)
RETURNS boolean AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.sanitize_text(input_text text)
RETURNS text AS $$
BEGIN
  -- Remove potential XSS characters and normalize
  RETURN trim(regexp_replace(input_text, '[<>"\''&]', '', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update the user creation trigger to include validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Validate email format
  IF NOT public.validate_email(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  INSERT INTO public.users (id, email, full_name, referral_code, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(public.sanitize_text(NEW.raw_user_meta_data->>'full_name'), 'User'),
    public.generate_referral_code(),
    public.sanitize_text(NEW.raw_user_meta_data->>'referred_by')
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$function$;
