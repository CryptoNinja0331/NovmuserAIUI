"use client";

import { clientApi } from "@/lib/apiCall/client/clientAPi";
import Image from "next/image";
import { useEffect, useState } from "react";
import prepareImage from "../assets/images/writter.svg";
import AgentUi from "./AgentUi";
import { Button } from "./ui/button";

import useClientHttp from "@/hooks/useClientHttp";
import { useGetClientToken } from "@/lib/hooks";
import { TResponseDto } from "@/lib/http";
import React from "react";
import { useDispatch } from "react-redux";
import BalanceNotEnoughAlert from "./alert/BalanceNotEnoughAlert";
import emitter from "@/lib/emitters";

const PrepareButton: React.FC<{
  novelId: string;
  onSuccess?: () => void;
}> = ({ novelId, onSuccess }) => {
  const dispatch = useDispatch();

  const { post } = useClientHttp();

  React.useEffect(() => {
    // Prevent calling api all the time
    dispatch(clientApi.util.invalidateTags(["novelData"]));
  }, [dispatch]);

  const { getClientToken } = useGetClientToken();

  const handlePrepareNovel = React.useCallback(async () => {
    console.log("🚀 ~ handlePrepareNovel ~ handlePrepareNovel");
    try {
      const respDto = await post<TResponseDto<void>>({
        url: `/novel/prepare/${novelId}/task`,
        config: {
          headers: {
            "Content-Type": "application/json",
          },
        },
        token: await getClientToken(),
      });
      if (respDto.success) {
        onSuccess?.();
        emitter.emit("novelItem-interval", novelId);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle errors, e.g., show an error message to the user
    }
  }, [getClientToken, novelId, onSuccess, post]);

  console.log("🚀 ~ PrepareButton:", "rendering");

  return (
    <>
      <Button className="bg-bluish" onClick={handlePrepareNovel}>
        Prepare Novel
      </Button>
    </>
  );
};

const MemorizedPrepareButton = React.memo(PrepareButton);

export type TPreparePage = "submitPrepare" | "agentProcess";

export type TPrepareNovelProps = {
  novelId: string;
  initialPage?: TPreparePage;
};

const PrepareNovel: React.FC<TPrepareNovelProps> = ({
  novelId,
  initialPage = "submitPrepare",
}) => {
  const [curPage, setCurPage] = useState<TPreparePage>(initialPage);

  const [finishedPrepare, setFinishedPrepare] = useState<boolean>(false);
  const [novelMsg, setNovelMsg] = useState<string>("");

  const { getClientToken } = useGetClientToken();

  const websocketRef = React.useRef<WebSocket | null>(null);

  useEffect(() => {
    const socketUrl = `${process.env.NEXT_PUBLIC_WS_SERVER_URL}/novel/preparing/${novelId}/ws`;

    async function connectWebSocket() {
      const authToken = await getClientToken();
      if (!authToken) {
        console.error("Failed to obtain auth token");
        return;
      }

      if (websocketRef.current) {
        // Prevent connect websocket multple times
        return;
      }

      const newWebsocket = new WebSocket(socketUrl, [authToken]);
      websocketRef.current = newWebsocket;

      newWebsocket.onopen = () => {
        console.log("WebSocket connection opened");
        setFinishedPrepare(false);
      };

      newWebsocket.onmessage = (event) => {
        console.log("🚀 ~ connectWebSocket ~ event.data:", event.data);
        setNovelMsg(event.data);
      };

      newWebsocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newWebsocket.onclose = () => {
        console.log("WebSocket connection closed");
        setFinishedPrepare(true);
      };
    }

    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [novelId, getClientToken]);

  const handlePrepareSuccess = React.useCallback(() => {
    setCurPage("agentProcess");
  }, []);

  return (
    <div className="text-white p-4">
      {curPage === "submitPrepare" ? (
        <div>
          <Image
            className="mx-auto"
            style={{ width: "36%" }}
            src={prepareImage}
            alt="prepare image "
          />
          <div className="text-center mt-8">
            <MemorizedPrepareButton
              novelId={novelId}
              onSuccess={handlePrepareSuccess}
            />
          </div>
        </div>
      ) : (
        <AgentUi finishedPrepare={finishedPrepare} novelMsg={novelMsg} />
      )}
      <BalanceNotEnoughAlert />
    </div>
  );
};

export default React.memo(PrepareNovel);
