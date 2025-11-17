import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Menu, 
  Plus, 
  SendHorizontal, 
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
  Book,
  Brain,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Download,
  Loader2
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
  { icon: Palette, title: "Create painting", subtitle: "Renaissance-style", color: "text-suggestion-1" },
  { icon: FileEdit, title: "Write report", subtitle: "from data", color: "text-suggestion-2" },
  { icon: Link2, title: "Summarize article", subtitle: "from URL", color: "text-suggestion-3" },
  { icon: Code, title: "Generate code", subtitle: "any language", color: "text-suggestion-4" },
  { icon: Sparkles, title: "Brainstorm ideas", subtitle: "creative solutions", color: "text-suggestion-5" },
  { icon: MessageSquare, title: "Draft message", subtitle: "professional tone", color: "text-suggestion-6" },
  { icon: Book, title: "Explain concept", subtitle: "simple terms", color: "text-suggestion-7" },
];

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  const [uploadedFiles, setUploadedFiles] = useState<{ type: "image" | "file"; name: string; url: string; data?: string; mimeType?: string }[]>([]);
  const [searchMode, setSearchMode] = useState(false);
  const [deepThinkMode, setDeepThinkMode] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const hasMessages = currentConversation && currentConversation.messages.length > 0;

  // Animated text cycling
  useEffect(() => {
    const words = [...suggestions.map(s => s.title), "Beja"];
    const currentText = words[currentWord];

    if (isTyping) {
      if (animatedText.length < currentText.length) {
        const timeout = setTimeout(() => {
          setAnimatedText(currentText.slice(0, animatedText.length + 1));
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
  }, [currentWord, isTyping, animatedText, suggestions]);

  const handleSendMessage = async () => {
    if (!message.trim() && uploadedFiles.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      files: uploadedFiles.length > 0 ? uploadedFiles : undefined
    };

    const userMessage = message;
    const userFiles = uploadedFiles;

    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    ));

    setMessage("");
    setUploadedFiles([]);
    setIsAIResponding(true);

    try {
      // Prepare images for API if any
      const images = userFiles
        .filter(f => f.type === "image" && f.data)
        .map(f => ({
          data: f.data,
          mimeType: f.mimeType
        }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-ai`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: userMessage }],
            searchMode,
            deepThinkMode,
            images: images.length > 0 ? images : undefined
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // Parse streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = "";
      let aiMessageId = Date.now().toString();

      // Add empty AI message
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [...conv.messages, { id: aiMessageId, role: "assistant", content: "" }] }
          : conv
      ));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              const text = jsonData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                aiMessage += text;
                // Update AI message
                setConversations(prev => prev.map(conv => {
                  if (conv.id === currentConversationId) {
                    return {
                      ...conv,
                      messages: conv.messages.map(msg =>
                        msg.id === aiMessageId ? { ...msg, content: aiMessage } : msg
                      )
                    };
                  }
                  return conv;
                }));
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }

      setSearchMode(false);
      setDeepThinkMode(false);
    } catch (error) {
      console.error('Error calling AI:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAIResponding(false);
    }
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
      
      if (type === "image") {
        // Convert image to base64 for API
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          const data = base64.split(',')[1]; // Remove data:image/xxx;base64, prefix
          setUploadedFiles(prev => [...prev, { 
            type, 
            name: file.name, 
            url,
            data,
            mimeType: file.type 
          }]);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedFiles(prev => [...prev, { type, name: file.name, url }]);
      }
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied to clipboard" });
  };

  const handleRegenerateResponse = () => {
    // TODO: Implement regeneration
    toast({ title: "Regenerating response..." });
  };

  const handleLikeMessage = () => {
    toast({ title: "Thank you for your feedback!" });
  };

  const handleDislikeMessage = () => {
    toast({ title: "Thank you for your feedback!" });
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
    <div className={`flex h-screen overflow-hidden ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex h-screen w-full bg-background">
        <ChatSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={setCurrentConversationId}
          onUpdateConversations={setConversations}
          onLogout={handleLogout}
          theme={theme}
          onThemeChange={setTheme}
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

              <div className="w-full max-w-2xl space-y-2">
                {visibleSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(suggestion.title)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                      <suggestion.icon className={`h-4 w-4 ${suggestion.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground">{suggestion.subtitle}</p>
                    </div>
                  </button>
                ))}
                
                {!showAllSuggestions && suggestions.length > 4 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowAllSuggestions(true)}
                  >
                    More
                  </Button>
                )}
                
                {showAllSuggestions && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowAllSuggestions(false)}
                  >
                    Close Suggestions
                  </Button>
                )}
              </div>
            </div>
          )}

          {hasMessages && (
            <div className="space-y-6 py-4">
              {currentConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} gap-2`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-transparent text-foreground"
                        : "bg-transparent text-foreground"
                    }`}
                  >
                    {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                    {msg.files && msg.files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.files.map((file, idx) => (
                          <div
                            key={idx}
                            className="relative rounded-lg overflow-hidden"
                            onClick={() => file.type === "image" && setEnlargedImage(file.url)}
                          >
                            {file.type === "image" ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-32 h-32 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                              />
                            ) : (
                              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                <FileText className="h-6 w-6" />
                                <span className="text-xs">{file.name}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1 px-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleCopyMessage(msg.content)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleRegenerateResponse}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleLikeMessage}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleDislikeMessage}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setReportDialogOpen(true)}
                      >
                        <Flag className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {isAIResponding && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="px-4 py-2 border-t">
            <div className="overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden bg-muted p-2 flex-shrink-0"
                  >
                    <button
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 z-10"
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
                      <div className="flex flex-col items-center justify-center w-16 h-16 gap-1">
                        <FileText className="h-6 w-6" />
                        <span className="text-[10px] truncate w-full text-center">{file.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex flex-col gap-2 max-w-4xl mx-auto">
            {/* Mode indicators */}
            {(searchMode || deepThinkMode) && (
              <div className="flex items-center gap-2 px-2">
                {searchMode && (
                  <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm">
                    <Search className="h-3.5 w-3.5" />
                    <span>Search</span>
                    <button onClick={() => setSearchMode(false)}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                {deepThinkMode && (
                  <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm">
                    <Brain className="h-3.5 w-3.5" />
                    <span>Deep Think</span>
                    <button onClick={() => setDeepThinkMode(false)}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={() => setUploadMenuOpen(true)}
              >
                <Plus className="h-5 w-5" />
              </Button>

              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="Ask Beja"
                className="flex-1 rounded-3xl border border-border bg-muted/30 resize-none min-h-[44px] max-h-32"
                rows={1}
                disabled={isAIResponding}
              />

              <Button
                size="icon"
                className="flex-shrink-0 rounded-full"
                onClick={handleSendMessage}
                disabled={!message.trim() && uploadedFiles.length === 0}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Menu Sheet */}
      <Sheet open={uploadMenuOpen} onOpenChange={setUploadMenuOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <div className="space-y-1">
            <button
              onClick={() => handleFileUpload("image")}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
            >
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm">Upload Image</span>
            </button>
            <button
              onClick={() => handleFileUpload("file")}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm">Upload File</span>
            </button>
            <button
              onClick={() => setUploadMenuOpen(false)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
            >
              <Camera className="h-4 w-4" />
              <span className="text-sm">Take Picture</span>
            </button>
            <button
              onClick={() => {
                setSearchMode(true);
                setUploadMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search</span>
            </button>
            <button
              onClick={() => {
                setDeepThinkMode(true);
                setUploadMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
            >
              <Brain className="h-4 w-4" />
              <span className="text-sm">Deep Think</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Top Menu Dialog */}
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="sm:max-w-[280px] rounded-3xl">
          <div className="space-y-1">
            <button
              disabled={!hasMessages}
              onClick={() => {
                if (hasMessages) {
                  const newConv: Conversation = {
                    id: Date.now().toString(),
                    name: "New Chat",
                    pinned: false,
                    messages: []
                  };
                  setConversations(prev => [...prev, newConv]);
                  setCurrentConversationId(newConv.id);
                  setMenuOpen(false);
                }
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                !hasMessages 
                  ? 'text-muted-foreground cursor-not-allowed opacity-50' 
                  : 'hover:bg-accent cursor-pointer'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">New Chat</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setEditNameDialogOpen(true);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              <span className="text-sm">Edit Chat Name</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setDeleteDialogOpen(true);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm">Delete Conversation</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setReportDialogOpen(true);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
            >
              <Flag className="h-4 w-4" />
              <span className="text-sm">Report Conversation</span>
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
        <DialogContent className="sm:max-w-[320px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Conversation?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            This action cannot be undone. This will permanently delete this conversation.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteConversation}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Name Dialog */}
      <Dialog open={editNameDialogOpen} onOpenChange={setEditNameDialogOpen}>
        <DialogContent className="sm:max-w-[320px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base">Edit Chat Name</DialogTitle>
          </DialogHeader>
          <Input
            defaultValue={currentConversation?.name}
            placeholder="Enter chat name"
            className="text-sm"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setEditNameDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setEditNameDialogOpen(false)}>
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

        {/* Enlarged Image Dialog */}
        <Dialog open={!!enlargedImage} onOpenChange={() => setEnlargedImage(null)}>
          <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur">
            {enlargedImage && (
              <img
                src={enlargedImage}
                alt="Enlarged view"
                className="w-full h-auto rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Chat;
