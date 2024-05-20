// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  let pincodes={
    "462022":["Bhopal","Madhya Pradesh"],
    "474005":["Gwalior","Madhya Pradesh"],
    "560017":["Bangalore","Karnataka"],
    "110003":["Delhi","Delhi"],
  }
    res.status(200).json(pincodes);
  }
  