import axios from "axios";
import React, { useState } from "react";
import "./App.css";

function App() {
  const [source, setSource] = useState(null);
  const [img, setImg] = useState(null);
  const [result, setResult] = useState(null);

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  function getThumbFile(image, file) {
    var canvas = document.createElement("canvas");
    var comp_size = 102400; //100KB (썸네일 작업 결과물 사이즈, 50~200KB 수준으로 압축됨)
    var width = image.width;
    var height = image.height;
    var size = file.size;

    var ratio = Math.ceil(Math.sqrt(size / comp_size, 2));
    width = image.width / ratio;
    height = image.height / ratio;
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(image, 0, 0, width, height);
    var tmpThumbFile = dataURItoBlob(canvas.toDataURL("image/png")); //dataURLtoBlob 부분은 이전 포스팅 참조

    return tmpThumbFile;
  }

  const handleCapture = (target) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];

        if (file.size > 2000000) {
          let fReader = new FileReader();
          fReader.readAsDataURL(file);
          fReader.onload = (e) => {
            let img = new Image();
            img.src = fReader.result;
            img.onload = function () {
              let thumbFile = getThumbFile(img, file);
              setSource(thumbFile);
            };
          };
        } else {
          setSource(file);
        }

        const newURL = URL.createObjectURL(file);
        setImg(newURL);
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
        console.log(res);
        setResult(
          res.data.result.map((el) => {
            return el.recognition_words[0];
          })
        );
      })
      .catch((err) => {
        setResult(err.response.statusText);
        console.log(err.response);
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
