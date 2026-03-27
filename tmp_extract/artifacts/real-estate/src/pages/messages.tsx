import { useMessages } from "@/hooks/use-interactions";
import { useAuth } from "@/hooks/use-auth";
import { MessageSquare, User, Clock } from "lucide-react";
import { format } from "date-fns";

export function Messages() {
  const { data: messages, isLoading } = useMessages();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh] max-w-5xl">
      <div className="mb-10 flex items-center gap-4 border-b border-border pb-6">
        <div className="bg-primary/10 text-primary p-3 rounded-2xl">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold">Inbox</h1>
          <p className="text-muted-foreground mt-1">Your conversations with agents and clients.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-card rounded-2xl animate-pulse" />)}
        </div>
      ) : messages && messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map(msg => {
            const isSender = msg.senderId === user?.id;
            const otherPerson = isSender ? msg.receiver : msg.sender;
            
            return (
              <div key={msg.id} className={`bg-card p-6 rounded-2xl border transition-all ${!msg.isRead && !isSender ? 'border-primary shadow-md bg-primary/5' : 'border-border'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground">
                      {otherPerson.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{otherPerson.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                  {isSender && <span className="text-xs font-semibold px-2 py-1 bg-secondary rounded text-muted-foreground">Sent</span>}
                </div>
                <div className={`mt-2 pl-13 ${!msg.isRead && !isSender ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {msg.content}
                </div>
                {msg.propertyId && (
                  <div className="mt-4 pl-13 text-xs">
                    <a href={`/properties/${msg.propertyId}`} className="text-primary hover:underline font-semibold flex items-center gap-1">
                      Related to property #{msg.propertyId}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-3xl border border-border mt-10">
          <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
          <h3 className="text-2xl font-display font-bold mb-2">Your inbox is empty</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">When you contact agents about properties, the messages will appear here.</p>
        </div>
      )}
    </div>
  );
}
