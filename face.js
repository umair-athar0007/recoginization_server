const express = require('express');
const router = express.Router();
const Face = require('./mongoomodels/faceModel');
const { compareDescriptors, getFaceDescriptor , loadModels} = require("./faceHelper")



router.post('/add_face_record', async (req, res) => {
  try {
    const { faceImageUrl, password } = req.body;

    if (!password || !faceImageUrl) {
      return res.status(400).json({ message: 'Invalid feilds' });
    }

    const newRecord = new Face({ faceImageUrl, password });
    await newRecord.save();

    res.json({ message: 'face record added', newRecord });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add face record', error: error.message });
  }
});



router.post("/compare_face", async (req, res) => {
  try {
    const { faceImageUrl } = req.body
    if (!faceImageUrl) {
      return res.status(400).json({ message: 'Invalid feilds' });

    }
    await loadModels();
   
    const allfacesRecord = await Face.find();
    if (!allfacesRecord || allfacesRecord.length == 0) {
      return res.status(404).json({ message: "faces Record not found" })
    }
    const inputRecord = await getFaceDescriptor(faceImageUrl);

    let matchFound = false;
    let thisuser = null;
    for (const singleRecord of allfacesRecord) {
      const existingRecord = await getFaceDescriptor(singleRecord.faceImageUrl);
      const faceMatch = compareDescriptors(inputRecord, existingRecord);
      if (faceMatch) {
        thisuser = singleRecord
        matchFound = true;
        break;
      }
    }
    console.log(matchFound)
    if (matchFound && thisuser) {
      console.log("Match found");

      return res.status(200).json({ message: "record found", matchFound, password: thisuser.password })
    } else {
      console.log("No match found");
      return res.status(200).json({ message: "record not found", matchFound })
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(200).json({ error: error.message })
  }
})


module.exports = router;