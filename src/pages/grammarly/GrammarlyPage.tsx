import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import React from "react";

type Props = {};

const GrammarlyPage = (props: Props) => {
  return (
    <GrammarlyEditorPlugin clientId="client_4Tgb6SbbonboqxRL4u78WN">
      <textarea />
    </GrammarlyEditorPlugin>
  );
};

export default GrammarlyPage;
