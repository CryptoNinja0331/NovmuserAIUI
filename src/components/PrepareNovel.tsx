"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import prepareImage from "../assets/images/writter.svg";
import { useEffect, useState } from "react";
import AgentUi from "./AgentUi";
import { useAuth } from "@clerk/nextjs";
import { clientApi } from "@/lib/apiCall/client/clientAPi";

import { useDispatch } from "react-redux";
import React from "react";
import useClientHttp from "@/hooks/useClientHttp";
import { TResponseDto } from "@/lib/http";
import { TNovelPreparingTask } from "@/lib/types/api/novel";

interface PrepareNovelResponse {
  success: boolean;
  // Add other properties of the response object here
}

const PrepareNovel: React.FC<{ novelId: string }> = ({ novelId }) => {
  const [prepareNovel, setPrepareNovel] = useState<PrepareNovelResponse | null>(
    null
  );
  const [finishedPrepare, setFinishedPrepare] = useState<boolean>(false);
  const [novelMsg, setNovelMsg] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  const { isLoaded, getToken } = useAuth();

  const websocketRef = React.useRef<WebSocket | null>(null);

  useEffect(() => {
    const socketUrl = `${process.env.NEXT_PUBLIC_WS_SERVER_URL}/novel/preparing/${novelId}/ws`;

    async function getAuthToken() {
      if (!isLoaded) {
        return null;
      }
      const token = await getToken({ template: "UserToken" });
      return token;
    }

    async function connectWebSocket() {
      const authToken = await getAuthToken();
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
        setFinishedPrepare(true);
      };

      newWebsocket.onmessage = (event) => {
        console.log(event.data);
        setNovelMsg(event.data);
      };

      newWebsocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newWebsocket.onclose = () => {
        console.log("WebSocket connection closed");
        setFinishedPrepare(false);
      };
    }

    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [isLoaded, getToken, novelId]);

  return (
    <div className="text-white p-4">
      {prepareNovel?.success ? (
        <AgentUi finishedPrepare={finishedPrepare} novelMsg={novelMsg} />
      ) : (
        <div>
          <Image
            className="mx-auto"
            style={{ width: "36%" }}
            src={prepareImage}
            alt="prepare image "
          />
          <div className="text-center mt-8">
            <MemorizedPrepareButton
              setPrepareNovel={setPrepareNovel}
              novelId={novelId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PrepareNovel;

const PrepareButton: React.FC<{
  setPrepareNovel: (data: any) => void;
  novelId: string;
}> = ({ setPrepareNovel, novelId }) => {
  const dispatch = useDispatch();

  const { post } = useClientHttp();

  React.useEffect(() => {
    // Prevent calling api all the time
    dispatch(clientApi.util.invalidateTags(["novelData"]));
  }, [dispatch]);

  const { isLoaded, getToken } = useAuth();

  const handlePrepareNovel = React.useCallback(async () => {
    console.log("🚀 ~ handlePrepareNovel ~ handlePrepareNovel");
    const userToken = await getToken({ template: "UserToken" });
    try {
      const respDto = await post<TResponseDto<any>>({
        url: `/novel/prepare/${novelId}/task`,
        config: {
          headers: {
            "Content-Type": "application/json",
          },
        },
        token: userToken,
      });
      setPrepareNovel(respDto);
    } catch (error) {
      console.error("Error:", error);
      // Handle errors, e.g., show an error message to the user
    }
  }, [getToken, novelId, post, setPrepareNovel]);

  console.log("🚀 ~ PrepareButton:", "rendering");

  return (
    <Button className="bg-bluish" onClick={handlePrepareNovel}>
      Prepare Novel
    </Button>
  );
};

const MemorizedPrepareButton = React.memo(PrepareButton);
