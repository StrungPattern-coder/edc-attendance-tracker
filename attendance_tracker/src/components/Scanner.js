import React from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Scanner = () => {
  const startScanner = () => {
    const scanner = new Html5QrcodeScanner("scanner", { fps: 10, qrbox: 250 });
    scanner.render((decodedText) => {
      console.log(`Scanned code: ${decodedText}`);
      scanner.clear();
    });
  };

  return (
    <div>
      <h1>QR/Barcode Scanner</h1>
      <div id="scanner" style={{ width: "100%" }}></div>
      <button onClick={startScanner}>Start Scanner</button>
    </div>
  );
};

export default Scanner;