const supabase = require('../config/supabase');

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const mappedMessages = messages.map(m => ({
      _id: m.id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      text: m.text,
      seen: m.seen,
      createdAt: m.created_at
    }));

    res.json(mappedMessages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch all messages where user is involved
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const partners = new Map();
    messages.forEach((msg) => {
      const partnerId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
      if (!partners.has(partnerId)) {
        partners.set(partnerId, {
          _id: msg.id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          text: msg.text,
          seen: msg.seen,
          createdAt: msg.created_at
        });
      }
    });

    const conversationIds = Array.from(partners.keys());
    
    // Fetch profiles for all partners
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, photo_url, email')
      .in('id', conversationIds);

    if (profileError) throw profileError;

    const conversations = profiles.map((profile) => ({
      user: {
        _id: profile.id,
        id: profile.id,
        displayName: profile.display_name,
        photoURL: profile.photo_url,
        email: profile.email
      },
      lastMessage: partners.get(profile.id),
      unreadCount: 0
    }));

    // Fetch artisans for suggestions
    const { data: artisans, error: artisanError } = await supabase
      .from('profiles')
      .select('id, display_name, photo_url, email')
      .eq('role', 'artisan')
      .neq('id', currentUserId)
      .limit(10);

    if (artisanError) throw artisanError;

    const combined = [...conversations];
    artisans.forEach(artisan => {
      if (!combined.find(c => c.user.id === artisan.id)) {
        combined.push({
          user: {
            _id: artisan.id,
            id: artisan.id,
            displayName: artisan.display_name,
            photoURL: artisan.photo_url,
            email: artisan.email
          },
          lastMessage: null,
          unreadCount: 0
        });
      }
    });

    res.json(combined);
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};
exports.sendMessage = async (req, res) => {
  console.log('[Backend] Message request body:', req.body);
  try {
    const { receiverId, text, message } = req.body;
    const senderId = req.user.id;
    const content = (text || message || '').trim();

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver ID and message content are required.' });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ error: 'Cannot send message to yourself.' });
    }

    // Validate receiver exists
    const { data: receiver, error: receiverError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', receiverId)
      .maybeSingle();

    if (receiverError || !receiver) {
      console.error('[Backend] Receiver validation failed:', receiverError);
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    const { data: insertedMessage, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId.toString(),
        receiver_id: receiverId.toString(),
        text: content,
        seen: false
      })
      .select()
      .single();

    if (error) throw error;

    const mappedMessage = {
      _id: insertedMessage.id,
      id: insertedMessage.id,
      senderId: insertedMessage.sender_id,
      receiverId: insertedMessage.receiver_id,
      text: insertedMessage.text,
      seen: insertedMessage.seen,
      createdAt: insertedMessage.created_at
    };

    res.status(201).json(mappedMessage);
  } catch (error) {
    console.error('[Backend] Message send error:', error);
    res.status(500).json({ error: error.message || 'Failed to send message' });
  }
};
