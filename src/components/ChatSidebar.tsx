import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  X,
  Search,
  MoreVertical,
  Trash2,
  Edit2,
  Pin,
  Settings,
  LogOut,
  Check,
} from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  pinned: boolean;
  messages: any[];
}

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentConversationId: string;
  onSelectConversation: (id: string) => void;
  onUpdateConversations: (conversations: Conversation[]) => void;
  onLogout: () => void;
}

export const ChatSidebar = ({
  open,
  onClose,
  conversations,
  currentConversationId,
  onSelectConversation,
  onUpdateConversations,
  onLogout,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter((c) => c.pinned);
  const unpinnedConversations = filteredConversations.filter((c) => !c.pinned);

  const handlePinConversation = (id: string) => {
    onUpdateConversations(
      conversations.map((conv) =>
        conv.id === id ? { ...conv, pinned: !conv.pinned } : conv
      )
    );
    setActiveMenuId(null);
  };

  const handleEditStart = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
    setActiveMenuId(null);
  };

  const handleEditSave = (id: string) => {
    if (editName.trim()) {
      onUpdateConversations(
        conversations.map((conv) =>
          conv.id === id ? { ...conv, name: editName } : conv
        )
      );
    }
    setEditingId(null);
    setEditName("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleDeleteClick = (id: string) => {
    setConversationToDelete(id);
    setDeleteDialogOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteConfirm = () => {
    if (conversationToDelete) {
      onUpdateConversations(
        conversations.filter((c) => c.id !== conversationToDelete)
      );
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Conversations</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="px-2 pb-4 space-y-4">
            {/* Pinned Conversations */}
            {pinnedConversations.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                  Pinned
                </div>
                <div className="space-y-1">
                  {pinnedConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={conv.id === currentConversationId}
                      isEditing={editingId === conv.id}
                      editName={editName}
                      activeMenuId={activeMenuId}
                      onSelect={onSelectConversation}
                      onMenuToggle={setActiveMenuId}
                      onPin={handlePinConversation}
                      onEditStart={handleEditStart}
                      onEditSave={handleEditSave}
                      onEditCancel={handleEditCancel}
                      onEditChange={setEditName}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Separator */}
            {pinnedConversations.length > 0 && unpinnedConversations.length > 0 && (
              <div className="h-px bg-border my-2" />
            )}

            {/* Unpinned Conversations */}
            {unpinnedConversations.length > 0 && (
              <div className="space-y-1">
                {unpinnedConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === currentConversationId}
                    isEditing={editingId === conv.id}
                    editName={editName}
                    activeMenuId={activeMenuId}
                    onSelect={onSelectConversation}
                    onMenuToggle={setActiveMenuId}
                    onPin={handlePinConversation}
                    onEditStart={handleEditStart}
                    onEditSave={handleEditSave}
                    onEditCancel={handleEditCancel}
                    onEditChange={setEditName}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[280px] rounded-3xl">
          <h2 className="text-base font-semibold mb-2">Delete Conversation?</h2>
          <p className="text-xs text-muted-foreground mb-4">
            This action cannot be undone. This will permanently delete this conversation.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  isEditing: boolean;
  editName: string;
  activeMenuId: string | null;
  onSelect: (id: string) => void;
  onMenuToggle: (id: string | null) => void;
  onPin: (id: string) => void;
  onEditStart: (id: string, name: string) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onEditChange: (name: string) => void;
  onDelete: (id: string) => void;
}

const ConversationItem = ({
  conversation,
  isActive,
  isEditing,
  editName,
  activeMenuId,
  onSelect,
  onMenuToggle,
  onPin,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditChange,
  onDelete,
}: ConversationItemProps) => {
  const menuOpen = activeMenuId === conversation.id;

  return (
    <div
      className={`relative group rounded-lg px-3 py-2 ${
        isActive ? "bg-accent" : "hover:bg-accent/50"
      }`}
    >
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={editName}
            onChange={(e) => onEditChange(e.target.value)}
            className="h-8 text-sm"
            autoFocus
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => onEditSave(conversation.id)}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 flex-shrink-0"
            onClick={onEditCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <button
            onClick={() => onSelect(conversation.id)}
            className="flex-1 text-left text-sm truncate pr-8 w-full"
          >
            {conversation.name}
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onMenuToggle(menuOpen ? null : conversation.id)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => onMenuToggle(null)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border rounded-lg shadow-lg z-20 py-1">
                <button
                  onClick={() => onPin(conversation.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <Pin className="h-4 w-4" />
                  {conversation.pinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={() => onEditStart(conversation.id, conversation.name)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Name
                </button>
                <button
                  onClick={() => onDelete(conversation.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
