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

      // KRITIKE: Duhet t'i mbushësh të dyja state-et
      setFullTimeline(newTimeline);
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

  // Shto këtë useEffect që Player-i të përditësohet sapo ndërron kanalin
  // pa pritur sekondën e radhës të ticker-it
  useEffect(() => {
    const currentMin = simulatedMinute.current;
    let active = null;

    if (selectedChannel === "all") {
      active = fullTimeline.find(p => currentMin >= p.raw_start && currentMin < p.raw_end);
    } else {
      active = fullTimeline.find(p =>
        p.channel_name === selectedChannel &&
        currentMin >= p.raw_start &&
        currentMin < p.raw_end
      );
    }
    setCurrentProgram(active || null);
  }, [selectedChannel, fullTimeline]);

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
    if (!fullTimeline.length) return;

    simulatedMinute.current += 1;

    // Gjejmë minutën maksimale nga të gjitha programet
    const maxMinute = Math.max(...fullTimeline.map((p) => p.raw_end));

    if (simulatedMinute.current > maxMinute) {
      simulatedMinute.current = 0;
    }

    const now = minutesToDate(simulatedMinute.current);
    setSimNow(now);

    // LOGJIKA E RE:
    let active = null;

    if (selectedChannel === "all") {
      // Nëse janë "all", gjej programin e parë që përshtatet me kohën (ose sipas prioriteti)
      active = fullTimeline.find((p) =>
        simulatedMinute.current >= p.raw_start &&
        simulatedMinute.current < p.raw_end
      );
    } else {
      // Nëse është zgjedhur kanal specifik, kërko programin AKTIV vetëm për atë kanal
      active = fullTimeline.find((p) =>
        p.channel_name === selectedChannel &&
        simulatedMinute.current >= p.raw_start &&
        simulatedMinute.current < p.raw_end
      );
    }

    setCurrentProgram(active || null);
  }
  function buildTimelineFromSchedule(scheduleResult, instance) {
    if (!instance || !instance.channels) return [];

    return instance.channels.flatMap(channel =>
      channel.programs.map(program => {
        let videoId = null;
        if (program.link) {
          const match = program.link.match(/[?&]v=([^&#]+)/);
          if (match) videoId = match[1];
        }

        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setMinutes(program.start);

        const endDate = new Date();
        endDate.setHours(0, 0, 0, 0);
        endDate.setMinutes(program.end);

        return {
          ...program,
          channel_name: channel.channel_name,
          videoId,
          startDate,
          endDate,
          raw_start: program.start, // E rëndësishme për krahasim
          raw_end: program.end      // E rëndësishme për krahasim
        };
      })
    );
  }
  return {
    status,
    timeline,
    fullTimeline,
    currentProgram,
    selectedChannel,
    simNow,
    simMinute: simulatedMinute.current, 
    loadInstance,
    filterTimelineByChannel,
  };
}
