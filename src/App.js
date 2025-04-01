import React, { useMemo, useState } from "react";
import background from "./header.jpeg";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import ImageModal from "./ImageModal";
import ReactJson from 'react-json-view'
import Resizer from "react-image-file-resizer";

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

const App = React.memo(() => {

  const [image, setImage] = useState();
  const [imageFile, setImageFile] = useState();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [answer, setAnswer] = useState();
  const startButton = document.getElementById("start")
  const { transcript, resetTranscript } = useSpeechRecognition({
    continuous: true
  });

  function reset() {
    setImage(undefined);
    setImageFile(undefined);
    setAnswer("");
    setResponse("");
    resetTranscript();
  }

  async function sendRequest() {
    const formData = new FormData();
    setLoading(true);
    formData.append("file", imageFile);
    formData.append("question", transcript + "?");
    //var ans = "";
    const res = await fetch('https://predict-bc7ximz6ca-zf.a.run.app/predict', {
      method: "POST",
      body: formData
    }).then(response => {
      return response.json();
    });
    setLoading(false);
    let ans = Object.values(res)[0];
    //console.log(typeof res);
    //const object1 = JSON.parse(res);
    //console.log(res.map(class_name-0))
    //console.log(typeof response);
    console.log(ans);
    //console.log(Object.values(res)[0])
    //var ans = Object.values(res)[0];
    //console.log(Object.values(response.json())[0])
    //console.log(res)
    //console.log(response);
    //console.log(response.json())
    setResponse(res);
    setAnswer(ans);
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  return (
    <>
      <div style={{ maxHeight: '350px' }}>
        <img src={background} />
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col">
            <h2>Ahmed Nada VQA Project - University Of Washington Bothell</h2>
            <h3>Click below to upload a picture or use your camera to snap a picture</h3>
            <ImageModal setImage={setImage} setImageFile={setImageFile} />
            {image && (
              <img style={{ width: 600, height: 600 }} src={image} />
            )}
          </div>
        </div>
        <div className="row justify-content-center mt-2">
          <div className="col">
            <h3>Click start on the audio button to start recording your question, when done click stop</h3>
            <button disabled={!imageFile} id="start" onClick={SpeechRecognition.startListening} className="btn btn-primary">Start</button>
            <button onClick={SpeechRecognition.stopListening} className="btn btn-danger" style={{ marginLeft: '5px' }}>Stop</button>
            <button onClick={resetTranscript} className="btn btn-danger" style={{ marginLeft: '5px' }}>Reset</button>
             <p>{transcript + "?"}</p>
          </div>
        </div>
        <div className="row justify-content-center mt-2">
          <div className="col">
            <h3>Finally</h3>
            <button disabled={!imageFile || !transcript} onClick={sendRequest} className="btn btn-success">Send request</button>
            <button onClick={reset} className="btn btn-danger" style={{ marginLeft: '5px' }}>Reset</button>
          </div>
        </div>
        <div className="row justify-content-center mt-2">
          <div className="col">
            <h4>The answer is {answer}</h4>
          </div>
        </div>
        <div className="row justify-content-center mt-2">
          <div className="col">
            <h3>Expand the list below for the full list of classes</h3>
          </div>
        </div>
        <div className="row justify-content-center mt-2">
          <div className="col">
            {response && <ReactJson src={response} name={'List of Answers - top ten and last two'}  collapsed={true}/> }
          </div>
        </div>
      </div>
    </>
  );
});
export default App;
