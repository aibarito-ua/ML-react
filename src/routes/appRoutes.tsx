import HomePage from "../pages/home/HomePage";
import { RouteType } from "./config";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DocumentationPage from "../pages/documentation/DocumentationPage";
import LJDatasetPageLayout from "../pages/ljdataset/LJDatasetPageLayout";
import LJDatasetIndex from "../pages/ljdataset/LJDatasetIndex";
import NvidiaPretrainedPage from "../pages/ljdataset/NvidiaPretrainedPage";
import AibarTrainedTacotron1Page from "../pages/ljdataset/AibarTrainedTacotron1";
import AibarTrainedTacotron2Page from "../pages/ljdataset/AibarTrainedTacotron2";
import WebkitPage from "../pages/webkit/WebkitPage";
import GrammarlyPage from "../pages/grammarly/GrammarlyPage";
import GrammarlyPageLayout from "../pages/grammarly/GrammarlyPageLayout";
import MyCustomGrammarly from "../pages/grammarly/MyCustomGrammarly";
import GrammarlyIndex from "../pages/grammarly/GrammarlyIndex";
import AlpacaPage from "../pages/alpaca/AlpacaPage";

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
      {
        path: "/ljdataset/aibartrainedtacotron1",
        element: <AibarTrainedTacotron1Page />,
        state: "ljdataset.aibartrainedtacotron1",
        sidebarProps: {
          displayText: "AibarTrainedTacotron1",
        },
      },
      {
        path: "/ljdataset/aibartrainedtacotron2",
        element: <AibarTrainedTacotron2Page />,
        state: "ljdataset.aibartrainedtacotron2",
        sidebarProps: {
          displayText: "AibarTrainedTacotron2",
        },
      },
    ],
  },
  {
    path: "/webkit",
    element: <WebkitPage />,
    state: "webkit",
    sidebarProps: {
      displayText: "Webkit",
      icon: <ArticleOutlinedIcon />,
    },
  },
  {
    path: "/documentation",
    element: <DocumentationPage />,
    state: "documentation",
    sidebarProps: {
      displayText: "Documentation",
      icon: <ArticleOutlinedIcon />,
    },
  },
  {
    path: "/alpaca",
    element: <AlpacaPage />,
    state: "alpaca",
    sidebarProps: {
      displayText: "Alpaca",
      icon: <ArticleOutlinedIcon />,
    },
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
];

export default appRoutes;
