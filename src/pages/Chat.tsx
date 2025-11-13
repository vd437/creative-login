import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  Menu, 
  Plus, 
  Send, 
  Image as ImageIcon, 
  FileText, 
  Camera, 
  MoreVertical,
  X,
  Search,
  Settings,
  LogOut,
  Trash2,
  Edit2,
  Pin,
  Flag,
  Palette,
  FileEdit,
  Link2,
  Code,
  Sparkles,
  MessageSquare,
  Book
} from "lucide-react";
import { ChatSidebar } from "@/components/ChatSidebar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: { type: "image" | "file"; name: string; url: string }[];
}

interface Conversation {
  id: string;
  name: string;
  pinned: boolean;
  messages: Message[];
}

const suggestions = [
  { icon: Palette, title: "Create painting", subtitle: "Renaissance-style" },
  { icon: FileEdit, title: "Write report", subtitle: "from data" },
  { icon: Link2, title: "Summarize article", subtitle: "from URL" },
  { icon: Code, title: "Generate code", subtitle: "any language" },
  { icon: Sparkles, title: "Brainstorm ideas", subtitle: "creative solutions" },
  { icon: MessageSquare, title: "Draft message", subtitle: "professional tone" },
  { icon: Book, title: "Explain concept", subtitle: "simple terms" },
];

const Chat = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", name: "New Chat", pinned: false, messages: [] }
  ]);
  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [editNameDialogOpen, setEditNameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [animatedText, setAnimatedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<{ type: "image" | "file"; name: string; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const hasMessages = currentConversation && currentConversation.messages.length > 0;

  // Animated text cycling
  useEffect(() => {
    const words = [...suggestions.map(s => s.title), "Beja"];
    let charIndex = 0;
    const currentText = words[currentWord];

    if (isTyping) {
      if (charIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setAnimatedText(currentText.slice(0, charIndex + 1));
          charIndex++;
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, currentWord === words.length - 1 ? 2000 : 1500);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setAnimatedText("");
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentWord, isTyping, animatedText]);

  const handleSendMessage = () => {
    if (!message.trim() && uploadedFiles.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      files: uploadedFiles.length > 0 ? uploadedFiles : undefined
    };

    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    ));

    setMessage("");
    setUploadedFiles([]);
  };

  const handleFileUpload = (type: "image" | "file") => {
    if (type === "image") {
      imageInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
    setUploadMenuOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedFiles(prev => [...prev, { type, name: file.name, url }]);
    }
  };

  const handleDeleteConversation = () => {
    setConversations(prev => prev.filter(c => c.id !== currentConversationId));
    setDeleteDialogOpen(false);
    if (conversations.length > 1) {
      setCurrentConversationId(conversations[0].id);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const visibleSuggestions = showAllSuggestions ? suggestions : suggestions.slice(0, 4);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={setCurrentConversationId}
        onUpdateConversations={setConversations}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {currentConversation?.name || "New Chat"}
          </h1>
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)}>
            <MoreVertical className="h-5 w-5" />
          </Button>
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4">
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center h-full space-y-8 py-12">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  {animatedText}
                  <span className="animate-blink">|</span>
                </h2>
              </div>

              <div className="w-full max-w-2xl space-y-3">
                {visibleSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(suggestion.title)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <suggestion.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{suggestion.title}</p>
                      <p className="text-sm text-muted-foreground">{suggestion.subtitle}</p>
                    </div>
                  </button>
                ))}
                
                {!showAllSuggestions && suggestions.length > 4 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAllSuggestions(true)}
                  >
                    More
                  </Button>
                )}
                
                {showAllSuggestions && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAllSuggestions(false)}
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          )}

          {hasMessages && (
            <div className="space-y-4 py-4">
              {currentConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content && <p className="text-sm">{msg.content}</p>}
                    {msg.files && msg.files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.files.map((file, idx) => (
                          <div
                            key={idx}
                            className="relative rounded-lg overflow-hidden bg-background/20 p-2"
                          >
                            {file.type === "image" ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                            ) : (
                              <div className="flex items-center gap-2 p-2">
                                <FileText className="h-8 w-8" />
                                <span className="text-xs">{file.name}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="px-4 py-2 border-t">
            <ScrollArea className="max-h-24">
              <div className="flex gap-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden bg-muted p-2 flex-shrink-0"
                  >
                    <button
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="flex items-center gap-2 w-32 p-2">
                        <FileText className="h-6 w-6" />
                        <span className="text-xs truncate">{file.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={() => setUploadMenuOpen(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>

            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask Beja"
              className="flex-1 rounded-full border-none bg-muted"
            />

            <Button
              size="icon"
              className="flex-shrink-0 rounded-full"
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Menu Dialog */}
      <Dialog open={uploadMenuOpen} onOpenChange={setUploadMenuOpen}>
        <DialogContent className="sm:max-w-[320px] rounded-3xl">
          <div className="space-y-2">
            <button
              onClick={() => handleFileUpload("image")}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-accent transition-colors"
            >
              <ImageIcon className="h-5 w-5" />
              <span>Upload Image</span>
            </button>
            <button
              onClick={() => handleFileUpload("file")}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-accent transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Upload File</span>
            </button>
            <button
              onClick={() => setUploadMenuOpen(false)}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-accent transition-colors"
            >
              <Camera className="h-5 w-5" />
              <span>Take Picture</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Top Menu Dialog */}
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="sm:max-w-[320px] rounded-3xl">
          <div className="space-y-2">
            <button
              disabled
              className="w-full flex items-center gap-3 p-4 rounded-xl text-muted-foreground cursor-not-allowed opacity-50"
            >
              <MessageSquare className="h-5 w-5" />
              <span>New Chat</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setEditNameDialogOpen(true);
              }}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-accent transition-colors"
            >
              <Edit2 className="h-5 w-5" />
              <span>Edit Chat Name</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setDeleteDialogOpen(true);
              }}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete Conversation</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setReportDialogOpen(true);
              }}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-accent transition-colors"
            >
              <Flag className="h-5 w-5" />
              <span>Report Conversation</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Report Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <select className="w-full p-2 rounded-lg border border-border bg-background">
                <option>Inappropriate Content</option>
                <option>Spam</option>
                <option>Harassment</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea placeholder="Describe the issue..." className="min-h-[100px]" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Evidence (Optional)</label>
              <Button variant="outline" className="w-full">
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>
            <Button className="w-full">Submit Report</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[380px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Delete Conversation?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete this conversation.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConversation}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Name Dialog */}
      <Dialog open={editNameDialogOpen} onOpenChange={setEditNameDialogOpen}>
        <DialogContent className="sm:max-w-[380px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Chat Name</DialogTitle>
          </DialogHeader>
          <Input
            defaultValue={currentConversation?.name}
            placeholder="Enter chat name"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setEditNameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditNameDialogOpen(false)}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "image")}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFileChange(e, "file")}
      />
    </div>
  );
};

export default Chat;
