

'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the structure of a message part
interface MessagePart {
    text: string;
}

// Define the structure of a message
interface Message {
    role: 'user' | 'model';
    parts: MessagePart[];
}

// Define the structure for API request history
interface ApiHistoryEntry {
    role: 'user' | 'model';
    parts: { text: string }[];
}

// Define the structure for a conversation
interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Load conversations from localStorage on mount
    useEffect(() => {
        const savedConversations = localStorage.getItem('conversations');
        if (savedConversations) {
            setConversations(JSON.parse(savedConversations));
        }
    }, []);

    // Save conversations to localStorage whenever they change
    useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem('conversations', JSON.stringify(conversations));
        }
    }, [conversations]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startNewConversation = () => {
        const newConversation: Conversation = {
            id: crypto.randomUUID(),
            title: `Conversation ${conversations.length + 1}`,
            messages: [],
            timestamp: Date.now(),
        };
        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);
        setMessages([]);
        setIsSidebarOpen(false);
    };

    const loadConversation = (conversationId: string) => {
        const conversation = conversations.find((conv) => conv.id === conversationId);
        if (conversation) {
            setMessages(conversation.messages);
            setCurrentConversationId(conversationId);
            setIsSidebarOpen(false);
        }
    };

    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage: Message = { role: 'user', parts: [{ text: inputMessage.trim() }] };
        const updatedMessages: Message[] = [...messages, userMessage];
        setMessages(updatedMessages);
        const currentMessageToProcess = inputMessage.trim();
        setInputMessage('');
        setIsLoading(true);

        // Update conversation
        setConversations((prev) =>
            prev.map((conv) =>
                conv.id === currentConversationId
                    ? { ...conv, messages: updatedMessages }
                    : conv
            )
        );

        try {
            const apiHistory: ApiHistoryEntry[] = messages.map((msg) => ({
                role: msg.role,
                parts: msg.parts.map((part) => ({ text: part.text })),
            }));

            const response = await fetch('/api/chat/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    history: apiHistory,
                    message: currentMessageToProcess,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API request failed with status ${response.status}`);
            }

            const data: { text?: string; error?: string } = await response.json();

            if (data.text) {
                const botMessage: Message = { role: 'model', parts: [{ text: data.text }] };
                setMessages((prevMessages) => {
                    const newMessages = [...prevMessages, botMessage];
                    setConversations((prevConvs) =>
                        prevConvs.map((conv) =>
                            conv.id === currentConversationId
                                ? { ...conv, messages: newMessages }
                                : conv
                        )
                    );
                    return newMessages;
                });
            } else if (data.error) {
                throw new Error(data.error);
            } else {
                throw new Error('Received an empty response from the API.');
            }
        } catch (error: any) {
            console.error('Failed to send message:', error);
            const errorMessageText = error instanceof Error ? error.message : 'An unknown error occurred.';
            const errorMessage: Message = { role: 'model', parts: [{ text: `Error: ${errorMessageText}` }] };
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages, errorMessage];
                setConversations((prevConvs) =>
                    prevConvs.map((conv) =>
                        conv.id === currentConversationId
                            ? { ...conv, messages: newMessages }
                            : conv
                    )
                );
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar for desktop */}
            <aside className="hidden md:block w-64 bg-card border-r border-border">
                <div className="p-4">
                    <Button onClick={startNewConversation} className="w-full mb-4">
                        New Conversation
                    </Button>
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                        {conversations
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map((conv) => (
                                <Button
                                    key={conv.id}
                                    variant={conv.id === currentConversationId ? 'secondary' : 'ghost'}
                                    className={cn(
                                        'w-full justify-start mb-2 truncate',
                                        conv.id === currentConversationId && 'bg-muted'
                                    )}
                                    onClick={() => loadConversation(conv.id)}
                                >
                                    {conv.title}
                                </Button>
                            ))}
                    </ScrollArea>
                </div>
            </aside>

            {/* Mobile sidebar (Sheet) */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden fixed top-10 left-4 z-50">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-4 bg-card border-border">
                    <Button onClick={startNewConversation} className="w-full mb-4">
                        New Conversation
                    </Button>
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                        {conversations
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map((conv) => (
                                <Button
                                    key={conv.id}
                                    variant={conv.id === currentConversationId ? 'secondary' : 'ghost'}
                                    className={cn(
                                        'w-full justify-start mb-2 truncate',
                                        conv.id === currentConversationId && 'bg-muted'
                                    )}
                                    onClick={() => loadConversation(conv.id)}
                                >
                                    {conv.title}
                                </Button>
                            ))}
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            {/* Main chat area */}
            <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
                <Card className="flex-1 flex flex-col bg-card border-border">
                    <CardHeader className="border-b border-border">
                        <CardTitle className="text-center text-foreground">
                            Gemini Chatbot
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-6">
                        <ScrollArea className="flex-1 mb-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-muted-foreground mt-10">
                                    Start a conversation by typing a message below.
                                </div>
                            ) : (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            'mb-4 p-3 rounded-lg max-w-[80%]',
                                            msg.role === 'user'
                                                ? 'bg-primary/10 ml-auto'
                                                : 'bg-muted mr-auto'
                                        )}
                                    >
                                        <strong className="block mb-1 text-foreground">
                                            {msg.role === 'user' ? 'You' : 'Gemini'}:
                                        </strong>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {msg.parts.map((part) => part.text).join('')}
                                        </ReactMarkdown>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </ScrollArea>
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="flex-1 bg-background text-foreground border-input focus:ring-ring"
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {isLoading ? 'Sending...' : <Send className="h-5 w-5" />}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}