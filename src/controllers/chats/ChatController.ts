import Chat from "../../models/Chat";

class ChatService {
  async save(message: string, sender: string) {
    const chatMessage = new Chat({ message, sender });
    return chatMessage.save();
  }
}

export default new ChatService();
