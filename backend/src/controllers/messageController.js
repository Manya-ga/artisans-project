const supabase = require('../config/supabase');

// ── HELPERS ────────────────────────────────────────────────────────────────────

/**
 * Returns the canonical conversation between two users, creating it if needed.
 * Enforces user_a < user_b ordering to match the DB UNIQUE constraint.
 */
async function getOrCreateConversation(userA, userB) {
  // Canonical ordering
  const [a, b] = [userA, userB].sort();

  // Try to find existing conversation
  const { data: existing, error: findErr } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_a', a)
    .eq('user_b', b)
    .maybeSingle();

  if (findErr) throw findErr;
  if (existing) return existing.id;

  // Create new conversation
  const { data: created, error: createErr } = await supabase
    .from('conversations')
    .insert({ user_a: a, user_b: b })
    .select('id')
    .single();

  if (createErr) throw createErr;
  return created.id;
}

// ── CREATE CONVERSATION ────────────────────────────────────────────────────────
exports.createConversation = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const currentUserId = req.user.id;

    if (!otherUserId) {
      return res.status(400).json({ error: 'otherUserId is required.' });
    }
    if (otherUserId === currentUserId) {
      return res.status(400).json({ error: 'Cannot create a conversation with yourself.' });
    }

    const conversationId = await getOrCreateConversation(currentUserId, otherUserId);
    return res.status(201).json({ conversationId });
  } catch (err) {
    console.error('[createConversation] Error:', err);
    return res.status(500).json({ error: 'Failed to create conversation.' });
  }
};

// ── GET CONVERSATIONS ──────────────────────────────────────────────────────────
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch all conversations for the current user
    const { data: convRows, error: convErr } = await supabase
      .from('conversations')
      .select('id, user_a, user_b, updated_at')
      .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`)
      .order('updated_at', { ascending: false });

    if (convErr) throw convErr;

    if (!convRows || convRows.length === 0) {
      // Return artisan suggestions even if no conversations yet
      const { data: artisans } = await supabase
        .from('profiles')
        .select('id, display_name, photo_url, email')
        .eq('role', 'artisan')
        .neq('id', currentUserId)
        .limit(10);

      const suggestions = (artisans || []).map(a => ({
        user: {
          _id: a.id, id: a.id,
          displayName: a.display_name,
          photoURL: a.photo_url,
          email: a.email
        },
        lastMessage: null,
        unreadCount: 0,
        conversationId: null
      }));
      return res.json(suggestions);
    }

    // Gather partner IDs and conversation IDs
    const convIds = convRows.map(c => c.id);
    const partnerIds = convRows.map(c =>
      c.user_a === currentUserId ? c.user_b : c.user_a
    );

    // Fetch last message per conversation
    let lastMessages = {};
    if (convIds.length > 0) {
      // For each conversation, get the most recent message
      // We do a simple approach: fetch all messages for these convs ordered desc
      const { data: msgs } = await supabase
        .from('messages')
        .select('id, conversation_id, sender_id, receiver_id, content, seen, created_at')
        .in('conversation_id', convIds)
        .order('created_at', { ascending: false });

      if (msgs) {
        msgs.forEach(m => {
          if (!lastMessages[m.conversation_id]) {
            lastMessages[m.conversation_id] = m;
          }
        });
      }
    }

    // Fetch partner profiles
    const { data: profiles, error: profileErr } = await supabase
      .from('profiles')
      .select('id, display_name, photo_url, email')
      .in('id', partnerIds);

    if (profileErr) throw profileErr;

    const profileMap = {};
    (profiles || []).forEach(p => { profileMap[p.id] = p; });

    const conversations = convRows.map(conv => {
      const partnerId = conv.user_a === currentUserId ? conv.user_b : conv.user_a;
      const profile = profileMap[partnerId];
      const lastMsg = lastMessages[conv.id];
      return {
        conversationId: conv.id,
        user: profile ? {
          _id: profile.id, id: profile.id,
          displayName: profile.display_name,
          photoURL: profile.photo_url,
          email: profile.email
        } : { _id: partnerId, id: partnerId, displayName: 'Unknown User' },
        lastMessage: lastMsg ? {
          _id: lastMsg.id,
          senderId: lastMsg.sender_id,
          receiverId: lastMsg.receiver_id,
          text: lastMsg.content,
          content: lastMsg.content,
          seen: lastMsg.seen,
          createdAt: lastMsg.created_at
        } : null,
        unreadCount: 0
      };
    });

    // Append artisan suggestions not already in conversations
    const { data: artisans } = await supabase
      .from('profiles')
      .select('id, display_name, photo_url, email')
      .eq('role', 'artisan')
      .neq('id', currentUserId)
      .limit(10);

    const combined = [...conversations];
    (artisans || []).forEach(artisan => {
      if (!combined.find(c => c.user.id === artisan.id)) {
        combined.push({
          conversationId: null,
          user: {
            _id: artisan.id, id: artisan.id,
            displayName: artisan.display_name,
            photoURL: artisan.photo_url,
            email: artisan.email
          },
          lastMessage: null,
          unreadCount: 0
        });
      }
    });

    return res.json(combined);
  } catch (err) {
    console.error('[getConversations] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch conversations.' });
  }
};

// ── GET MESSAGES ───────────────────────────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (!userId) return res.status(400).json({ error: 'userId param is required.' });

    // Find conversation between the two users (may not exist yet)
    const [a, b] = [currentUserId, userId].sort();
    const { data: conv } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_a', a)
      .eq('user_b', b)
      .maybeSingle();

    if (!conv) {
      // No conversation yet — return empty array
      return res.json([]);
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const mapped = (messages || []).map(m => ({
      _id: m.id,
      id: m.id,
      conversationId: m.conversation_id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      text: m.content,
      content: m.content,
      role: m.role,
      seen: m.seen,
      createdAt: m.created_at
    }));

    return res.json(mapped);
  } catch (err) {
    console.error('[getMessages] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

// ── SEND MESSAGE ───────────────────────────────────────────────────────────────
exports.sendMessage = async (req, res) => {
  console.log('[sendMessage] Body:', req.body);
  try {
    const { receiverId, text, message, content } = req.body;
    const senderId = req.user.id;
    const msgContent = (content || text || message || '').trim();

    if (!receiverId || !msgContent) {
      return res.status(400).json({ error: 'receiverId and message content are required.' });
    }
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ error: 'Cannot send a message to yourself.' });
    }

    // Validate receiver exists
    const { data: receiver, error: receiverErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', receiverId)
      .maybeSingle();

    if (receiverErr || !receiver) {
      console.error('[sendMessage] Receiver not found:', receiverErr);
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    // Get or create conversation
    const conversationId = await getOrCreateConversation(senderId, receiverId);

    // Insert message
    const { data: inserted, error: insertErr } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: senderId,
        sender_id: senderId,
        receiver_id: receiverId,
        role: 'user',
        content: msgContent,
        seen: false
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    const response = {
      _id: inserted.id,
      id: inserted.id,
      conversationId: inserted.conversation_id,
      senderId: inserted.sender_id,
      receiverId: inserted.receiver_id,
      text: inserted.content,
      content: inserted.content,
      role: inserted.role,
      seen: inserted.seen,
      createdAt: inserted.created_at
    };

    return res.status(201).json(response);
  } catch (err) {
    console.error('[sendMessage] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to send message.' });
  }
};

// ── DELETE CONVERSATION ────────────────────────────────────────────────────────
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user.id;

    if (!conversationId) {
      return res.status(400).json({ error: 'conversationId param is required.' });
    }

    // Verify the current user is a participant
    const { data: conv, error: findErr } = await supabase
      .from('conversations')
      .select('id, user_a, user_b')
      .eq('id', conversationId)
      .maybeSingle();

    if (findErr) throw findErr;
    if (!conv) return res.status(404).json({ error: 'Conversation not found.' });

    if (conv.user_a !== currentUserId && conv.user_b !== currentUserId) {
      return res.status(403).json({ error: 'Not authorized to delete this conversation.' });
    }

    // Delete conversation (messages cascade via FK)
    const { error: deleteErr } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (deleteErr) throw deleteErr;

    return res.json({ message: 'Conversation deleted.' });
  } catch (err) {
    console.error('[deleteConversation] Error:', err);
    return res.status(500).json({ error: 'Failed to delete conversation.' });
  }
};
