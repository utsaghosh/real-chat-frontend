import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://localhost:8080";
// const WS_URL = "wss://echo.websocket.org";
// const WS_URL = "wss://websocket-echo.com/";

function App() {
  const [inputMessage, setInputMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const { sendMessage, lastMessage, lastJsonMessage, readyState } =
    useWebSocket(WS_URL, {
      onOpen: () => {
        console.log("WebSocket connection established.");
      },
      onClose: () => {
        console.log("WebSocket connection closed.");
      },
      onMessage: (event) => {
        console.log("Received message", event);
      },
      share: true,
      shouldReconnect: () => true,
      protocols: "echo-protocol",
    });

  // useEffect(() => {
  //   if (lastJsonMessage !== null) {
  //     console.log("lastJsonMessage: ", JSON.stringify(lastJsonMessage));
  //     setReceivedMessages([
  //       ...receivedMessages,
  //       JSON.stringify(lastJsonMessage.data),
  //     ]);
  //   }
  // }, [lastJsonMessage]);

  useEffect(() => {
    if (lastMessage !== null) {
      console.log("lastMessage: ", JSON.stringify(lastMessage));
      setReceivedMessages([
        ...receivedMessages,
        JSON.stringify(lastMessage.data),
      ]);
    }
  }, [lastMessage]);

  useEffect(() => {
    console.log("Connection state changed");
    if (readyState === ReadyState.OPEN) {
      sendMessage("connected");
    }
  }, [readyState]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="App">
      <div>
        <div>
          <h4>Messages:</h4>
          <ul>
            {receivedMessages?.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
        <div>
          {lastJsonMessage ? (
            <span>Last message: {lastJsonMessage.data}</span>
          ) : null}
        </div>
        <div>
          <br></br>
          <input
            type="text"
            id="inputmsg"
            placeholder="Enter your message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          ></input>
          <button
            onClick={() => sendMessage(inputMessage)}
            disabled={readyState !== ReadyState.OPEN}
          >
            Send
          </button>
        </div>
        <br />
        ReadyState: {connectionStatus}
        <br />
      </div>
    </div>
  );
}

export default App;
