import { useEffect, useRef, useState } from "react";
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
  const [instanceData, setInstanceData] = useState(null);


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


  async function loadInstance(customInstance) {
    if (!customInstance) return;

    setStatus("Running scheduling algorithm...");

    try {
      const payload = buildSchedulerPayload(customInstance);
      const scheduleResult = await runScheduler(payload);

      const newTimeline = buildTimelineFromSchedule(scheduleResult, customInstance);

      setTimeline(newTimeline);

      if (newTimeline.length > 0) {
        setCurrentProgram(newTimeline[0]);
      }

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
  function buildTimelineFromSchedule(scheduleResult, instance) {
    if (!instance || !instance.channels) {
      console.error("Instance invalid:", instance);
      return [];
    }

    const timeline = instance.channels
      .map(channel =>
        channel.programs.map(program => {
          let videoId = null;
          if (program.link) {
            const match = program.link.match(/v=([a-zA-Z0-9_-]+)/);
            if (match) videoId = match[1];
          }

          // konverto start/end në Date bazuar në opening_time
          const startDate = new Date();
          startDate.setHours(0, 0, 0, 0); // nis nga ora 00:00
          startDate.setMinutes(program.start); // shto minutat

          const endDate = new Date();
          endDate.setHours(0, 0, 0, 0);
          endDate.setMinutes(program.end);

          return {
            ...program,
            channel_name: channel.channel_name,
            videoId,
            startDate,
            endDate,
          };
        })
      )
      .flat();


    return timeline;
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
