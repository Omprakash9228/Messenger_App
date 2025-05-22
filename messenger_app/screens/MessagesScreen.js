import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessagesScreen = ({ route }) => {
  const { name } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const addMessage = () => {
    if (newMessage.trim() === '' || newMessage.length > 150) return;

    const now = new Date();

    const newMsg = {
      id: Date.now().toString(),
      text: newMessage,
      time: now.toLocaleTimeString(),
      starred: false,
      sender: 'You',
      receiver: name,
      status: 'Delivered',
      readTime: null,
    };

    if (editingId) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingId ? { ...msg, text: newMessage } : msg
        )
      );
      setEditingId(null);
    } else {
      setMessages((prev) => [...prev, newMsg]);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMsg.id
              ? {
                  ...msg,
                  status: 'Read',
                  readTime: new Date().toLocaleTimeString(),
                }
              : msg
          )
        );
      }, 3000);
    }

    setNewMessage('');
    setShowEmoji(false);
  };

  const deleteMessage = (id) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  const editMessage = (msg) => {
    setNewMessage(msg.text);
    setEditingId(msg.id);
  };

  const toggleStar = (id) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, starred: !msg.starred } : msg
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📨 {name} Messages</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={[styles.bubbleRow, styles.rightAlign]}>
            <Text style={styles.avatar}>🧑</Text>
            <View style={[styles.bubble, styles.senderBubble]}>
              <Text style={styles.bubbleText}>
                {item.starred ? '⭐ ' : ''}
                {item.text}
              </Text>
              <Text style={styles.timestamp}>
                {item.sender} → {item.receiver}
                {'\n'}
                {item.status}
                {item.readTime ? ` at ${item.readTime}` : ''} | {item.time}
              </Text>
              <View style={styles.bubbleIcons}>
                <Pressable onPress={() => toggleStar(item.id)}>
                  <Ionicons
                    name={item.starred ? 'star' : 'star-outline'}
                    size={16}
                    color="#f4c430"
                  />
                </Pressable>
                <Pressable onPress={() => editMessage(item)} style={{ marginLeft: 10 }}>
                  <Ionicons name="pencil" size={16} color="#4caf50" />
                </Pressable>
                <Pressable onPress={() => deleteMessage(item.id)} style={{ marginLeft: 10 }}>
                  <Ionicons name="trash-outline" size={16} color="#c00" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      <Text style={styles.counter}>{newMessage.length}/150</Text>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Type a message... 💬"
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Pressable onPress={() => setShowEmoji(!showEmoji)} style={styles.emojiToggle}>
          <Text style={{ fontSize: 22 }}>😊</Text>
        </Pressable>
        <Pressable onPress={addMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#2196f3" />
        </Pressable>
      </View>

      {showEmoji && (
        <View style={styles.emojiRow}>
          {['😀', '🎉', '❤️', '😂', '👍', '🥳'].map((emoji) => (
            <Pressable
              key={emoji}
              onPress={() => setNewMessage((prev) => prev + emoji)}
              style={styles.emojiButton}
            >
              <Text style={{ fontSize: 22 }}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  bubbleRow: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'flex-end',
  },
  rightAlign: {
    justifyContent: 'flex-end',
  },
  avatar: {
    fontSize: 24,
    marginRight: 6,
    marginLeft: 2,
  },
  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  senderBubble: {
    backgroundColor: '#d1e7ff',
    borderTopRightRadius: 0,
  },
  bubbleText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: '#555',
    marginTop: 4,
  },
  bubbleIcons: {
    flexDirection: 'row',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  emojiToggle: {
    marginLeft: 8,
    marginRight: 4,
  },
  sendButton: {
    marginLeft: 4,
  },
  counter: {
    textAlign: 'right',
    fontSize: 12,
    color: '#888',
    marginRight: 12,
    marginTop: 4,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  emojiButton: {
    padding: 6,
    marginHorizontal: 4,
  },
});
