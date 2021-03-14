import axios from "axios";
import React, { useState } from "react";
import "./App.css";

function App() {
  const [source, setSource] = useState(null);
  const [img, setImg] = useState(null);
  const [result, setResult] = useState(null);

  const handleCapture = (target) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newURL = URL.createObjectURL(file);
        setImg(newURL);
        setSource(file);
      }
    }
  };

  const kakaoOCR = () => {
    let form = new FormData();
    form.append("image", source);

    axios
      .post("https://dapi.kakao.com/v2/vision/text/ocr", form, {
        headers: {
          Authorization: "KakaoAK e2e76efe2b926e912bf4d8ed8879f5f2",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setResult(res.data.result[0].recognition_words[0]);
      })
      .catch((err) => {
        setResult(err.response.statusText);
      });
  };

  return (
    <>
      {source && (
        <div className="imageContainer">
          <img src={img} alt={"snap"} style={{ width: "100%" }}></img>
        </div>
      )}
      {source && <button onClick={kakaoOCR}>Detect</button>}
      <input
        accept="image/*"
        type="file"
        capture="environment"
        onChange={(e) => handleCapture(e.target)}
      />
      <div>{result}</div>
    </>
  );
}

export default App;
