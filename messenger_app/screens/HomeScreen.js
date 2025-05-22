import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const emojiOptions = ['💬', '👬', '👨‍👩‍👧', '💼', '🏠', '🎵', '📷', '🚗'];

const HomeScreen = ({ navigation }) => {
  const [inboxes, setInboxes] = useState([
    { id: 'friends-' + Date.now(), name: 'Friends', emoji: '👬' },
    { id: 'family-' + Date.now(), name: 'Family', emoji: '👨‍👩‍👧' },
    { id: 'work-' + Date.now(), name: 'Work', emoji: '💼' },
  ]);
  const [newInbox, setNewInbox] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💬');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const addInbox = () => {
    if (newInbox.trim() === '') return;

    const newItem = {
      id: Date.now().toString(),
      name: newInbox.trim(),
      emoji: selectedEmoji,
    };

    setInboxes([newItem, ...inboxes]);
    setNewInbox('');
    setSelectedEmoji('💬');
  };

  const deleteInbox = (id) => {
    const newInboxes = inboxes.filter(item => item.id !== id);
    setInboxes(newInboxes);
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.inboxCard,
        pressed && styles.pressedInbox,
      ]}
      onPress={() => navigation.navigate('Messages', {
        inboxId: item.id,
        name: `${item.emoji} ${item.name}`,
      })}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.emojiOnly}>{item.emoji}</Text>
      </View>
      <Text style={styles.inboxText}>{item.name}</Text>
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          deleteInbox(item.id);
        }}
        style={styles.trashIcon}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons name="trash" size={22} color="#c00" />
      </Pressable>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>📣 Inbox</Text>
        <View style={styles.divider} />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add new inbox... 4K"
            value={newInbox}
            onChangeText={setNewInbox}
            onSubmitEditing={addInbox}
            returnKeyType="done"
          />
          <Pressable onPress={() => setEmojiPickerVisible(true)} style={styles.emojiButton}>
            <Text style={{ fontSize: 20 }}>{selectedEmoji}</Text>
          </Pressable>
          <Pressable onPress={addInbox} style={styles.addButton}>
            <Ionicons name="add-circle" size={28} color="#4caf50" />
          </Pressable>
        </View>

        <View style={styles.block}>
          <FlatList
            data={inboxes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No inboxes yet. Add one above!</Text>
            }
          />
        </View>

        <Modal visible={emojiPickerVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Emoji</Text>
              <View style={styles.emojiOptions}>
                {emojiOptions.map((emoji) => (
                  <Pressable
                    key={emoji}
                    onPress={() => {
                      setSelectedEmoji(emoji);
                      setEmojiPickerVisible(false);
                    }}
                    style={styles.emojiOption}
                  >
                    <Text style={{ fontSize: 24 }}>{emoji}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable onPress={() => setEmojiPickerVisible(false)}>
                <Text style={styles.closeBtn}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#e8f0ff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'left',
  },
  divider: {
    height: 2,
    backgroundColor: '#ccc',
    marginBottom: 15,
    borderRadius: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  emojiButton: {
    paddingHorizontal: 6,
  },
  addButton: {
    marginLeft: 10,
  },
  block: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    elevation: 1,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  inboxCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  pressedInbox: {
    backgroundColor: '#d9ebff',
  },
  iconCircle: {
    width: 36,
    height: 36,
    backgroundColor: '#e0ecff',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emojiOnly: {
    fontSize: 18,
  },
  inboxText: {
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
  },
  trashIcon: {
    padding: 8,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emojiOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emojiOption: {
    padding: 8,
    margin: 4,
  },
  closeBtn: {
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
