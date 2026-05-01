function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiRequest(handler) {
  await delay();
  try {
    const data = await handler();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unexpected error" };
  }
}
