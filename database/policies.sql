CREATE policy "Allow read to all"
ON public."pasteles"
FOR select
USING (True);