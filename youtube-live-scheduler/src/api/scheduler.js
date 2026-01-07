const SCHEDULER_API = "https://api-host-scheduar.onrender.com/api/Schedule";

export function buildSchedulerPayload(instanceData) {
  return {
    opening_time: 0,
    closing_time: 723,
    min_duration: 30,
    max_consecutive_genre: 2,
    channels_count: instanceData.channels.length,
    switch_penalty: 3,
    termination_penalty: 15,
    priority_blocks: [], 
    time_preferences: [], 
    channels: instanceData.channels,
  };
}

export async function runScheduler(payload) {
  const res = await fetch(SCHEDULER_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Scheduler failed");
  }

  return await res.json();
}
