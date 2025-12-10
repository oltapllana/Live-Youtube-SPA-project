// --- CONFIG ---
const DEFAULT_INSTANCE_URL = ""; // put your JSON URL here later

// Extract 11-char YouTube ID from full link
function extractVideoId(url) {
  if (!url) return null;

  // Already an ID?
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.has("v")) return u.searchParams.get("v");

      // youtube.com/embed/ID
      const parts = u.pathname.split("/");
      return parts[parts.length - 1];
    }
  } catch (e) {}

  // fallback
  const match = url.match(/[a-zA-Z0-9_-]{11}/);
  return match ? match[0] : null;
}

// --- UI refs ---
const statusEl = document.getElementById("status");
const infoEl = document.getElementById("programInfo");
const playerContainer = document.getElementById("playerContainer");
const placeholder = document.getElementById("playerPlaceholder");
const inputUrl = document.getElementById("instanceUrl");
const loadBtn = document.getElementById("loadBtn");
const miniGuide = document.getElementById("miniGuide");
const channelSelect = document.getElementById("channelSelect");

inputUrl.value = DEFAULT_INSTANCE_URL;

let instanceData = null;
let timeline = [];
let fullTimeline = []; // Store all programs
let currentProgram = null;
let iframeEl = null;
let tickTimer = null;
let selectedChannel = "all"; // Default: show all channels

// Auto-load on page load
window.addEventListener("DOMContentLoaded", () => {
  loadInstance("auto");
});

// Load schedule button
loadBtn.addEventListener("click", () => {
  const url = inputUrl.value.trim();
  if (!url) return alert("Please enter the JSON URL.");
  loadInstance(url);
});

// Fetch JSON
async function loadInstance(url) {
  clearInterval(tickTimer);
  statusEl.textContent = "Loading...";

  try {
    // Skip fetch if auto-loading, use built-in data
    if (url !== "auto") {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
    }

    // Get current time in seconds, convert to "minutes" (10 sec = 1 "minute")
    const now = new Date();
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const currentMinutes = Math.floor(currentSeconds / 10); // Every 10 seconds = 1 "minute"
    
    // Create staggered time slots so videos change every 10 seconds
    const video1Start = currentMinutes - 1;
    const video1End = currentMinutes + 1; // 10 sec duration
    
    const video2Start = currentMinutes + 1;
    const video2End = currentMinutes + 2; // 10 sec duration
    
    const video3Start = currentMinutes + 2;
    const video3End = currentMinutes + 3; // 10 sec duration
    
    const video4Start = currentMinutes + 3;
    const video4End = currentMinutes + 4; // 10 sec duration
    
    const video5Start = currentMinutes + 4;
    const video5End = currentMinutes + 100; // Rest of period
    
    instanceData = {
  "opening_time": 0,
  "closing_time": 713,
  "min_duration": 30,
  "max_consecutive_genre": 2,
  "channels_count": 50,
  "switch_penalty": 3,
  "termination_penalty": 15,
  "priority_blocks": [
    {
      "start": 419,
      "end": 554,
      "allowed_channels": [
        32,
        7,
        42,
        48,
        28,
        39,
        21,
        44,
        43,
        1,
        45,
        22,
        16,
        2,
        40,
        12,
        30
      ]
    },
    {
      "start": 912,
      "end": 713,
      "allowed_channels": [
        26,
        3,
        33,
        23,
        18,
        39,
        19,
        24,
        17,
        13,
        30,
        25,
        21,
        48,
        47,
        35,
        0,
        31,
        34,
        2,
        5,
        28
      ]
    },
    {
      "start": 1125,
      "end": 713,
      "allowed_channels": [
        38,
        31,
        16,
        33,
        0,
        48,
        18,
        34,
        28,
        12,
        2,
        14,
        39,
        40,
        24,
        23,
        29,
        13,
        47,
        10,
        27,
        26,
        32,
        36,
        17,
        6,
        3,
        15,
        30,
        45
      ]
    }
  ],
  "time_preferences": [
    {
      "start": 0,
      "end": 534,
      "preferred_genre": "news",
      "bonus": 79
    },
    {
      "start": 534,
      "end": 713,
      "preferred_genre": "kids",
      "bonus": 43
    },
    {
      "start": 713,
      "end": 713,
      "preferred_genre": "drama",
      "bonus": 29
    },
    {
      "start": 713,
      "end": 713,
      "preferred_genre": "gaming",
      "bonus": 41
    },
    {
      "start": 713,
      "end": 713,
      "preferred_genre": "drama",
      "bonus": 105
    },
    {
      "start": 713,
      "end": 713,
      "preferred_genre": "talk",
      "bonus": 56
    }
  ],
  "channels": [
    {
      "channel_id": 0,
      "channel_name": "LIVE Stream 1",
      "programs": [
        {
          "program_id": "L_CH0_P0",
          "start": 838,
          "end": 1200,
          "genre": "talk",
          "score": 92,
          "link": "https://www.youtube.com/watch?v=D1-1dkbuMzA"
        },
        {
          "program_id": "L_CH0_P1",
       "start": 120,          
       "end": 225,
          "genre": "news",
          "score": 72,
          "link": "https://www.youtube.com/watch?v=NMGFPFmXaIM"
        },
        {
          "program_id": "L_CH0_P2",
          "start": 225,
          "end": 296,
          "genre": "news",
          "score": 50,
          "link": "https://www.youtube.com/watch?v=NMGFPFmXaIM"
        },
        {
          "program_id": "L_CH0_P3",
          "start": 296,
          "end": 367,
          "genre": "drama",
          "score": 83,
          "link": "https://www.youtube.com/watch?v=r-OnllV45UM"
        },
        {
          "program_id": "L_CH0_P4",
          "start": 367,
          "end": 443,
          "genre": "kids",
          "score": 89,
          "link": "https://www.youtube.com/watch?v=ZBvsPCIJluU"
        }
      ]
    },
    {
      "channel_id": 1,
      "channel_name": "LIVE Stream 2",
      "programs": [
        {
          "program_id": "L_CH1_P0",
          "start": 0,
          "end": 120,
          "genre": "news",
          "score": 79,
          "link": "https://www.youtube.com/watch?v=Fq3Q3gEsFgo"
        },
        {
          "program_id": "L_CH1_P1",
          "start": 729,
          "end": 736,
          "genre": "sports",
          "score": 64,
          "link": "https://www.youtube.com/watch?v=q0ELFEzFEDg"
        },
        {
          "program_id": "L_CH1_P2",
          "start": 736,
          "end": 738,
          "genre": "news",
          "score": 50,
          "link": "https://www.youtube.com/watch?v=YQT-BZr5pp0"
        },
        {
          "program_id": "L_CH1_P3",
          "start": 738,
          "end": 810,
          "genre": "news",
          "score": 62,
          "link": "https://www.youtube.com/watch?v=CfLSE8zGRww"
        },
        {
          "program_id": "L_CH1_P4",
          "start": 840,
          "end": 941,
          "genre": "news",
          "score": 66,
          "link": "https://www.youtube.com/watch?v=Fq3Q3gEsFgo"
        }
      ]
    },
    {
      "channel_id": 2,
      "channel_name": "LIVE Stream 3",
      "programs": [
        {
          "program_id": "L_CH2_P0",
          "start": 0,
          "end": 138,
          "genre": "music",
          "score": 63,
          "link": "https://www.youtube.com/watch?v=tie93s2lQuM"
        },
        {
          "program_id": "L_CH2_P1",
          "start": 138,
          "end": 292,
          "genre": "talk",
          "score": 82,
          "link": "https://www.youtube.com/watch?v=D1-1dkbuMzA"
        },
        {
          "program_id": "L_CH2_P2",
          "start": 292,
          "end": 443,
          "genre": "sports",
          "score": 42,
          "link": "https://www.youtube.com/watch?v=1ddkylubo30"
        },
        {
          "program_id": "L_CH2_P3",
          "start": 443,
          "end": 515,
          "genre": "talk",
          "score": 69,
          "link": "https://www.youtube.com/watch?v=D1-1dkbuMzA"
        },
        {
          "program_id": "L_CH2_P4",
          "start": 515,
          "end": 671,
          "genre": "news",
          "score": 77,
          "link": "https://www.youtube.com/watch?v=06D1IWLfz7Q"
        }
      ]
    },
    {
      "channel_id": 3,
      "channel_name": "LIVE Stream 4",
      "programs": [
        {
          "program_id": "L_CH3_P0",
          "start": 0,
          "end": 154,
          "genre": "news",
          "score": 47,
          "link": "https://www.youtube.com/watch?v=N9WaLtM3gyk"
        },
        {
          "program_id": "L_CH3_P1",
          "start": 154,
          "end": 296,
          "genre": "sports",
          "score": 91,
          "link": "https://www.youtube.com/watch?v=OveAzIn_hcY"
        },
        {
          "program_id": "L_CH3_P2",
          "start": 296,
          "end": 405,
          "genre": "drama",
          "score": 81,
          "link": "https://www.youtube.com/watch?v=PJYjrYFmJLY"
        },
        {
          "program_id": "L_CH3_P3",
          "start": 405,
          "end": 529,
          "genre": "news",
          "score": 63,
          "link": "https://www.youtube.com/watch?v=mBTl5rl0DaY"
        },
        {
          "program_id": "L_CH3_P4",
          "start": 529,
          "end": 673,
          "genre": "news",
          "score": 68,
          "link": "https://www.youtube.com/watch?v=H0mC8Y0a-AI"
        }
      ]
    },
    {
      "channel_id": 4,
      "channel_name": "LIVE Stream 5",
      "programs": [
        {
          "program_id": "L_CH4_P0",
          "start": 0,
          "end": 134,
          "genre": "news",
          "score": 43,
          "link": "https://www.youtube.com/watch?v=mBTl5rl0DaY"
        },
        {
          "program_id": "L_CH4_P1",
          "start": 134,
          "end": 279,
          "genre": "news",
          "score": 48,
          "link": "https://www.youtube.com/watch?v=_ACoCJXg-Sk"
        },
        {
          "program_id": "L_CH4_P2",
          "start": 279,
          "end": 370,
          "genre": "talk",
          "score": 73,
          "link": "https://www.youtube.com/watch?v=XV-zwOxiMQo"
        },
        {
          "program_id": "L_CH4_P3",
          "start": 370,
          "end": 434,
          "genre": "news",
          "score": 96,
          "link": "https://www.youtube.com/watch?v=mAW-243M4Bg"
        },
        {
          "program_id": "L_CH4_P4",
          "start": 434,
          "end": 540,
          "genre": "news",
          "score": 95,
          "link": "https://www.youtube.com/watch?v=YQT-BZr5pp0"
        }
      ]
    },
    {
      "channel_id": 5,
      "channel_name": "LIVE Stream 6",
      "programs": [
        {
          "program_id": "L_CH5_P0",
          "start": 0,
          "end": 69,
          "genre": "news",
          "score": 96,
          "link": "https://www.youtube.com/watch?v=RTtqfmXsP0s"
        },
        {
          "program_id": "L_CH5_P1",
          "start": 69,
          "end": 207,
          "genre": "news",
          "score": 88,
          "link": "https://www.youtube.com/watch?v=o-CB2NZ-0p0"
        },
        {
          "program_id": "L_CH5_P2",
          "start": 207,
          "end": 355,
          "genre": "news",
          "score": 53,
          "link": "https://www.youtube.com/watch?v=NMGFPFmXaIM"
        },
        {
          "program_id": "L_CH5_P3",
          "start": 355,
          "end": 454,
          "genre": "news",
          "score": 44,
          "link": "https://www.youtube.com/watch?v=dokrNgdYuB0"
        },
        {
          "program_id": "L_CH5_P4",
          "start": 454,
          "end": 589,
          "genre": "kids",
          "score": 42,
          "link": "https://www.youtube.com/watch?v=ZBvsPCIJluU"
        }
      ]
    },
    {
      "channel_id": 6,
      "channel_name": "LIVE Stream 7",
      "programs": [
        {
          "program_id": "L_CH6_P0",
          "start": 0,
          "end": 101,
          "genre": "news",
          "score": 46,
          "link": "https://www.youtube.com/watch?v=VS4ZEi8bhxI"
        },
        {
          "program_id": "L_CH6_P1",
          "start": 101,
          "end": 210,
          "genre": "news",
          "score": 77,
          "link": "https://www.youtube.com/watch?v=jH_nNznPnM0"
        },
        {
          "program_id": "L_CH6_P2",
          "start": 210,
          "end": 369,
          "genre": "news",
          "score": 83,
          "link": "https://www.youtube.com/watch?v=Bo1O4Ww3IGU"
        },
        {
          "program_id": "L_CH6_P3",
          "start": 369,
          "end": 475,
          "genre": "news",
          "score": 97,
          "link": "https://www.youtube.com/watch?v=GmuNWaK0EtU"
        },
        {
          "program_id": "L_CH6_P4",
          "start": 475,
          "end": 628,
          "genre": "news",
          "score": 99,
          "link": "https://www.youtube.com/watch?v=KubYyMEjneQ"
        }
      ]
    },
    {
      "channel_id": 7,
      "channel_name": "LIVE Stream 8",
      "programs": [
        {
          "program_id": "L_CH7_P0",
          "start": 0,
          "end": 127,
          "genre": "news",
          "score": 53,
          "link": "https://www.youtube.com/watch?v=LtXWSK3LRNo"
        },
        {
          "program_id": "L_CH7_P1",
          "start": 127,
          "end": 222,
          "genre": "news",
          "score": 96,
          "link": "https://www.youtube.com/watch?v=CfLSE8zGRww"
        },
        {
          "program_id": "L_CH7_P2",
          "start": 222,
          "end": 363,
          "genre": "talk",
          "score": 45,
          "link": "https://www.youtube.com/watch?v=XV-zwOxiMQo"
        },
        {
          "program_id": "L_CH7_P3",
          "start": 363,
          "end": 494,
          "genre": "news",
          "score": 43,
          "link": "https://www.youtube.com/watch?v=On6Rp65G81M"
        },
        {
          "program_id": "L_CH7_P4",
          "start": 494,
          "end": 629,
          "genre": "news",
          "score": 56,
          "link": "https://www.youtube.com/watch?v=KubYyMEjneQ"
        }
      ]
    },
    {
      "channel_id": 8,
      "channel_name": "LIVE Stream 9",
      "programs": [
        {
          "program_id": "L_CH8_P0",
          "start": 0,
          "end": 158,
          "genre": "drama",
          "score": 70,
          "link": "https://www.youtube.com/watch?v=PJYjrYFmJLY"
        },
        {
          "program_id": "L_CH8_P1",
          "start": 158,
          "end": 239,
          "genre": "news",
          "score": 79,
          "link": "https://www.youtube.com/watch?v=Bo1O4Ww3IGU"
        },
        {
          "program_id": "L_CH8_P2",
          "start": 239,
          "end": 312,
          "genre": "news",
          "score": 63,
          "link": "https://www.youtube.com/watch?v=ds8WsejQzxk"
        },
        {
          "program_id": "L_CH8_P3",
          "start": 312,
          "end": 414,
          "genre": "news",
          "score": 83,
          "link": "https://www.youtube.com/watch?v=cg_ev1tLo1Y"
        },
        {
          "program_id": "L_CH8_P4",
          "start": 414,
          "end": 479,
          "genre": "drama",
          "score": 76,
          "link": "https://www.youtube.com/watch?v=r-OnllV45UM"
        }
      ]
    },
    {
      "channel_id": 9,
      "channel_name": "LIVE Stream 10",
      "programs": [
        {
          "program_id": "L_CH9_P0",
          "start": 0,
          "end": 107,
          "genre": "drama",
          "score": 41,
          "link": "https://www.youtube.com/watch?v=r-OnllV45UM"
        },
        {
          "program_id": "L_CH9_P1",
          "start": 107,
          "end": 192,
          "genre": "news",
          "score": 47,
          "link": "https://www.youtube.com/watch?v=YQT-BZr5pp0"
        },
        {
          "program_id": "L_CH9_P2",
          "start": 192,
          "end": 338,
          "genre": "news",
          "score": 63,
          "link": "https://www.youtube.com/watch?v=YY49qQe38uc"
        },
        {
          "program_id": "L_CH9_P3",
          "start": 338,
          "end": 487,
          "genre": "news",
          "score": 63,
          "link": "https://www.youtube.com/watch?v=Bo1O4Ww3IGU"
        },
        {
          "program_id": "L_CH9_P4",
          "start": 487,
          "end": 590,
          "genre": "news",
          "score": 70,
          "link": "https://www.youtube.com/watch?v=mBTl5rl0DaY"
        }
      ]
    },
    {
      "channel_id": 10,
      "channel_name": "LIVE Stream 11",
      "programs": [
        {
          "program_id": "L_CH10_P0",
          "start": 0,
          "end": 128,
          "genre": "news",
          "score": 40,
          "link": "https://www.youtube.com/watch?v=On6Rp65G81M"
        },
        {
          "program_id": "L_CH10_P1",
          "start": 128,
          "end": 208,
          "genre": "news",
          "score": 40,
          "link": "https://www.youtube.com/watch?v=jmDuqsfLJNc"
        },
        {
          "program_id": "L_CH10_P2",
          "start": 208,
          "end": 364,
          "genre": "news",
          "score": 84,
          "link": "https://www.youtube.com/watch?v=jmDuqsfLJNc"
        },
        {
          "program_id": "L_CH10_P3",
          "start": 364,
          "end": 521,
          "genre": "news",
          "score": 65,
          "link": "https://www.youtube.com/watch?v=KubYyMEjneQ"
        },
        {
          "program_id": "L_CH10_P4",
          "start": 521,
          "end": 601,
          "genre": "news",
          "score": 82,
          "link": "https://www.youtube.com/watch?v=jH_nNznPnM0"
        }
      ]
    },
    {
      "channel_id": 11,
      "channel_name": "LIVE Stream 12",
      "programs": [
        {
          "program_id": "L_CH11_P0",
          "start": 0,
          "end": 139,
          "genre": "news",
          "score": 68,
          "link": "https://www.youtube.com/watch?v=mAW-243M4Bg"
        },
        {
          "program_id": "L_CH11_P1",
          "start": 139,
          "end": 279,
          "genre": "drama",
          "score": 97,
          "link": "https://www.youtube.com/watch?v=cxB1VakPMJ0"
        },
        {
          "program_id": "L_CH11_P2",
          "start": 279,
          "end": 332,
          "genre": "news",
          "score": 99,
          "link": "https://www.youtube.com/watch?v=YQT-BZr5pp0"
        },
        {
          "program_id": "L_CH11_P3",
          "start": 332,
          "end": 435,
          "genre": "news",
          "score": 98,
          "link": "https://www.youtube.com/watch?v=NyBvha9PG6w"
        },
        {
          "program_id": "L_CH11_P4",
          "start": 435,
          "end": 582,
          "genre": "news",
          "score": 58,
          "link": "https://www.youtube.com/watch?v=63KSqxsY2rQ"
        }
      ]
    },
    {
      "channel_id": 12,
      "channel_name": "LIVE Stream 13",
      "programs": [
        {
          "program_id": "L_CH12_P0",
          "start": 0,
          "end": 140,
          "genre": "news",
          "score": 42,
          "link": "https://www.youtube.com/watch?v=KubYyMEjneQ"
        },
        {
          "program_id": "L_CH12_P1",
          "start": 140,
          "end": 292,
          "genre": "sports",
          "score": 88,
          "link": "https://www.youtube.com/watch?v=q0ELFEzFEDg"
        },
        {
          "program_id": "L_CH12_P2",
          "start": 292,
          "end": 398,
          "genre": "drama",
          "score": 78,
          "link": "https://www.youtube.com/watch?v=6xYc5968Y7M"
        },
        {
          "program_id": "L_CH12_P3",
          "start": 398,
          "end": 557,
          "genre": "news",
          "score": 89,
          "link": "https://www.youtube.com/watch?v=o-CB2NZ-0p0"
        },
        {
          "program_id": "L_CH12_P4",
          "start": 557,
          "end": 657,
          "genre": "news",
          "score": 58,
          "link": "https://www.youtube.com/watch?v=8CNiZuah8-s"
        }
      ]
    },
    {
      "channel_id": 13,
      "channel_name": "LIVE Stream 14",
      "programs": [
        {
          "program_id": "L_CH13_P0",
          "start": 0,
          "end": 144,
          "genre": "news",
          "score": 82,
          "link": "https://www.youtube.com/watch?v=jmDuqsfLJNc"
        },
        {
          "program_id": "L_CH13_P1",
          "start": 144,
          "end": 168,
          "genre": "news",
          "score": 78,
          "link": "https://www.youtube.com/watch?v=mBTl5rl0DaY"
        },
        {
          "program_id": "L_CH13_P2",
          "start": 168,
          "end": 247,
          "genre": "news",
          "score": 61,
          "link": "https://www.youtube.com/watch?v=YQT-BZr5pp0"
        },
        {
          "program_id": "L_CH13_P3",
          "start": 247,
          "end": 393,
          "genre": "news",
          "score": 77,
          "link": "https://www.youtube.com/watch?v=Bo1O4Ww3IGU"
        },
        {
          "program_id": "L_CH13_P4",
          "start": 393,
          "end": 465,
          "genre": "news",
          "score": 96,
          "link": "https://www.youtube.com/watch?v=06D1IWLfz7Q"
        }
      ]
    },
    {
      "channel_id": 14,
      "channel_name": "LIVE Stream 15",
      "programs": [
        {
          "program_id": "L_CH14_P0",
          "start": 0,
          "end": 106,
          "genre": "music",
          "score": 67,
          "link": "https://www.youtube.com/watch?v=tie93s2lQuM"
        },
        {
          "program_id": "L_CH14_P1",
          "start": 106,
          "end": 179,
          "genre": "music",
          "score": 89,
          "link": "https://www.youtube.com/watch?v=tie93s2lQuM"
        },
        {
          "program_id": "L_CH14_P2",
          "start": 179,
          "end": 271,
          "genre": "drama",
          "score": 91,
          "link": "https://www.youtube.com/watch?v=r-OnllV45UM"
        },
        {
          "program_id": "L_CH14_P3",
          "start": 271,
          "end": 422,
          "genre": "news",
          "score": 74,
          "link": "https://www.youtube.com/watch?v=06D1IWLfz7Q"
        },
        {
          "program_id": "L_CH14_P4",
          "start": 422,
          "end": 562,
          "genre": "talk",
          "score": 50,
          "link": "https://www.youtube.com/watch?v=XV-zwOxiMQo"
        }
      ]
    },
    {
      "channel_id": 15,
      "channel_name": "LIVE Stream 16",
      "programs": [
        {
          "program_id": "L_CH15_P0",
          "start": 0,
          "end": 139,
          "genre": "news",
          "score": 62,
          "link": "https://www.youtube.com/watch?v=NyBvha9PG6w"
        },
        {
          "program_id": "L_CH15_P1",
          "start": 139,
          "end": 258,
          "genre": "news",
          "score": 54,
          "link": "https://www.youtube.com/watch?v=jmDuqsfLJNc"
        },
        {
          "program_id": "L_CH15_P2",
          "start": 258,
          "end": 402,
          "genre": "news",
          "score": 58,
          "link": "https://www.youtube.com/watch?v=YY49qQe38uc"
        },
        {
          "program_id": "L_CH15_P3",
          "start": 402,
          "end": 536,
          "genre": "news",
          "score": 51,
          "link": "https://www.youtube.com/watch?v=LtXWSK3LRNo"
        },
        {
          "program_id": "L_CH15_P4",
          "start": 536,
          "end": 695,
          "genre": "news",
          "score": 82,
          "link": "https://www.youtube.com/watch?v=hCJmP7Wdazg"
        }
      ]
    },
    {
      "channel_id": 16,
      "channel_name": "LIVE Stream 17",
      "programs": [
        {
          "program_id": "L_CH16_P0",
          "start": 0,
          "end": 132,
          "genre": "drama",
          "score": 46,
          "link": "https://www.youtube.com/watch?v=aj8WLBhSF1I"
        },
        {
          "program_id": "L_CH16_P1",
          "start": 132,
          "end": 230,
          "genre": "news",
          "score": 90,
          "link": "https://www.youtube.com/watch?v=Bo1O4Ww3IGU"
        },
        {
          "program_id": "L_CH16_P2",
          "start": 230,
          "end": 372,
          "genre": "news",
          "score": 90,
          "link": "https://www.youtube.com/watch?v=W3j0o3gGrqY"
        },
        {
          "program_id": "L_CH16_P3",
          "start": 372,
          "end": 434,
          "genre": "talk",
          "score": 76,
          "link": "https://www.youtube.com/watch?v=D1-1dkbuMzA"
        },
        {
          "program_id": "L_CH16_P4",
          "start": 434,
          "end": 575,
          "genre": "news",
          "score": 79,
          "link": "https://www.youtube.com/watch?v=NyBvha9PG6w"
        }
      ]
    },
    {
      "channel_id": 17,
      "channel_name": "LIVE Stream 18",
      "programs": [
        {
          "program_id": "L_CH17_P0",
          "start": 0,
          "end": 137,
          "genre": "sports",
          "score": 74,
          "link": "https://www.youtube.com/watch?v=OveAzIn_hcY"
        },
        {
          "program_id": "L_CH17_P1",
          "start": 137,
          "end": 296,
          "genre": "news",
          "score": 96,
          "link": "https://www.youtube.com/watch?v=NMGFPFmXaIM"
        },
        {
          "program_id": "L_CH17_P2",
          "start": 296,
          "end": 415,
          "genre": "music",
          "score": 52,
          "link": "https://www.youtube.com/watch?v=tie93s2lQuM"
        },
        {
          "program_id": "L_CH17_P3",
          "start": 415,
          "end": 522,
          "genre": "drama",
          "score": 60,
          "link": "https://www.youtube.com/watch?v=aj8WLBhSF1I"
        },
        {
          "program_id": "L_CH17_P4",
          "start": 522,
          "end": 679,
          "genre": "drama",
          "score": 55,
          "link": "https://www.youtube.com/watch?v=6xYc5968Y7M"
        }
      ]
    },
    {
      "channel_id": 18,
      "channel_name": "LIVE Stream 19",
      "programs": [
        {
          "program_id": "L_CH18_P0",
          "start": 0,
          "end": 147,
          "genre": "news",
          "score": 98,
          "link": "https://www.youtube.com/watch?v=N9WaLtM3gyk"
        },
        {
          "program_id": "L_CH18_P1",
          "start": 147,
          "end": 281,
          "genre": "news",
          "score": 62,
          "link": "https://www.youtube.com/watch?v=Fq3Q3gEsFgo"
        },
        {
          "program_id": "L_CH18_P2",
          "start": 281,
          "end": 428,
          "genre": "music",
          "score": 50,
          "link": "https://www.youtube.com/watch?v=Fc-j8sqbRRc"
        },
        {
          "program_id": "L_CH18_P3",
          "start": 428,
          "end": 549,
          "genre": "news",
          "score": 53,
          "link": "https://www.youtube.com/watch?v=KubYyMEjneQ"
        },
        {
          "program_id": "L_CH18_P4",
          "start": 549,
          "end": 706,
          "genre": "news",
          "score": 46,
          "link": "https://www.youtube.com/watch?v=H0mC8Y0a-AI"
        }
      ]
    },
    {
      "channel_id": 19,
      "channel_name": "LIVE Stream 20",
      "programs": [
        {
          "program_id": "L_CH19_P0",
          "start": 0,
          "end": 121,
          "genre": "kids",
          "score": 80,
          "link": "https://www.youtube.com/watch?v=ZBvsPCIJluU"
        },
        {
          "program_id": "L_CH19_P1",
          "start": 121,
          "end": 192,
          "genre": "drama",
          "score": 61,
          "link": "https://www.youtube.com/watch?v=PJYjrYFmJLY"
        },
        {
          "program_id": "L_CH19_P2",
          "start": 192,
          "end": 306,
          "genre": "news",
          "score": 55,
          "link": "https://www.youtube.com/watch?v=Bo1O4Ww3IGU"
        },
        {
          "program_id": "L_CH19_P3",
          "start": 306,
          "end": 451,
          "genre": "news",
          "score": 42,
          "link": "https://www.youtube.com/watch?v=cg_ev1tLo1Y"
        },
        {
          "program_id": "L_CH19_P4",
          "start": 451,
          "end": 575,
          "genre": "sports",
          "score": 47,
          "link": "https://www.youtube.com/watch?v=q0ELFEzFEDg"
        }
      ]
    },
    {
      "channel_id": 20,
      "channel_name": "LIVE Stream 21",
      "programs": [
        {
          "program_id": "L_CH20_P0",
          "start": 0,
          "end": 134,
          "genre": "news",
          "score": 81,
          "link": "https://www.youtube.com/watch?v=Fq3Q3gEsFgo"
        },
        {
          "program_id": "L_CH20_P1",
          "start": 134,
          "end": 279,
          "genre": "news",
          "score": 68,
          "link": "https://www.youtube.com/watch?v=midku-kEZrk"
        },
        {
          "program_id": "L_CH20_P2",
          "start": 279,
          "end": 416,
          "genre": "kids",
          "score": 80,
          "link": "https://www.youtube.com/watch?v=ZBvsPCIJluU"
        },
        {
          "program_id": "L_CH20_P3",
          "start": 416,
          "end": 550,
          "genre": "news",
          "score": 45,
          "link": "https://www.youtube.com/watch?v=midku-kEZrk"
        },
        {
          "program_id": "L_CH20_P4",
          "start": 550,
          "end": 662,
          "genre": "sports",
          "score": 92,
          "link": "https://www.youtube.com/watch?v=OveAzIn_hcY"
        }
      ]
    },
    {
      "channel_id": 21,
      "channel_name": "LIVE Stream 22",
      "programs": [
        {
          "program_id": "L_CH21_P0",
          "start": 738,
          "end": 1200,
          "genre": "news",
          "score": 43,
          "link": "https://www.youtube.com/watch?v=qGzK8PNeZ6A"
        },
        {
          "program_id": "L_CH21_P1",
          "start": 69,
          "end": 217,
          "genre": "news",
          "score": 85,
          "link": "https://www.youtube.com/watch?v=o-CB2NZ-0p0"
        },
        {
          "program_id": "L_CH21_P2",
          "start": 217,
          "end": 324,
          "genre": "news",
          "score": 95,
          "link": "https://www.youtube.com/watch?v=qGzK8PNeZ6A"
        },
        {
          "program_id": "L_CH21_P3",
          "start": 324,
          "end": 374,
          "genre": "news",
          "score": 78,
          "link": "https://www.youtube.com/watch?v=YQT-BZr5pp0"
        },
        {
          "program_id": "L_CH21_P4",
          "start": 374,
          "end": 524,
          "genre": "news",
          "score": 91,
          "link": "https://www.youtube.com/watch?v=On6Rp65G81M"
        }
      ]
    },
    {
      "channel_id": 22,
      "channel_name": "LIVE Stream 23",
      "programs": [
        {
          "program_id": "L_CH22_P0",
          "start": 0,
          "end": 113,
          "genre": "news",
          "score": 84,
          "link": "https://www.youtube.com/watch?v=8CNiZuah8-s"
        },
        {
          "program_id": "L_CH22_P1",
          "start": 113,
          "end": 155,
          "genre": "news",
          "score": 61,
          "link": "https://www.youtube.com/watch?v=Fq3Q3gEsFgo"
        },
        {
          "program_id": "L_CH22_P2",
          "start": 155,
          "end": 302,
          "genre": "news",
          "score": 97,
          "link": "https://www.youtube.com/watch?v=o-CB2NZ-0p0"
        },
        {
          "program_id": "L_CH22_P3",
          "start": 302,
          "end": 430,
          "genre": "news",
          "score": 70,
          "link": "https://www.youtube.com/watch?v=ULuF7mw70Oo"
        },
        {
          "program_id": "L_CH22_P4",
          "start": 430,
          "end": 495,
          "genre": "news",
          "score": 54,
          "link": "https://www.youtube.com/watch?v=hCJmP7Wdazg"
        }
      ]
    },
    {
      "channel_id": 23,
      "channel_name": "LIVE Stream 24",
      "programs": [
        {
          "program_id": "L_CH23_P0",
          "start": 0,
          "end": 108,
          "genre": "drama",
          "score": 81,
          "link": "https://www.youtube.com/watch?v=r-OnllV45UM"
        },
        {
          "program_id": "L_CH23_P1",
          "start": 108,
          "end": 264,
          "genre": "news",
          "score": 48,
          "link": "https://www.youtube.com/watch?v=qGzK8PNeZ6A"
        },
        {
          "program_id": "L_CH23_P2",
          "start": 264,
          "end": 381,
          "genre": "drama",
          "score": 45,
          "link": "https://www.youtube.com/watch?v=aj8WLBhSF1I"
        },
        {
          "program_id": "L_CH23_P3",
          "start": 381,
          "end": 539,
          "genre": "sports",
          "score": 99,
          "link": "https://www.youtube.com/watch?v=1ddkylubo30"
        },
        {
          "program_id": "L_CH23_P4",
          "start": 539,
          "end": 677,
          "genre": "news",
          "score": 74,
          "link": "https://www.youtube.com/watch?v=KubYyMEjneQ"
        }
      ]
    },
    {
      "channel_id": 24,
      "channel_name": "LIVE Stream 25",
      "programs": [
        {
          "program_id": "L_CH24_P0",
          "start": 0,
          "end": 99,
          "genre": "news",
          "score": 57,
          "link": "https://www.youtube.com/watch?v=qGzK8PNeZ6A"
        },
        {
          "program_id": "L_CH24_P1",
          "start": 99,
          "end": 227,
          "genre": "news",
          "score": 64,
          "link": "https://www.youtube.com/watch?v=RTtqfmXsP0s"
        },
        {
          "program_id": "L_CH24_P2",
          "start": 227,
          "end": 314,
          "genre": "news",
          "score": 52,
          "link": "https://www.youtube.com/watch?v=YY49qQe38uc"
        },
        {
          "program_id": "L_CH24_P3",
          "start": 314,
          "end": 455,
          "genre": "news",
          "score": 64,
          "link": "https://www.youtube.com/watch?v=NMGFPFmXaIM"
        },
        {
          "program_id": "L_CH24_P4",
          "start": 455,
          "end": 566,
          "genre": "news",
          "score": 87,
          "link": "https://www.youtube.com/watch?v=YY49qQe38uc"
        }
      ]
    },
    {
      "channel_id": 25,
      "channel_name": "LIVE Stream 26",
      "programs": [
        {
          "program_id": "L_CH25_P0",
          "start": 0,
          "end": 118,
          "genre": "news",
          "score": 76,
          "link": "https://www.youtube.com/watch?v=YY49qQe38uc"
        },
        {
          "program_id": "L_CH25_P1",
          "start": 118,
          "end": 185,
          "genre": "news",
          "score": 55,
          "link": "https://www.youtube.com/watch?v=63KSqxsY2rQ"
        },
        {
          "program_id": "L_CH25_P2",
          "start": 185,
          "end": 341,
          "genre": "news",
          "score": 52,
          "link": "https://www.youtube.com/watch?v=o-CB2NZ-0p0"
        },
        {
          "program_id": "L_CH25_P3",
          "start": 341,
          "end": 486,
          "genre": "news",
          "score": 48,
          "link": "https://www.youtube.com/watch?v=jmDuqsfLJNc"
        },
        {
          "program_id": "L_CH25_P4",
          "start": 486,
          "end": 595,
          "genre": "drama",
          "score": 70,
          "link": "https://www.youtube.com/watch?v=UBRbgUTeLNo"
        }
      ]
    },
    {
      "channel_id": 26,
      "channel_name": "LIVE Stream 27",
      "programs": [
        {
          "program_id": "L_CH26_P0",
          "start": 0,
          "end": 77,
          "genre": "music",
          "score": 41,
          "link": "https://www.youtube.com/watch?v=tie93s2lQuM"
        },
        {
          "program_id": "L_CH26_P1",
          "start": 77,
          "end": 125,
          "genre": "news",
          "score": 47,
          "link": "https://www.youtube.com/watch?v=LtXWSK3LRNo"
        },
        {
          "program_id": "L_CH26_P2",
          "start": 125,
          "end": 169,
          "genre": "news",
          "score": 87,
          "link": "https://www.youtube.com/watch?v=KubYyMEjneQ"
        },
        {
          "program_id": "L_CH26_P3",
          "start": 169,
          "end": 266,
          "genre": "news",
          "score": 75,
          "link": "https://www.youtube.com/watch?v=cg_ev1tLo1Y"
        },
        {
          "program_id": "L_CH26_P4",
          "start": 266,
          "end": 364,
          "genre": "drama",
          "score": 67,
          "link": "https://www.youtube.com/watch?v=cxB1VakPMJ0"
        }
      ]
    },
    {
      "channel_id": 27,
      "channel_name": "LIVE Stream 28",
      "programs": [
        {
          "program_id": "L_CH27_P0",
          "start": 0,
          "end": 51,
          "genre": "drama",
          "score": 97,
          "link": "https://www.youtube.com/watch?v=6xYc5968Y7M"
        },
        {
          "program_id": "L_CH27_P1",
          "start": 51,
          "end": 194,
          "genre": "news",
          "score": 57,
          "link": "https://www.youtube.com/watch?v=dokrNgdYuB0"
        },
        {
          "program_id": "L_CH27_P2",
          "start": 194,
          "end": 328,
          "genre": "talk",
          "score": 49,
          "link": "https://www.youtube.com/watch?v=D1-1dkbuMzA"
        },
        {
          "program_id": "L_CH27_P3",
          "start": 328,
          "end": 366,
          "genre": "news",
          "score": 73,
          "link": "https://www.youtube.com/watch?v=dokrNgdYuB0"
        },
        {
          "program_id": "L_CH27_P4",
          "start": 366,
          "end": 440,
          "genre": "news",
          "score": 91,
          "link": "https://www.youtube.com/watch?v=mBTl5rl0DaY"
        }
      ]
    },
    {
      "channel_id": 28,
      "channel_name": "LIVE Stream 29",
      "programs": [
        {
          "program_id": "L_CH28_P0",
          "start": 0,
          "end": 145,
          "genre": "news",
          "score": 83,
          "link": "https://www.youtube.com/watch?v=ULuF7mw70Oo"
        },
        {
          "program_id": "L_CH28_P1",
          "start": 145,
          "end": 246,
          "genre": "news",
          "score": 47,
          "link": "https://www.youtube.com/watch?v=VS4ZEi8bhxI"
        },
        {
          "program_id": "L_CH28_P2",
          "start": 246,
          "end": 351,
          "genre": "talk",
          "score": 95,
          "link": "https://www.youtube.com/watch?v=XV-zwOxiMQo"
        },
        {
          "program_id": "L_CH28_P3",
          "start": 351,
          "end": 492,
          "genre": "news",
          "score": 76,
          "link": "https://www.youtube.com/watch?v=63KSqxsY2rQ"
        },
        {
          "program_id": "L_CH28_P4",
          "start": 492,
          "end": 581,
          "genre": "drama",
          "score": 61,
          "link": "https://www.youtube.com/watch?v=cxB1VakPMJ0"
        }
      ]
    },
    {
      "channel_id": 29,
      "channel_name": "LIVE Stream 30",
      "programs": [
        {
          "program_id": "L_CH29_P0",
          "start": 0,
          "end": 73,
          "genre": "drama",
          "score": 66,
          "link": "https://www.youtube.com/watch?v=cxB1VakPMJ0"
        },
        {
          "program_id": "L_CH29_P1",
          "start": 73,
          "end": 184,
          "genre": "news",
          "score": 69,
          "link": "https://www.youtube.com/watch?v=o-CB2NZ-0p0"
        },
        {
          "program_id": "L_CH29_P2",
          "start": 184,
          "end": 266,
          "genre": "news",
          "score": 73,
          "link": "https://www.youtube.com/watch?v=cg_ev1tLo1Y"
        },
        {
          "program_id": "L_CH29_P3",
          "start": 266,
          "end": 354,
          "genre": "sports",
          "score": 95,
          "link": "https://www.youtube.com/watch?v=1ddkylubo30"
        },
        {
          "program_id": "L_CH29_P4",
          "start": 354,
          "end": 479,
          "genre": "music",
          "score": 72,
          "link": "https://www.youtube.com/watch?v=Fc-j8sqbRRc"
        }
      ]
    },
    {
      "channel_id": 30,
      "channel_name": "LIVE Stream 31",
      "programs": [
        {
          "program_id": "L_CH30_P0",
          "start": 0,
          "end": 151,
          "genre": "news",
          "score": 53,
          "link": "https://www.youtube.com/watch?v=cg_ev1tLo1Y"
        },
        {
          "program_id": "L_CH30_P1",
          "start": 151,
          "end": 238,
          "genre": "news",
          "score": 40,
          "link": "https://www.youtube.com/watch?v=mBTl5rl0DaY"
        },
        {
          "program_id": "L_CH30_P2",
          "start": 238,
          "end": 344,
          "genre": "news",
          "score": 42,
          "link": "https://www.youtube.com/watch?v=cg_ev1tLo1Y"
        },
        {
          "program_id": "L_CH30_P3",
          "start": 344,
          "end": 430,
          "genre": "news",
          "score": 80,
          "link": "https://www.youtube.com/watch?v=CfLSE8zGRww"
        },
        {
          "program_id": "L_CH30_P4",
          "start": 430,
          "end": 545,
          "genre": "news",
          "score": 45,
          "link": "https://www.youtube.com/watch?v=H0mC8Y0a-AI"
        }
      ]
    },
    {
      "channel_id": 31,
      "channel_name": "LIVE Stream 32",
      "programs": [
        {
          "program_id": "L_CH31_P0",
          "start": 0,
          "end": 86,
          "genre": "news",
          "score": 63,
          "link": "https://www.youtube.com/watch?v=NMGFPFmXaIM"
        },
        {
          "program_id": "L_CH31_P1",
          "start": 86,
          "end": 238,
          "genre": "news",
          "score": 91,
          "link": "https://www.youtube.com/watch?v=GmuNWaK0EtU"
        },
        {
          "program_id": "L_CH31_P2",
          "start": 238,
          "end": 328,
          "genre": "sports",
          "score": 71,
          "link": "https://www.youtube.com/watch?v=1ddkylubo30"
        },
        {
          "program_id": "L_CH31_P3",
          "start": 328,
          "end": 415,
          "genre": "drama",
          "score": 61,
          "link": "https://www.youtube.com/watch?v=aj8WLBhSF1I"
        },
        {
          "program_id": "L_CH31_P4",
          "start": 415,
          "end": 548,
          "genre": "news",
          "score": 80,
          "link": "https://www.youtube.com/watch?v=mBTl5rl0DaY"
        }
      ]
    },
    {
      "channel_id": 32,
      "channel_name": "LIVE Stream 33",
      "programs": [
        {
          "program_id": "L_CH32_P0",
          "start": 0,
          "end": 77,
          "genre": "news",
          "score": 63,
          "link": "https://www.youtube.com/watch?v=GmuNWaK0EtU"
        },
        {
          "program_id": "L_CH32_P1",
          "start": 77,
          "end": 111,
          "genre": "news",
          "score": 51,
          "link": "https://www.youtube.com/watch?v=RTtqfmXsP0s"
        },
        {
          "program_id": "L_CH32_P2",
          "start": 111,
          "end": 260,
          "genre": "news",
          "score": 83,
          "link": "https://www.youtube.com/watch?v=Bo1O4Ww3IGU"
        },
        {
          "program_id": "L_CH32_P3",
          "start": 260,
          "end": 389,
          "genre": "news",
          "score": 92,
          "link": "https://www.youtube.com/watch?v=r2yVFmWWVzM"
        },
        {
          "program_id": "L_CH32_P4",
          "start": 389,
          "end": 474,
          "genre": "talk",
          "score": 80,
          "link": "https://www.youtube.com/watch?v=XV-zwOxiMQo"
        }
      ]
    },
    {
      "channel_id": 33,
      "channel_name": "LIVE Stream 34",
      "programs": [
        {
          "program_id": "L_CH33_P0",
          "start": 0,
          "end": 69,
          "genre": "news",
          "score": 78,
          "link": "https://www.youtube.com/watch?v=NyBvha9PG6w"
        },
        {
          "program_id": "L_CH33_P1",
          "start": 69,
          "end": 220,
          "genre": "news",
          "score": 96,
          "link": "https://www.youtube.com/watch?v=dokrNgdYuB0"
        },
        {
          "program_id": "L_CH33_P2",
          "start": 220,
          "end": 339,
          "genre": "news",
          "score": 72,
          "link": "https://www.youtube.com/watch?v=YY49qQe38uc"
        },
        {
          "program_id": "L_CH33_P3",
          "start": 339,
          "end": 387,
          "genre": "drama",
          "score": 87,
          "link": "https://www.youtube.com/watch?v=aj8WLBhSF1I"
        },
        {
          "program_id": "L_CH33_P4",
          "start": 387,
          "end": 522,
          "genre": "news",
          "score": 95,
          "link": "https://www.youtube.com/watch?v=RTtqfmXsP0s"
        }
      ]
    },
    {
      "channel_id": 34,
      "channel_name": "LIVE Stream 35",
      "programs": [
        {
          "program_id": "L_CH34_P0",
          "start": 0,
          "end": 116,
          "genre": "sports",
          "score": 95,
          "link": "https://www.youtube.com/watch?v=q0ELFEzFEDg"
        },
        {
          "program_id": "L_CH34_P1",
          "start": 116,
          "end": 230,
          "genre": "news",
          "score": 47,
          "link": "https://www.youtube.com/watch?v=8CNiZuah8-s"
        },
        {
          "program_id": "L_CH34_P2",
          "start": 230,
          "end": 379,
          "genre": "news",
          "score": 72,
          "link": "https://www.youtube.com/watch?v=ULuF7mw70Oo"
        },
        {
          "program_id": "L_CH34_P3",
          "start": 379,
          "end": 505,
          "genre": "news",
          "score": 54,
          "link": "https://www.youtube.com/watch?v=CfLSE8zGRww"
        },
        {
          "program_id": "L_CH34_P4",
          "start": 505,
          "end": 628,
          "genre": "news",
          "score": 79,
          "link": "https://www.youtube.com/watch?v=Fq3Q3gEsFgo"
        }
      ]
    },
    {
      "channel_id": 35,
      "channel_name": "LIVE Stream 36",
      "programs": [
        {
          "program_id": "L_CH35_P0",
          "start": 0,
          "end": 45,
          "genre": "news",
          "score": 96,
          "link": "https://www.youtube.com/watch?v=cg_ev1tLo1Y"
        },
        {
          "program_id": "L_CH35_P1",
          "start": 45,
          "end": 159,
          "genre": "news",
          "score": 75,
          "link": "https://www.youtube.com/watch?v=o-CB2NZ-0p0"
        },
        {
          "program_id": "L_CH35_P2",
          "start": 159,
          "end": 300,
          "genre": "news",
          "score": 76,
          "link": "https://www.youtube.com/watch?v=Fq3Q3gEsFgo"
        },
        {
          "program_id": "L_CH35_P3",
          "start": 300,
          "end": 374,
          "genre": "news",
          "score": 57,
          "link": "https://www.youtube.com/watch?v=ULuF7mw70Oo"
        },
        {
          "program_id": "L_CH35_P4",
          "start": 374,
          "end": 463,
          "genre": "news",
          "score": 75,
          "link": "https://www.youtube.com/watch?v=8CNiZuah8-s"
        }
      ]
    },
    {
      "channel_id": 36,
      "channel_name": "LIVE Stream 37",
      "programs": [
        {
          "program_id": "L_CH36_P0",
          "start": 0,
          "end": 154,
          "genre": "news",
          "score": 59,
          "link": "https://www.youtube.com/watch?v=qGzK8PNeZ6A"
        },
        {
          "program_id": "L_CH36_P1",
          "start": 154,
          "end": 243,
          "genre": "music",
          "score": 45,
          "link": "https://www.youtube.com/watch?v=Fc-j8sqbRRc"
        },
        {
          "program_id": "L_CH36_P2",
          "start": 243,
          "end": 373,
          "genre": "news",
          "score": 51,
          "link": "https://www.youtube.com/watch?v=Bo1O4Ww3IGU"
        },
        {
          "program_id": "L_CH36_P3",
          "start": 373,
          "end": 506,
          "genre": "talk",
          "score": 58,
          "link": "https://www.youtube.com/watch?v=D1-1dkbuMzA"
        },
        {
          "program_id": "L_CH36_P4",
          "start": 506,
          "end": 659,
          "genre": "news",
          "score": 97,
          "link": "https://www.youtube.com/watch?v=LtXWSK3LRNo"
        }
      ]
    },
    {
      "channel_id": 37,
      "channel_name": "LIVE Stream 38",
      "programs": [
        {
          "program_id": "L_CH37_P0",
          "start": 0,
          "end": 103,
          "genre": "news",
          "score": 45,
          "link": "https://www.youtube.com/watch?v=VS4ZEi8bhxI"
        },
        {
          "program_id": "L_CH37_P1",
          "start": 103,
          "end": 230,
          "genre": "drama",
          "score": 95,
          "link": "https://www.youtube.com/watch?v=aj8WLBhSF1I"
        },
        {
          "program_id": "L_CH37_P2",
          "start": 230,
          "end": 357,
          "genre": "news",
          "score": 58,
          "link": "https://www.youtube.com/watch?v=_ACoCJXg-Sk"
        },
        {
          "program_id": "L_CH37_P3",
          "start": 357,
          "end": 482,
          "genre": "news",
          "score": 57,
          "link": "https://www.youtube.com/watch?v=hCJmP7Wdazg"
        },
        {
          "program_id": "L_CH37_P4",
          "start": 482,
          "end": 636,
          "genre": "kids",
          "score": 45,
          "link": "https://www.youtube.com/watch?v=ZBvsPCIJluU"
        }
      ]
    },
    {
      "channel_id": 38,
      "channel_name": "LIVE Stream 39",
      "programs": [
        {
          "program_id": "L_CH38_P0",
          "start": 0,
          "end": 150,
          "genre": "music",
          "score": 42,
          "link": "https://www.youtube.com/watch?v=tie93s2lQuM"
        },
        {
          "program_id": "L_CH38_P1",
          "start": 150,
          "end": 254,
          "genre": "sports",
          "score": 76,
          "link": "https://www.youtube.com/watch?v=q0ELFEzFEDg"
        },
        {
          "program_id": "L_CH38_P2",
          "start": 254,
          "end": 402,
          "genre": "news",
          "score": 85,
          "link": "https://www.youtube.com/watch?v=63KSqxsY2rQ"
        },
        {
          "program_id": "L_CH38_P3",
          "start": 402,
          "end": 542,
          "genre": "news",
          "score": 45,
          "link": "https://www.youtube.com/watch?v=mBTl5rl0DaY"
        },
        {
          "program_id": "L_CH38_P4",
          "start": 542,
          "end": 701,
          "genre": "drama",
          "score": 97,
          "link": "https://www.youtube.com/watch?v=r-OnllV45UM"
        }
      ]
    },
    {
      "channel_id": 39,
      "channel_name": "LIVE Stream 40",
      "programs": [
        {
          "program_id": "L_CH39_P0",
          "start": 0,
          "end": 68,
          "genre": "music",
          "score": 82,
          "link": "https://www.youtube.com/watch?v=tie93s2lQuM"
        },
        {
          "program_id": "L_CH39_P1",
          "start": 68,
          "end": 189,
          "genre": "news",
          "score": 88,
          "link": "https://www.youtube.com/watch?v=Fq3Q3gEsFgo"
        },
        {
          "program_id": "L_CH39_P2",
          "start": 189,
          "end": 284,
          "genre": "kids",
          "score": 50,
          "link": "https://www.youtube.com/watch?v=ZBvsPCIJluU"
        },
        {
          "program_id": "L_CH39_P3",
          "start": 284,
          "end": 384,
          "genre": "news",
          "score": 73,
          "link": "https://www.youtube.com/watch?v=W3j0o3gGrqY"
        },
        {
          "program_id": "L_CH39_P4",
          "start": 384,
          "end": 473,
          "genre": "drama",
          "score": 49,
          "link": "https://www.youtube.com/watch?v=PJYjrYFmJLY"
        }
      ]
    },
    {
      "channel_id": 40,
      "channel_name": "LIVE Stream 41",
      "programs": [
        {
          "program_id": "L_CH40_P0",
          "start": 0,
          "end": 110,
          "genre": "drama",
          "score": 73,
          "link": "https://www.youtube.com/watch?v=PJYjrYFmJLY"
        },
        {
          "program_id": "L_CH40_P1",
          "start": 110,
          "end": 262,
          "genre": "news",
          "score": 85,
          "link": "https://www.youtube.com/watch?v=tRp29o27TDE"
        },
        {
          "program_id": "L_CH40_P2",
          "start": 262,
          "end": 317,
          "genre": "talk",
          "score": 80,
          "link": "https://www.youtube.com/watch?v=D1-1dkbuMzA"
        },
        {
          "program_id": "L_CH40_P3",
          "start": 317,
          "end": 472,
          "genre": "news",
          "score": 94,
          "link": "https://www.youtube.com/watch?v=mAW-243M4Bg"
        },
        {
          "program_id": "L_CH40_P4",
          "start": 472,
          "end": 559,
          "genre": "drama",
          "score": 88,
          "link": "https://www.youtube.com/watch?v=cxB1VakPMJ0"
        }
      ]
    },
    {
      "channel_id": 41,
      "channel_name": "LIVE Stream 42",
      "programs": [
        {
          "program_id": "L_CH41_P0",
          "start": 0,
          "end": 96,
          "genre": "news",
          "score": 74,
          "link": "https://www.youtube.com/watch?v=r2yVFmWWVzM"
        },
        {
          "program_id": "L_CH41_P1",
          "start": 96,
          "end": 240,
          "genre": "news",
          "score": 54,
          "link": "https://www.youtube.com/watch?v=NyBvha9PG6w"
        },
        {
          "program_id": "L_CH41_P2",
          "start": 240,
          "end": 348,
          "genre": "news",
          "score": 82,
          "link": "https://www.youtube.com/watch?v=YQT-BZr5pp0"
        },
        {
          "program_id": "L_CH41_P3",
          "start": 348,
          "end": 390,
          "genre": "documentary",
          "score": 82,
          "link": "https://www.youtube.com/watch?v=nR9fiVwvFSI"
        },
        {
          "program_id": "L_CH41_P4",
          "start": 390,
          "end": 531,
          "genre": "news",
          "score": 83,
          "link": "https://www.youtube.com/watch?v=mAW-243M4Bg"
        }
      ]
    },
    {
      "channel_id": 42,
      "channel_name": "LIVE Stream 43",
      "programs": [
        {
          "program_id": "L_CH42_P0",
          "start": 0,
          "end": 147,
          "genre": "news",
          "score": 72,
          "link": "https://www.youtube.com/watch?v=jmDuqsfLJNc"
        },
        {
          "program_id": "L_CH42_P1",
          "start": 147,
          "end": 300,
          "genre": "news",
          "score": 92,
          "link": "https://www.youtube.com/watch?v=hCJmP7Wdazg"
        },
        {
          "program_id": "L_CH42_P2",
          "start": 300,
          "end": 447,
          "genre": "news",
          "score": 59,
          "link": "https://www.youtube.com/watch?v=YQT-BZr5pp0"
        },
        {
          "program_id": "L_CH42_P3",
          "start": 447,
          "end": 547,
          "genre": "talk",
          "score": 67,
          "link": "https://www.youtube.com/watch?v=XV-zwOxiMQo"
        },
        {
          "program_id": "L_CH42_P4",
          "start": 547,
          "end": 654,
          "genre": "talk",
          "score": 71,
          "link": "https://www.youtube.com/watch?v=D1-1dkbuMzA"
        }
      ]
    },
    {
      "channel_id": 43,
      "channel_name": "LIVE Stream 44",
      "programs": [
        {
          "program_id": "L_CH43_P0",
          "start": 0,
          "end": 128,
          "genre": "news",
          "score": 53,
          "link": "https://www.youtube.com/watch?v=RTtqfmXsP0s"
        },
        {
          "program_id": "L_CH43_P1",
          "start": 128,
          "end": 206,
          "genre": "news",
          "score": 80,
          "link": "https://www.youtube.com/watch?v=hCJmP7Wdazg"
        },
        {
          "program_id": "L_CH43_P2",
          "start": 206,
          "end": 298,
          "genre": "news",
          "score": 43,
          "link": "https://www.youtube.com/watch?v=On6Rp65G81M"
        },
        {
          "program_id": "L_CH43_P3",
          "start": 298,
          "end": 446,
          "genre": "news",
          "score": 92,
          "link": "https://www.youtube.com/watch?v=VS4ZEi8bhxI"
        },
        {
          "program_id": "L_CH43_P4",
          "start": 446,
          "end": 592,
          "genre": "drama",
          "score": 98,
          "link": "https://www.youtube.com/watch?v=UBRbgUTeLNo"
        }
      ]
    },
    {
      "channel_id": 44,
      "channel_name": "LIVE Stream 45",
      "programs": [
        {
          "program_id": "L_CH44_P0",
          "start": 0,
          "end": 61,
          "genre": "news",
          "score": 71,
          "link": "https://www.youtube.com/watch?v=W3j0o3gGrqY"
        },
        {
          "program_id": "L_CH44_P1",
          "start": 61,
          "end": 182,
          "genre": "drama",
          "score": 54,
          "link": "https://www.youtube.com/watch?v=cxB1VakPMJ0"
        },
        {
          "program_id": "L_CH44_P2",
          "start": 182,
          "end": 320,
          "genre": "news",
          "score": 55,
          "link": "https://www.youtube.com/watch?v=NyBvha9PG6w"
        },
        {
          "program_id": "L_CH44_P3",
          "start": 320,
          "end": 424,
          "genre": "drama",
          "score": 73,
          "link": "https://www.youtube.com/watch?v=UBRbgUTeLNo"
        },
        {
          "program_id": "L_CH44_P4",
          "start": 424,
          "end": 476,
          "genre": "music",
          "score": 52,
          "link": "https://www.youtube.com/watch?v=Fc-j8sqbRRc"
        }
      ]
    },
    {
      "channel_id": 45,
      "channel_name": "LIVE Stream 46",
      "programs": [
        {
          "program_id": "L_CH45_P0",
          "start": 0,
          "end": 141,
          "genre": "news",
          "score": 83,
          "link": "https://www.youtube.com/watch?v=YY49qQe38uc"
        },
        {
          "program_id": "L_CH45_P1",
          "start": 141,
          "end": 295,
          "genre": "news",
          "score": 52,
          "link": "https://www.youtube.com/watch?v=_ACoCJXg-Sk"
        },
        {
          "program_id": "L_CH45_P2",
          "start": 295,
          "end": 429,
          "genre": "news",
          "score": 52,
          "link": "https://www.youtube.com/watch?v=midku-kEZrk"
        },
        {
          "program_id": "L_CH45_P3",
          "start": 429,
          "end": 563,
          "genre": "news",
          "score": 80,
          "link": "https://www.youtube.com/watch?v=RTtqfmXsP0s"
        },
        {
          "program_id": "L_CH45_P4",
          "start": 563,
          "end": 713,
          "genre": "news",
          "score": 71,
          "link": "https://www.youtube.com/watch?v=VS4ZEi8bhxI"
        }
      ]
    },
    {
      "channel_id": 46,
      "channel_name": "LIVE Stream 47",
      "programs": [
        {
          "program_id": "L_CH46_P0",
          "start": 0,
          "end": 86,
          "genre": "drama",
          "score": 93,
          "link": "https://www.youtube.com/watch?v=FSFTwO5yT-o"
        },
        {
          "program_id": "L_CH46_P1",
          "start": 86,
          "end": 111,
          "genre": "news",
          "score": 53,
          "link": "https://www.youtube.com/watch?v=VS4ZEi8bhxI"
        },
        {
          "program_id": "L_CH46_P2",
          "start": 111,
          "end": 243,
          "genre": "talk",
          "score": 48,
          "link": "https://www.youtube.com/watch?v=D1-1dkbuMzA"
        },
        {
          "program_id": "L_CH46_P3",
          "start": 243,
          "end": 355,
          "genre": "news",
          "score": 53,
          "link": "https://www.youtube.com/watch?v=dokrNgdYuB0"
        },
        {
          "program_id": "L_CH46_P4",
          "start": 355,
          "end": 452,
          "genre": "news",
          "score": 78,
          "link": "https://www.youtube.com/watch?v=ds8WsejQzxk"
        }
      ]
    },
    {
      "channel_id": 47,
      "channel_name": "LIVE Stream 48",
      "programs": [
        {
          "program_id": "L_CH47_P0",
          "start": 0,
          "end": 144,
          "genre": "news",
          "score": 74,
          "link": "https://www.youtube.com/watch?v=VS4ZEi8bhxI"
        },
        {
          "program_id": "L_CH47_P1",
          "start": 144,
          "end": 256,
          "genre": "news",
          "score": 53,
          "link": "https://www.youtube.com/watch?v=On6Rp65G81M"
        },
        {
          "program_id": "L_CH47_P2",
          "start": 256,
          "end": 383,
          "genre": "news",
          "score": 88,
          "link": "https://www.youtube.com/watch?v=RTtqfmXsP0s"
        },
        {
          "program_id": "L_CH47_P3",
          "start": 383,
          "end": 514,
          "genre": "news",
          "score": 49,
          "link": "https://www.youtube.com/watch?v=H0mC8Y0a-AI"
        },
        {
          "program_id": "L_CH47_P4",
          "start": 514,
          "end": 626,
          "genre": "news",
          "score": 47,
          "link": "https://www.youtube.com/watch?v=ULuF7mw70Oo"
        }
      ]
    },
    {
      "channel_id": 48,
      "channel_name": "LIVE Stream 49",
      "programs": [
        {
          "program_id": "L_CH48_P0",
          "start": 0,
          "end": 124,
          "genre": "news",
          "score": 65,
          "link": "https://www.youtube.com/watch?v=NyBvha9PG6w"
        },
        {
          "program_id": "L_CH48_P1",
          "start": 124,
          "end": 252,
          "genre": "drama",
          "score": 89,
          "link": "https://www.youtube.com/watch?v=PJYjrYFmJLY"
        },
        {
          "program_id": "L_CH48_P2",
          "start": 252,
          "end": 310,
          "genre": "news",
          "score": 63,
          "link": "https://www.youtube.com/watch?v=cg_ev1tLo1Y"
        },
        {
          "program_id": "L_CH48_P3",
          "start": 310,
          "end": 398,
          "genre": "news",
          "score": 58,
          "link": "https://www.youtube.com/watch?v=r2yVFmWWVzM"
        },
        {
          "program_id": "L_CH48_P4",
          "start": 398,
          "end": 541,
          "genre": "drama",
          "score": 92,
          "link": "https://www.youtube.com/watch?v=aj8WLBhSF1I"
        }
      ]
    },
    {
      "channel_id": 49,
      "channel_name": "LIVE Stream 50",
      "programs": [
        {
          "program_id": "L_CH49_P0",
          "start": 0,
          "end": 148,
          "genre": "news",
          "score": 94,
          "link": "https://www.youtube.com/watch?v=LtXWSK3LRNo"
        },
        {
          "program_id": "L_CH49_P1",
          "start": 148,
          "end": 279,
          "genre": "news",
          "score": 45,
          "link": "https://www.youtube.com/watch?v=_ACoCJXg-Sk"
        },
        {
          "program_id": "L_CH49_P2",
          "start": 279,
          "end": 427,
          "genre": "news",
          "score": 42,
          "link": "https://www.youtube.com/watch?v=midku-kEZrk"
        },
        {
          "program_id": "L_CH49_P3",
          "start": 427,
          "end": 513,
          "genre": "sports",
          "score": 62,
          "link": "https://www.youtube.com/watch?v=OveAzIn_hcY"
        },
        {
          "program_id": "L_CH49_P4",
          "start": 513,
          "end": 544,
          "genre": "news",
          "score": 86,
          "link": "https://www.youtube.com/watch?v=GmuNWaK0EtU"
        }
      ]
    }
  ]
}
    statusEl.textContent = "Schedule loaded";

    prepareTimeline();
    startTicker();
  } catch (err) {
    statusEl.textContent = "Error loading JSON";
    infoEl.textContent = err.message;
  }
}

// Convert your minutes-based program list to real times
function prepareTimeline() {
  fullTimeline = [];

  const channels = instanceData.channels || [];

  // Populate channel selector
  channelSelect.innerHTML = '<option value="all">All Channels</option>';
  channels.forEach((ch) => {
    const option = document.createElement('option');
    option.value = ch.channel_name;
    option.textContent = ch.channel_name;
    channelSelect.appendChild(option);
    
    (ch.programs || []).forEach((p) => {
      const startMinutes = p.start;
      const endMinutes = p.end;
      const videoId = extractVideoId(p.link);

      // Convert minutes → Date today
      const startDate = minutesToDate(startMinutes);
      const endDate = minutesToDate(endMinutes);

      fullTimeline.push({
        channel_id: ch.channel_id,
        channel_name: ch.channel_name,
        startDate,
        endDate,
        durationMin: endMinutes - startMinutes,
        videoId,
        raw_start: startMinutes,
        raw_end: endMinutes,
      });
    });
  });

  // Sort by time
  fullTimeline.sort((a, b) => a.startDate - b.startDate);
  
  // Filter by selected channel
  filterTimelineByChannel();

  infoEl.innerHTML = `Loaded ${timeline.length} programs for ${selectedChannel === 'all' ? 'all channels' : selectedChannel}.`;
  miniGuide.innerHTML =
    "Video will switch at correct schedule times (minutes → today).";
}

// Filter timeline by selected channel
function filterTimelineByChannel() {
  if (selectedChannel === "all") {
    timeline = [...fullTimeline];
  } else {
    timeline = fullTimeline.filter(p => p.channel_name === selectedChannel);
  }
  // Reset current program when channel changes
  currentProgram = null;
}

// Handle channel selection change
channelSelect.addEventListener('change', (e) => {
  selectedChannel = e.target.value;
  filterTimelineByChannel();
  infoEl.innerHTML = `Switched to ${selectedChannel === 'all' ? 'all channels' : selectedChannel}. Loaded ${timeline.length} programs.`;
  tick(); // Immediately check for active program
});

// Convert "minutes since midnight" → Date object (starting from 8:00 AM)
function minutesToDate(min) {
  const d = new Date();
  d.setHours(8, 0, 0, 0); // Start from 8:00 AM
  d.setMinutes(min); // Each "minute" = 1 real minute
  return d;
}

// Start checking schedule every second
function startTicker() {
  tickTimer = setInterval(() => tick(), 1000);
  tick();
}

function tick() {
  const now = new Date();

  const active = timeline.find((p) => now >= p.startDate && now < p.endDate);

  if (active) {
    if (currentProgram !== active) {
      currentProgram = active;
      playProgram(active);
    }
  } else {
    // No active program - clear the iframe
    if (iframeEl) {
      iframeEl.remove();
      iframeEl = null;
    }
    placeholder.style.display = "block";
    currentProgram = null;
    
    const next = timeline.find((p) => p.startDate > now);

    if (next) {
      infoEl.innerHTML = `No program playing.<br>Next: <b>${
        next.channel_name
      }</b> at ${next.startDate.toLocaleTimeString()}`;
    } else {
      infoEl.innerHTML = "No more programs today.";
    }
  }
}

// Play video
function playProgram(p) {
  if (!p.videoId) {
    placeholder.innerText = "No video found.";
    placeholder.style.display = "block";
    return;
  }

  const embed = `https://www.youtube.com/embed/${p.videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`;

  if (iframeEl) iframeEl.remove();

  iframeEl = document.createElement("iframe");
  iframeEl.src = embed;
  iframeEl.width = "100%";
  iframeEl.height = "100%";
  iframeEl.frameBorder = "0";
  iframeEl.allow = "autoplay; fullscreen; picture-in-picture";
  iframeEl.allowFullscreen = true;
  playerContainer.appendChild(iframeEl);
  placeholder.style.display = "none";

  infoEl.innerHTML = `<b>${
    p.channel_name
  }</b><br>Playing from ${p.startDate.toLocaleTimeString()} for ${
    p.durationMin
  } minutes`;
}
