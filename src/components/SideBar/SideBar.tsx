import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

const LOCAL_STORAGE_KEY_PREFIX = 'chatMessages_';

const getChatTitlesFromLocalStorage = (fileList: { id: string; name: string }[]) => {
    const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(LOCAL_STORAGE_KEY_PREFIX)
    );

    return keys.map((key) => {
        const id = key.replace(LOCAL_STORAGE_KEY_PREFIX, '');
        const file = fileList.find((file) => file.id === id);
        return { id: key, name: file ? file.name : 'Untitled' };
    });
};

export const Sidebar: React.FC<{ fileList: { id: string; name: string }[]; onSelectChat: (id: string) => void }> = ({ fileList, onSelectChat }) => {

    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [chats, setChats] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const loadedChats = getChatTitlesFromLocalStorage(fileList);
        setChats(loadedChats);
    }, [fileList]);

    return (
        <div className="w-1/4 flex flex-col h-full border-r border-gray-700">
            <div className="p-4 border-b border-gray-700 mt-3 text-center">
                <h1 className="text-2xl font-semibold">Chat History</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-2   mt-8">
                <ul className="space-y-2">
                    {chats.length === 0 ? (
                        <li className="p-2 text-gray-400">No Chats Available</li>
                    ) : (
                        chats.map((chat) => (
                            <li
                                key={chat.id}
                                className={clsx(
                                    'p-2 rounded cursor-pointer hover:bg-gray-300 transition',
                                    activeChat === chat.id ? 'bg-gray-300' : 'bg-gray-100'
                                )}
                                onClick={() => {
                                    setActiveChat(chat.id);
                                    onSelectChat(chat.id);
                                }}
                            >
                                {chat.name}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};
