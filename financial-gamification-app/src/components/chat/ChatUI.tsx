import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../contexts/ChatContext";
import { PersonaType } from "../../types/chat";
import { SignLanguageKeyboard } from "../common/SignLanguageKeyboard";
import "./ChatUI.css";
import { IoMdSend } from "react-icons/io";
import {
  chineseFinanceWords,
  chineseKeyboard,
  emojis,
  hindiFinanceWords,
  hindiKeyboard,
} from "./constants";
import { FaPlus } from "react-icons/fa6";

// Import icons (add these to your public/icons directory)
const KEYBOARD_ICON = "/icons/keyboard.svg";
const UPLOAD_ICON = "/icons/upload.svg";
const AUDIO_ICON = "/icons/audio.svg";
const VIDEO_ICON = "/icons/video.svg";

export const ChatUI: React.FC = () => {
  const { state, sendMessage, setPersona, clearChat } = useChat();
  const prevInput = useRef("");
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState<
    "text" | "emoji" | "sign" | "hindi" | "chinese"
  >("text");
  const messagesList = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToTop = () => {
    if (messagesList.current) {
      messagesList.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
  const scrollToBottom = () => {
    if (messagesList.current) {
      messagesList.current.scrollTo({
        top: messagesList.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);
  const expandTextarea = () => {
    const el = inputRef.current;
    if (el) {
      el.style.height = "auto"; // Reset first
      el.style.height = `${el.scrollHeight - 16}px`; // Then adjust
    }
  };
  useEffect(() => {
    if (input !== prevInput.current) {
      expandTextarea();
      prevInput.current = input;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload - you can implement the actual upload logic here
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        // Send file message
        sendMessage(`Sent file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVirtualKeyboardToggle = () => {
    setShowVirtualKeyboard(!showVirtualKeyboard);
  };

  const handleVirtualKeyPress = (key: string) => {
    setInput((prev) => prev + key);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim().length > 2) {
      const allWords = [
        ...hindiFinanceWords.map((w) => w.hindi),
        ...hindiFinanceWords.map((w) => w.english),
        ...chineseFinanceWords.map((w) => w.chinese),
        ...chineseFinanceWords.map((w) => w.pinyin),
        ...Object.values(emojis).flatMap((cat) => cat.list),
        "investment",
        "savings",
        "loan",
        "credit score",
        "compound interest",
        "stocks",
        "bonds",
        "mutual funds",
        "ETF",
        "401k",
        "IRA",
      ];

      const lastWord =
        value
          .split(/[\s,.]+/)
          .pop()
          ?.toLowerCase() || "";

      if (lastWord) {
        const filteredSuggestions = allWords.filter((word) =>
          word.toLowerCase().startsWith(lastWord),
        );
        setSuggestions(filteredSuggestions.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const words = input.split(/[\s,.]+/);
    words.pop();
    const newText = [...words, suggestion].join(" ") + " ";
    setInput(newText);
    setSuggestions([]);
    expandTextarea();
  };

  const personas: { id: PersonaType; name: string; avatar: string }[] = [
    { id: "relationship-manager", name: "Financial Advisor", avatar: "👨‍💼" },
    { id: "ai-coach", name: "Investment Coach", avatar: "👩‍🏫" },
    { id: "ai-tutor", name: "Finance Tutor", avatar: "🎓" },
  ];

  return (
    <div
      className={`chat-container ${showVirtualKeyboard ? "keyboard-active" : ""}`}
    >
      <div className="chat-header">
        <div className="persona-selector">
          {personas.map((persona) => (
            <button
              key={persona.id}
              className={`persona-button ${state.selectedPersona === persona.id ? "active" : ""}`}
              onClick={() => setPersona(persona.id)}
            >
              <span className="persona-avatar">{persona.avatar}</span>
            </button>
          ))}
        </div>
        <button className="clear-chat" onClick={clearChat}>
          Clear Chat
        </button>
      </div>

      <div className="messages-container">
        <div className="chat-history-header">
          <div className="chat-status">
            <span className="status-indicator"></span>
            <span className="status-text">
              {state.isTyping
                ? "AI is typing..."
                : `${state.messages.length} messages`}
            </span>
          </div>
          <div className="chat-actions">
            <button
              className="action-button"
              onClick={scrollToTop}
              title="Scroll to top"
            >
              ⬆️
            </button>
            <button
              className="action-button"
              onClick={clearChat}
              title="Clear conversation"
            >
              🗑️
            </button>
          </div>
        </div>

        <div ref={messagesList} className="messages-list">
          {state.messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">💬</div>
              <h3>Start Your Financial Conversation</h3>
              <p>
                Ask questions about investments, savings, loans, or any
                financial topic!
              </p>
              <div className="suggested-prompts">
                <button
                  className="prompt-button"
                  onClick={() =>
                    setInput(
                      "What's the best way to start investing with $1000?",
                    )
                  }
                >
                  💰 Financial advice
                </button>
                <button
                  className="prompt-button"
                  onClick={() => setInput("How can I improve my credit score?")}
                >
                  📈 Credit tips
                </button>
                <button
                  className="prompt-button"
                  onClick={() => setInput("Explain compound interest")}
                >
                  🎓 Learn basics
                </button>
              </div>
            </div>
          ) : (
            state.messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === "user" ? "user" : "bot"}`}
              >
                {message.sender === "bot" && (
                  <div className="bot-avatar">
                    {personas.find((p) => p.id === message.persona)?.avatar ||
                      "🤖"}
                  </div>
                )}
                <div className="message-content">
                  <p>
                    {message.sender === "user" && (
                      <img src={UPLOAD_ICON} alt="user icon" className="icon" />
                    )}
                    {message.sender === "bot" &&
                      (personas.find((p) => p.id === message.persona)?.avatar ||
                        VIDEO_ICON)}
                    {message.content}
                  </p>
                  <span className="timestamp">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  <div className="message-actions">
                    <button
                      className="message-action-btn"
                      onClick={() =>
                        navigator.clipboard.writeText(message.content)
                      }
                      title="Copy message"
                    >
                      📋
                    </button>
                    {message.sender === "bot" && (
                      <button
                        className="message-action-btn"
                        onClick={() =>
                          setInput(
                            `Explain more about: "${message.content.substring(0, 50)}..."`,
                          )
                        }
                        title="Ask for more details"
                      >
                        🔍
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {state.isTyping && (
            <div className="message bot">
              <div className="bot-avatar">
                {personas.find((p) => p.id === state.selectedPersona)?.avatar}
              </div>
              <div className="message-content typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`chat-input-container ${showVirtualKeyboard ? "keyboard-active" : ""}`}
      >
        {/* Combined Input and Controls Row */}
        <div className="chat-main-row">
          <div className="chat-tools">
            {/*<button*/}
            {/*  type="button"*/}
            {/*  className="tool-button"*/}
            {/*  onClick={handleVirtualKeyboardToggle}*/}
            {/*  title="Virtual Keyboard"*/}
            {/*>*/}
            {/*  <img src={KEYBOARD_ICON} alt="Keyboard" />*/}
            {/*</button>*/}
            <div className="file-upload">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="audio/*,video/*"
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="tool-button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Media"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              rows={1}
              className="chat-input"
              onInput={expandTextarea}
            />
            {suggestions.length > 0 && (
              <div className="suggestions-popup">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="send-button"
            disabled={!input.trim()}
          >
            <IoMdSend />
          </button>
        </div>

        {/* Virtual Keyboard - Below Text Input */}
        {showVirtualKeyboard && (
          <div className="keyboard-wrapper">
            <div className="keyboard-tabs">
              <button
                className={`keyboard-tab ${keyboardMode === "text" ? "active" : ""}`}
                onClick={() => setKeyboardMode("text")}
                title="English keyboard"
              >
                ABC
              </button>
              <button
                className={`keyboard-tab ${keyboardMode === "emoji" ? "active" : ""}`}
                onClick={() => setKeyboardMode("emoji")}
                title="Emoji keyboard"
              >
                😊
              </button>
              <button
                className={`keyboard-tab ${keyboardMode === "sign" ? "active" : ""}`}
                onClick={() => setKeyboardMode("sign")}
                title="Sign language keyboard"
              >
                🤟
              </button>
              <button
                className={`keyboard-tab ${keyboardMode === "hindi" ? "active" : ""}`}
                onClick={() => setKeyboardMode("hindi")}
                title="Hindi keyboard"
              >
                हिं
              </button>
              <button
                className={`keyboard-tab ${keyboardMode === "chinese" ? "active" : ""}`}
                onClick={() => setKeyboardMode("chinese")}
                title="Chinese keyboard"
              >
                中文
              </button>
            </div>

            {keyboardMode === "text" ? (
              <div className="virtual-keyboard">
                <div className="keyboard-row">
                  {Array.from("1234567890").map((key) => (
                    <button
                      key={key}
                      type="button"
                      className="key"
                      onClick={() => handleVirtualKeyPress(key)}
                    >
                      {key}
                    </button>
                  ))}
                  <button
                    key="backspace"
                    type="button"
                    className="key function-key wide"
                    onClick={() => setInput((prev) => prev.slice(0, -1))}
                  >
                    ⌫
                  </button>
                </div>
                <div className="keyboard-row">
                  {Array.from("qwertyuiop").map((key) => (
                    <button
                      key={key}
                      type="button"
                      className="key"
                      onClick={() => handleVirtualKeyPress(key)}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="keyboard-row">
                  {Array.from("asdfghjkl").map((key) => (
                    <button
                      key={key}
                      type="button"
                      className="key"
                      onClick={() => handleVirtualKeyPress(key)}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                  <button
                    key="enter"
                    type="button"
                    className="key function-key wide"
                    onClick={(e) => handleSubmit(e as any)}
                  >
                    ↵
                  </button>
                </div>
                <div className="keyboard-row">
                  <button
                    type="button"
                    className="key function-key"
                    onClick={() => {
                      // Shift logic here if needed
                    }}
                  >
                    ⇧
                  </button>
                  {Array.from("zxcvbnm").map((key) => (
                    <button
                      key={key}
                      type="button"
                      className="key"
                      onClick={() => handleVirtualKeyPress(key)}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="key function-key"
                    onClick={() => handleVirtualKeyPress(".")}
                  >
                    .
                  </button>
                  <button
                    type="button"
                    className="key function-key"
                    onClick={() => handleVirtualKeyPress(",")}
                  >
                    ,
                  </button>
                </div>
                <div className="keyboard-row">
                  <button
                    type="button"
                    className="key function-key"
                    onClick={() => setKeyboardMode("emoji")}
                  >
                    😊
                  </button>
                  <button
                    type="button"
                    className="key function-key extra-wide"
                    onClick={() => handleVirtualKeyPress(" ")}
                  >
                    Space
                  </button>
                  <button
                    type="button"
                    className="key function-key"
                    onClick={() => setInput((prev) => prev.slice(0, -1))}
                  >
                    ⌫
                  </button>
                  <button
                    key="enter"
                    type="button"
                    className="key function-key wide"
                    onClick={(e) => handleSubmit(e as any)}
                  >
                    ↵
                  </button>
                </div>
              </div>
            ) : keyboardMode === "emoji" ? (
              <div className="virtual-keyboard">
                {Object.entries(emojis).map(([category, { title, list }]) => (
                  <div key={category} className="emoji-category">
                    <div className="emoji-category-title">{title}</div>
                    <div className="emoji-grid">
                      {list.map((emoji: string) => (
                        <button
                          key={emoji}
                          type="button"
                          className="key emoji-key"
                          onClick={() => handleVirtualKeyPress(emoji)}
                          title={`${title} emoji: ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : keyboardMode === "sign" ? (
              <div className="sign-language-wrapper">
                <SignLanguageKeyboard
                  onSelect={handleVirtualKeyPress}
                  showDescriptions={true}
                />
              </div>
            ) : keyboardMode === "hindi" ? (
              <div className="virtual-keyboard hindi-keyboard">
                <div className="language-info">
                  <h4>हिंदी कीबोर्ड (Hindi Keyboard)</h4>
                  <p>Financial terms in Hindi</p>
                </div>

                {/* Hindi keyboard layout */}
                {hindiKeyboard.map((row, rowIndex) => (
                  <div key={rowIndex} className="keyboard-row">
                    {row.map((key) => (
                      <button
                        key={key}
                        type="button"
                        className="key hindi-key"
                        onClick={() => handleVirtualKeyPress(key)}
                        title={`Hindi character: ${key}`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                ))}
                <div className="keyboard-row">
                  <button
                    type="button"
                    className="key function-key extra-wide"
                    onClick={() => handleVirtualKeyPress(" ")}
                  >
                    Space
                  </button>
                  <button
                    type="button"
                    className="key function-key"
                    onClick={() => setInput((prev) => prev.slice(0, -1))}
                  >
                    ⌫
                  </button>
                </div>

                {/* Common Hindi finance words */}
                <div className="finance-words">
                  <div className="words-title">Common Financial Terms</div>
                  <div className="words-grid">
                    {hindiFinanceWords.map((word) => (
                      <button
                        key={word.hindi}
                        type="button"
                        className="key word-key"
                        onClick={() => handleVirtualKeyPress(word.hindi)}
                        title={`${word.hindi} (${word.transliteration}) - ${word.english}`}
                      >
                        <span className="hindi-word">{word.hindi}</span>
                        <span className="english-word">{word.english}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : keyboardMode === "chinese" ? (
              <div className="virtual-keyboard chinese-keyboard">
                <div className="language-info">
                  <h4>中文键盘 (Chinese Keyboard)</h4>
                  <p>Financial terms in Chinese</p>
                </div>

                {/* Chinese keyboard layout */}
                {chineseKeyboard.map((row, rowIndex) => (
                  <div key={rowIndex} className="keyboard-row">
                    {row.map((key) => (
                      <button
                        key={key}
                        type="button"
                        className="key chinese-key"
                        onClick={() => handleVirtualKeyPress(key)}
                        title={`Chinese character: ${key}`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                ))}
                <div className="keyboard-row">
                  <button
                    type="button"
                    className="key function-key extra-wide"
                    onClick={() => handleVirtualKeyPress(" ")}
                  >
                    Space
                  </button>
                  <button
                    type="button"
                    className="key function-key"
                    onClick={() => setInput((prev) => prev.slice(0, -1))}
                  >
                    ⌫
                  </button>
                </div>

                {/* Common Chinese finance words with pinyin */}
                <div className="finance-words">
                  <div className="words-title">Common Financial Terms</div>
                  <div className="words-grid">
                    {chineseFinanceWords.map((word) => (
                      <button
                        key={word.chinese}
                        type="button"
                        className="key word-key"
                        onClick={() => handleVirtualKeyPress(word.chinese)}
                        title={`${word.chinese} (${word.pinyin}) - ${word.english}`}
                      >
                        <span className="chinese-word">{word.chinese}</span>
                        <span className="pinyin">{word.pinyin}</span>
                        <span className="english-word">{word.english}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatUI;
