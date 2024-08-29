import { ChatMessages } from '@/components/ChatMessages'
import { MessageBar } from '@/components/MessageBar'
import { Search } from '@/components/Search'
import { Sidebar } from '@/components/SideBar/SideBar'
import { ChatLayout } from '@/layouts/ChatLayout/Chat.layout'
import { useSearch } from '@/queries/useSearch'
import { ApiChatMessage, chatApi } from '@/services/api'
import { populateDirs } from '@/utils/populateDirs.util'
import React, { useEffect, useMemo, useState } from 'react'

export type HomePageProps = React.HTMLProps<HTMLDivElement>

const LOCAL_STORAGE_KEY_PREFIX = 'chatMessages_';

const saveMessagesToLocalStorage = (messages: ApiChatMessage[], selectedFilesId: string) => {
  localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${selectedFilesId}`, JSON.stringify(messages));
};

const loadMessagesFromLocalStorage = (selectedFilesId: string): ApiChatMessage[] => {
  const storedMessages = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${selectedFilesId}`);
  return storedMessages ? JSON.parse(storedMessages) : [];
};

export const HomePage: React.FC<HomePageProps> = ({ className, ...props }) => {
  const [query, setQuery] = useState('')
  const [prompt, setPrompt] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [messages, setMessages] = useState<ApiChatMessage[]>([])
  const [generating, setGenerating] = useState(false)

  const search = useSearch(
    { query },
    {
      cacheTime: 0,
      enabled: false,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const fileList = useMemo(
    () => populateDirs(search.data?.files || []),
    [search.data],
  )

  const onSearch = async () => {
    search.refetch()
  }

  const onPrompt = async (prompt: string) => {

    setGenerating(true)

    setMessages((prevMessages) => {
      const updatedMessages: ApiChatMessage[] = [
        ...prevMessages,
        {
          role: 'user',
          message: prompt,
        },
      ];
      saveMessagesToLocalStorage(updatedMessages, selectedFiles[0]);
      return updatedMessages;
    });

    const { message } = await chatApi({
      prompt,
      files: fileList.filter((f) => selectedFiles.includes(f.id)),
      history: messages,
    })
    console.log(selectedFiles)
    setGenerating(false)
    setMessages((prevMessages) => {
      const updatedMessages: ApiChatMessage[] = [
        ...prevMessages,
        message,
      ];
      saveMessagesToLocalStorage(updatedMessages, selectedFiles[0]);
      return updatedMessages;
    });
    setPrompt('')
  }

  const handleChatSelection = (id: string) => {
    search.refetch()
    const newId = id.slice(13, id.length)
    setSelectedFiles([newId])
    const savedMessages = loadMessagesFromLocalStorage(id);
    setMessages(savedMessages);
  };

  useEffect(() => {
    if (selectedFiles) {
      const savedMessages = loadMessagesFromLocalStorage(selectedFiles[0]);
      setMessages(savedMessages);
    }
  }, [selectedFiles]);

  useEffect(() => {
    setSelectedFiles([])
  }, [search.data])

  useEffect(() => {
    onSearch()
  }, [])

  return (
    <ChatLayout
      sideBar={<Sidebar fileList={fileList} onSelectChat={handleChatSelection} />}
      messageBar={
        <MessageBar
          hide={selectedFiles.length === 0}
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmit={(prompt) => onPrompt(prompt)}
          loading={generating}
          disabled={generating}
        />
      }
    >
      <Search
        compact={messages.length > 0}
        searching={search.isFetching}
        query={query}
        onQueryChange={(v) => setQuery(v)}
        onSearch={onSearch}
        results={fileList}
        onSelect={(selected) => { setSelectedFiles(selected) }}
        selectedFiles={selectedFiles}
      />
      <ChatMessages
        className="py-[20px]"
        data={messages.map((msg) => ({
          role: msg.role,
          message: msg.message,
        }))}
      />
    </ChatLayout>
  )
}
