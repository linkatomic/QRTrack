/*
  # Add Profile Auto-Creation Trigger

  1. Function
    - Creates a profile automatically when a new user signs up
    - Copies email from auth.users to profiles table

  2. Trigger
    - Fires after insert on auth.users
    - Ensures every user has a profile record
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
