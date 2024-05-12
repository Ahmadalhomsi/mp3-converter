import { NextResponse } from "next/server";
import axios from 'axios';



const youtubeApiUrl = 'https://youtube138.p.rapidapi.com/search/';
const youtubeApiHeaders = {
  'X-RapidAPI-Key': '5fdbd43c2emsh25cf5d3dfecc72bp146764jsn2f27995e5f8a',
  'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
};

export async function GET(){
  const response = await axios.get(youtubeApiUrl, {
    params: {
      q: 'legends never die',
      hl: 'en',
      gl: 'US'
    },
    headers: youtubeApiHeaders
  });
  const res = await response.data;
  const refinements = res.refinements; // "refinements" altındaki bilgileri çekiyoruz
  return NextResponse.json({data:refinements});
}


