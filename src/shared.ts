const SET_HEADERS = new Set(["content-type"]);

export const appendHeaders = (
  response: Response,
  headers: Array<[string, string]>,
) => {
  try {
    headers.forEach(([name, value]) => {
      if (SET_HEADERS.has(name.toLowerCase())) {
        response.headers.set(name, value);
      } else {
        response.headers.append(name, value);
      }
    });
  } catch {
    // Ignore immutable headers
  }
  return response;
};

export const authorized = (request: Request) => {
  if (
    request.method === "GET" &&
    request.headers.get("authorization") ===
      `Bearer ${Deno.env.get("SSR_API_KEY")}`
  ) {
    return true;
  }
};

export const redirect = (location: string | URL, status = 302) => {
  location = location instanceof URL ? location.href : location;
  return new Response(null, {
    status,
    headers: {
      location,
    },
  });
};

export const dateParts = (date: Date): Record<string, string> => {
  const ISO = date.toISOString();
  const D = date.getDate().toString();
  const dddd = date.toLocaleString("en-GB", { weekday: "long" });
  const dd = date.toLocaleString("en-GB", { weekday: "short" });
  const MMMM = date.toLocaleString("en-GB", { month: "long" });
  const MMM = date.toLocaleString("en-GB", { month: "short" });
  const YYYY = date.getFullYear().toString();
  const HH = date.getUTCHours().toString().padStart(2, "0");
  const mm = date.getUTCMinutes().toString().padStart(2, "0");
  return { ISO, D, dddd, dd, MMMM, MMM, YYYY, HH, mm };
};
