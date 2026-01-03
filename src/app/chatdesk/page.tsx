"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Spinner } from "@/components/ui/spinner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const messages = [
  {
    role: "assistant",
    content: `Lorem Ipsum is simply dummy text of the printing and typesetting
industry. Lorem Ipsum has been the industry's standard dummy text ever since
the 1500s, when an unknown printer took a galley of type and scrambled it to
make a type specimen book. It has survived not only five centuries, but also
the leap into electronic typesetting, remaining essentially unchanged. It was
popularised in the 1960s with the release of Letraset sheets containing Lorem
Ipsum passages.`,
  },
  {
    role: "user",
    content: `Lorem Ipsum is simply dummy text of the printing and typesetting
industry. Lorem Ipsum has been the industry's standard dummy text ever since
the 1500s, when an unknown printer took a galley of type and scrambled it to
make a type specimen book. It has survived not only five centuries, but also
the leap into electronic typesetting, remaining essentially unchanged.`,
  },
  {
    role: "assistant",
    content: `export default function Page() { const [prompt, setPrompt] = useState("") const handleChange = (event: any) => { setPrompt(event.target.value); }; const sendButtonClicked = () => { const input: any = { role: "user", content: {prompt} } messages.push(input); console.log(messages); setPrompt("") } return ( <SidebarProvider> <AppSidebar /> <SidebarInset> <header className="flex h-14 shrink-0 items-center gap-2 sticky top-0 z-50 bg-neutral-950"> <div className="flex flex-1 items-center gap-2 px-3"> <SidebarTrigger /> <Separator orientation="vertical" className="mr-2 data-
`,
  },
  {
    role: "user",
    content: `Lorem Ipsum is simply dummy text of the printing and typesetting
industry. Lorem Ipsum has been the industry's standard dummy text ever since
the 1500s, when an unknown printer took a galley of type and scrambled it to
make a type specimen book. It has survived not only five centuries, but also
the leap into electronic typesetting, remaining essentially unchanged.`,
  },
];

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const handleChange = (event: any) => {
    setPrompt(event.target.value);
  };

  const sendButtonClicked = async () => {
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    const payload = {
      prompt: prompt,
    };
    const res = await axios.post("/api/users/gpt", payload);
    const gptResponse = res.data.message;
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: gptResponse },
    ]);
    setPrompt("");
  };

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 sticky top-0 z-50 bg-neutral-950">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Project Management & Task Tracking
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-3 py-4 max-w-4xl mx-auto flex flex-col gap-4"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`leading-6 rounded-xl p-4 ${
                  msg.role === "user"
                    ? "bg-neutral-900 max-w-2xl ml-auto whitespace-pre-wrap"
                    : "bg-neutral-950 max-w-4xl text-neutral-100"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return match ? (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                          ) : (
                            <code
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="mx-auto grid gap-4 w-full max-w-4xl sticky bottom-0 pb-5 dark:bg-neutral-950">
          <Textarea
            placeholder="Type your message here."
            className="dark:bg-neutral-850"
            value={prompt}
            onChange={handleChange}
          />
          <Button onClick={sendButtonClicked}>Send message</Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
