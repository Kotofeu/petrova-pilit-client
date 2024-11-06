import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

import Message, { MessageType } from '../../../UI/Message/Message';
import classes from './MessageContext.module.scss'
import { AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface Message {
    id: string;
    text: string;
    type: MessageType;
}

interface MessageContextType {
    addMessage: (text: string, type: MessageType) => void;
}
const LIVE_TIME = 3000
const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const addMessage = (text: string, type: MessageType) => {
        const id =  uuidv4();
        setMessages((prev) => [...prev, { id, text, type }]);

        setTimeout(() => {
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
        }, LIVE_TIME);
    };

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    return (
        <MessageContext.Provider value={{ addMessage }}>
            {children}
            <div className={classes.messageProvider} ref={messageContainerRef}>
                <div className={classes.messageProvider__inner}>
                    <AnimatePresence mode='sync'>
                        {messages.map((msg) => (
                            <Message
                                className={classes.messageProvider__message}
                                key={msg.id}
                                text={msg.text}
                                type={msg.type}
                                onClose={() => setMessages((prev) => prev.filter(m => m.id !== msg.id))}
                            />
                        ))}
                    </AnimatePresence>

                </div>
            </div>
        </MessageContext.Provider>
    );
};