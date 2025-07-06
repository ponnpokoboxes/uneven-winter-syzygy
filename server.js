import queryString from "query-string";
import { createCanvas, Image } from "canvas";
import fs from "node:fs";
/*import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "pdfjs-dist/legacy/build/pdf.worker.mjs";*/
import http from "http";
/*import getSystemFonts from "get-system-fonts";
import { spawn } from "node:child_process";
import path from "path";*/
import fetch from "node-fetch";

console.log("hello");

http
  .createServer(async function (req, res) {
    if (req.method == "POST") {
      var data = "";
      req.on("data", function (chunk) {
        data += chunk;
      });
      req.on("end", async function () {
        if (!data) {
          console.log("No post data");
          res.end();
          return;
        }
        var dataObject = queryString.parse(data);
        console.log("post:" + dataObject.type);
        if (dataObject.type == "wake") {
          console.log("Woke up in post");
          res.end();
          return;
        }
        res.end();
        if (dataObject.type == "svgToPng") {
          let resSvg = await svgToPng(dataObject);
          /*console.log("resSvg", resSvg);*/
          res.end(JSON.stringify(resSvg));
          return;
        }
        res.end();
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord Bot is active now\n");
    }
  })
  .listen(process.env.PORT);

async function svgToPng(dataObject) {
  /*try{*/ let res = await svgToPng1(dataObject);
  console.log("ABA");
  /*console.log("resIs", res.png, res.title);*/
  let res2 = await fetching1(process.env.uri1, { resIs: res });
  console.log("res2", res2);
  return { resIs: res }; /*}catch(e){return {"resIs": "ERR" + String(e)};}*/
}

//処理
async function svgToPng1(dataObject) {
  const base64 = dataObject.svg,
    title = dataObject.title,
        toward = dataObject.toward, mes = dataObject.mes;
  console.log("title", title /*, "base64", base64*/);

  //canvasに描く
  const img = new Image();
  img.src = String(base64);
  console.log("img-wh", img.width, img.height);
  const canvas = createCanvas(img.width, img.height);
  let ctx = canvas.getContext("2d");
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.onerror = (err) => {
    throw err;
  };
  img.src = String(base64);

  //画像を取り出す
  const buf = canvas.toBuffer();
  const res = Buffer.from(buf).toString("base64");

  /*console.log("res", res);*/

  return { toward: toward, mes: mes, title: String(title) + ".png", png: res };
}

//上の続き。空き状況を確認する
async function fetching1(uri, okuruJson) {
  /*try {*/
    /*console.log(okuruJson);*/
    const res = await fetch(uri, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(okuruJson),
    });
    const kekka = await res.json();
    const strings = await JSON.parse(JSON.stringify(kekka));
    const data = strings["result"];
    /*console.log("data: ", data);*/
    return data;
  /*} catch (error) {
    console.log(error);
    return "APIエラーでは？";
  }*/
}