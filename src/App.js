import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://localhost:8080";

function App() {
  const [inputMessage, setInputMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    onClose: () => {
      console.log("WebSocket connection closed.");
    },
    share: true,
    filter: () => false,
    shouldReconnect: () => true,
    protocols: "echo-protocol",
  });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      console.log(JSON.stringify(lastJsonMessage.data));
      setReceivedMessages([
        ...receivedMessages,
        JSON.stringify(lastJsonMessage.data),
      ]);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    console.log("Connection state changed");
    if (readyState === ReadyState.OPEN) {
      sendMessage("connected");
    }
  }, [readyState]);

  return (
    <div className="App">
      <div>
        <h4>Messages:</h4>
        <ul>
          {receivedMessages.map((message, index) => {
            <li key={index}>{message}</li>;
          })}
        </ul>
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
        ReadyState: {readyState.toString()}
        <br />
      </div>
    </div>
  );
}

export default App;
