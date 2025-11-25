require("dotenv").config();
const express = require("express");
const router = express.Router();

router.post("/search", async (req, res) => {
  const { movieName, language } = req.body;

  if (!movieName)
    return res.status(400).json({ message: "Movie name required" });

  try {
    let allData = [];
    let nextUrl = `https://api.opensubtitles.com/api/v1/subtitles?query=${encodeURIComponent(
      movieName
    )}`;

    do {
      const response = await fetch(nextUrl, {
        headers: {
          "Api-Key": process.env.SUB_TOKEN,
          "User-Agent": process.env.SUB_USER_AGENT,
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("OpenSubtitles SEARCH error:", errText);
        return res
          .status(response.status)
          .json({ message: "Error fetching subtitles" });
      }

      const json = await response.json();
      allData = allData.concat(json.data || []);
      nextUrl = json.links?.next || null;
    } while (nextUrl);

    if (language && language !== "all") {
      allData = allData.filter((s) => s.attributes.language === language);
    }

    const cleaned = allData.map((item) => ({
      id: item.id,
      attributes: {
        language: item.attributes.language,
        release_name: item.attributes.release,
        download_count: item.attributes.download_count,
        uploader: item.attributes.uploader?.name || "Unknown",
        movie_title:
          item.attributes.feature_details?.title || item.attributes.release,
        movie_year: item.attributes.feature_details?.year,
        file_name: item.attributes.files?.[0]?.file_name || "",
        file_id: item.attributes.files?.[0]?.file_id || null,
        available_files: item.attributes.files
          ? item.attributes.files.length
          : 0,
      },
    }));

    return res.json({ subtitles: cleaned });
  } catch (err) {
    console.error("OpenSubtitles error:", err.message);
    return res.status(500).json({ message: "Error fetching subtitles" });
  }
});

router.post("/downloadSub", async (req, res) => {
  const { fileId } = req.body;

  if (!fileId) return res.status(400).json({ message: "fileId is required" });

  try {
    const response = await fetch(
      "https://api.opensubtitles.com/api/v1/download",
      {
        method: "POST",
        headers: {
          "Api-Key": process.env.SUB_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_id: fileId }),
      }
    );

    const data = await response.json();

    console.log("===== OpenSubtitles DOWNLOAD Response =====");
    console.dir(data, { depth: null });

    if (data.requests >= 5) {
      return res.json({
        success: false,
        message: "You have downloaded your allowed 5 subtitles for 24h",
      });
    }

    return res.json({
      success: true,
      downloadUrl: data.link,
    });
  } catch (err) {
    console.error("DOWNLOAD error:", err);
    return res.status(500).json({ message: "Download failed" });
  }
});

module.exports = router;
