import HomePage from "../pages/home/HomePage";
import { RouteType } from "./config";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LJDatasetPageLayout from "../pages/ljdataset/LJDatasetPageLayout";
import LJDatasetIndex from "../pages/ljdataset/LJDatasetIndex";
import NvidiaPretrainedPage from "../pages/ljdataset/NvidiaPretrainedPage";
import GrammarlyPage from "../pages/grammarly/GrammarlyPage";
import GrammarlyPageLayout from "../pages/grammarly/GrammarlyPageLayout";
import MyCustomGrammarly from "../pages/grammarly/MyCustomGrammarly";
import GrammarlyIndex from "../pages/grammarly/GrammarlyIndex";
import AlpacaPage from "../pages/alpaca/AlpacaPage";
import AlpacaPageLayout from "../pages/alpaca/AlpacaPageLayout";
import AlpacaIndex from "../pages/alpaca/AlpacaIndex";
import AlpacaPdf from "../pages/alpaca/AlpacaPdf";
import Vicuna from "../pages/vicuna-gptx4/VicunaPrompt";
import VicunaIndex from "../pages/vicuna-gptx4/VicunaIndex";
import VicunaPageLayout from "../pages/vicuna-gptx4/VicunaPageLayout";
import VicunaPDF from "../pages/vicuna-gptx4/VicunaPdf";
import Vicuna7BPageLayout from "../pages/vicuna7b/Vicuna7BPageLayout";
import Vicuna7BIndex from "../pages/vicuna7b/Vicuna7BIndex";
import Vicuna7bMemoryPrompt from "../pages/vicuna7b/MemoryPrompt";
import Vicuna7bPdfPrompt from "../pages/vicuna7b/PdfPrompt";
import OpenAIPdf from "../pages/vicuna7b/OpenAIPdf";
import OpenAIPDFPrompt from "../pages/vicuna7b/OpenAIPdfPrompt";
import PlainPrompt from "../pages/vicuna7b/PlainPrompt";
import ChatWindow from "../pages/vicuna7b/ChatWindow";
import PromptIndex from "../pages/vicuna7b/PromptIndex";
import PromptsPageLayout from "../pages/vicuna7b/PromptsPageLayout";


const appRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    state: "home",
  },
  {
    path: "/ljdataset",
    element: <LJDatasetPageLayout />,
    state: "ljdataset",
    sidebarProps: {
      displayText: "LJDataset",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <LJDatasetIndex />,
        state: "ljdataset.index",
      },
      {
        path: "/ljdataset/nvidiapretrained",
        element: <NvidiaPretrainedPage />,
        state: "ljdataset.nvidiapretrained",
        sidebarProps: {
          displayText: "NvidiaPretrained",
        },
      },
    ],
  },
  {
    path: "/alpaca",
    element: <AlpacaPageLayout />,
    state: "alpaca",
    sidebarProps: {
      displayText: "Alpaca",
      icon: <ArticleOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <AlpacaIndex />,
        state: "alpaca.index",
      },
      {
        path: "/alpaca/chat",
        element: <AlpacaPage />,
        state: "alpaca.chat",
        sidebarProps: {
          displayText: "Alpaca-7b Chatbot",
        },
      },
      {
        path: "/alpaca/pdf",
        element: <AlpacaPdf />,
        state: "alpaca.pdf",
        sidebarProps: {
          displayText: "Alpaca-7b Pdf",
        },
      },
    ],
  },
  {
    path: "/grammarly",
    element: <GrammarlyPageLayout />,
    state: "grammarly",
    sidebarProps: {
      displayText: "Grammarly",
      icon: <ArticleOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <GrammarlyIndex />,
        state: "grammarly.index",
      },
      {
        path: "/grammarly/dev",
        element: <GrammarlyPage />,
        state: "grammarly.dev",
        sidebarProps: {
          displayText: "Grammarly for developers",
        },
      },
      {
        path: "/grammarly/custom",
        element: <MyCustomGrammarly />,
        state: "grammarly.custom",
        sidebarProps: {
          displayText: "My custom Grammarly",
        },
      },
    ],
  },
  {
    path: "/chatting",
    element: <Vicuna7BPageLayout />,
    state: "chatting",
    sidebarProps: {
      displayText: "Langchain + LLM",
      icon: <ArticleOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <Vicuna7BIndex />,
        state: "chatting.index",
      },
      // {
      //   path: "/chatting/plain",
      //   element: <Vicuna7B/>,
      //   state: "chatting.plain",
      //   sidebarProps: {
      //     displayText: "Vicuna 13B",
      //   },
      // },
      {
        path: "/chatting/window",
        element: <ChatWindow />,
        state: "chatting.window",
        sidebarProps: {
          displayText: "Chat Window",
        },
      },
      {
        path: "/chatting/prompts",
        element: <PromptsPageLayout />,
        state: "chatting.prompts",
        sidebarProps: {
          displayText: "Prompts",
        },
        child:[
          {
            index: true,
            element: <PromptIndex/>,
            state: "chatting.prompts.index"
          },
          {
            path: "/chatting/prompts/plain/prompt",
            element: <PlainPrompt />,
            state: "chatting.prompts.plain.prompt",
            sidebarProps: {
              displayText: "Plain Prompt",
            },
          },
          {
            path: "/chatting/prompts/pdf/prompt",
            element: <Vicuna7bPdfPrompt />,
            state: "chatting.prompts.pdf.prompt",
            sidebarProps: {
              displayText: "PDF Prompt",
            },
          },
          {
            path: "/chatting/prompts/memory/prompt",
            element: <Vicuna7bMemoryPrompt />,
            state: "chatting.prompts.memory.prompt",
            sidebarProps: {
              displayText: "Memory Prompt",
            },
          },
        ]
      }
      // {
      //   path: "/chatting/openai/pdf",
      //   element: <OpenAIPdf/>,
      //   state: "chatting.openai.pdf",
      //   sidebarProps: {
      //     displayText: "Open AI pdf",
      //   },
      // },
      // {
      //   path: "/chatting/openai/pdf/prompt",
      //   element: <OpenAIPDFPrompt />,
      //   state: "chatting.openai.pdf.prompt",
      //   sidebarProps: {
      //     displayText: "Open AI pdf Prompt",
      //   },
      // },
    ],
  },
];

export default appRoutes;
