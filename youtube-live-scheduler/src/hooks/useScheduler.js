import { useEffect, useRef, useState } from "react";
import instanceData from "../data/instanceData.json";
import { buildSchedulerPayload, runScheduler } from "../api/scheduler";
import { extractVideoId } from "../utils/youtube";
import { minutesToDate } from "../utils/time";

export function useScheduler() {
  const [status, setStatus] = useState("Running scheduling algorithm...");
  const [timeline, setTimeline] = useState([]);
  const [fullTimeline, setFullTimeline] = useState([]);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [simNow, setSimNow] = useState(minutesToDate(0));

  const tickTimer = useRef(null);
  const simulatedMinute = useRef(0);

  useEffect(() => {
    loadInstance();

    return () => {
      if (tickTimer.current) {
        clearInterval(tickTimer.current);
      }
    };
  }, []);

  async function loadInstance() {
    if (tickTimer.current) {
      clearInterval(tickTimer.current);
    }

    setStatus("Running scheduling algorithm...");

    try {
      const payload = buildSchedulerPayload(instanceData);
      const scheduleResult = await runScheduler(payload);

      buildTimelineFromSchedule(scheduleResult);
      simulatedMinute.current = 0; 
      setStatus("Optimized schedule loaded");
      startTicker();
    } catch (err) {
      console.error(err);
      setStatus("Error loading schedule");
    }
  }

  function filterTimelineByChannel(channel, baseList = fullTimeline) {
    setSelectedChannel(channel);

    if (channel === "all") {
      setTimeline([...baseList]);
    } else {
      setTimeline(baseList.filter((p) => p.channel_name === channel));
    }

    setCurrentProgram(null);
  }

  function startTicker() {
    tickTimer.current = setInterval(() => tick(), 1000);
    tick();
  }

function tick() {
  if (!timeline.length && !fullTimeline.length) return;

  simulatedMinute.current += 1;

  const base = fullTimeline.length ? fullTimeline : timeline;
  const maxMinute = Math.max(...base.map((p) => p.raw_end));

  if (simulatedMinute.current > maxMinute) {
    simulatedMinute.current = 0;
  }

  const now = minutesToDate(simulatedMinute.current);
  setSimNow(now);
  const active = timeline.find((p) => now >= p.startDate && now < p.endDate);

  setCurrentProgram(active || null);
}

  function buildTimelineFromSchedule(scheduleResult) {
    const scheduled = scheduleResult?.scheduled_programs || [];

    if (!scheduled.length) {
      setTimeline([]);
      setFullTimeline([]);
      setCurrentProgram(null);
      return;
    }

    const programIndex = {};

    instanceData.channels.forEach((ch) => {
      (ch.programs || []).forEach((p) => {
        if (!p?.program_id) return;

        programIndex[p.program_id] = {
          ...p,
          channel_id: ch.channel_id,
          channel_name: ch.channel_name,
        };
      });
    });

    const builtTimeline = [];

    scheduled.forEach((sp) => {
      const real =
        programIndex[sp.program_id] ||
        Object.values(programIndex).find((p) => p.program_id === sp.program_id);

      if (!real) return;

      const link = real.link || real.youtube_link || real.url || null;

      builtTimeline.push({
        channel_id: sp.channel_id ?? real.channel_id,
        channel_name: real.channel_name || `Channel ${sp.channel_id}`,
        startDate: minutesToDate(sp.start),
        endDate: minutesToDate(sp.end),
        durationMin: sp.end - sp.start,
        videoId: extractVideoId(link),
        raw_start: sp.start,
        raw_end: sp.end,
        genre: real.genre,
        score: real.score,
        program_id: sp.program_id,
      });
    });

    builtTimeline.sort((a, b) => a.startDate - b.startDate);

    setFullTimeline(builtTimeline);

    if (
      selectedChannel !== "all" &&
      !builtTimeline.some((p) => p.channel_name === selectedChannel)
    ) {
      setSelectedChannel("all");
      setTimeline(builtTimeline);
    } else {
      filterTimelineByChannel(selectedChannel, builtTimeline);
    }
  }
  return {
    status,
    timeline,
    fullTimeline,
    currentProgram,
    selectedChannel,
    simNow,
    loadInstance,
    filterTimelineByChannel,
  };
}
