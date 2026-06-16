-- ============================================================
-- Artisan Connect — Persistent Messaging Schema
-- Run this entire file in your Supabase project SQL Editor
-- ============================================================

-- ── 1. CONVERSATIONS TABLE ────────────────────────────────────
-- One row per unique pair of users (user_a < user_b for canonical dedup)
CREATE TABLE IF NOT EXISTS public.conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT conversations_ordered    CHECK (user_a < user_b),
  CONSTRAINT conversations_unique_pair UNIQUE (user_a, user_b)
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_a ON public.conversations(user_a);
CREATE INDEX IF NOT EXISTS idx_conversations_user_b ON public.conversations(user_b);

-- ── 2. MESSAGES TABLE ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'assistant')),
  content         TEXT NOT NULL,
  seen            BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id       ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id     ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at      ON public.messages(created_at);

-- ── 3. AUTO-UPDATE conversations.updated_at ON NEW MESSAGE ────
CREATE OR REPLACE FUNCTION public.touch_conversation()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_conversation ON public.messages;
CREATE TRIGGER trg_touch_conversation
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.touch_conversation();

-- ── 4. ROW LEVEL SECURITY ─────────────────────────────────────
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages      ENABLE ROW LEVEL SECURITY;

-- Conversations: visible only to the two participants
DROP POLICY IF EXISTS "conv_select" ON public.conversations;
CREATE POLICY "conv_select" ON public.conversations
  FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);

DROP POLICY IF EXISTS "conv_insert" ON public.conversations;
CREATE POLICY "conv_insert" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

DROP POLICY IF EXISTS "conv_delete" ON public.conversations;
CREATE POLICY "conv_delete" ON public.conversations
  FOR DELETE USING (auth.uid() = user_a OR auth.uid() = user_b);

-- Messages: visible only if you are sender or receiver
DROP POLICY IF EXISTS "msg_select" ON public.messages;
CREATE POLICY "msg_select" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "msg_insert" ON public.messages;
CREATE POLICY "msg_insert" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id AND auth.uid() = user_id);

DROP POLICY IF EXISTS "msg_delete" ON public.messages;
CREATE POLICY "msg_delete" ON public.messages
  FOR DELETE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ── 5. GRANT PERMISSIONS TO AUTHENTICATED ROLE ────────────────
GRANT SELECT, INSERT, DELETE ON public.conversations TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.messages      TO authenticated;

-- ── DONE ──────────────────────────────────────────────────────
-- After running this:
-- 1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env
-- 2. The backend will auto-switch from the local mock to real Supabase
