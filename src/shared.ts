export const appendHeaders = (
  response: Response,
  headers: [string, string][]
) => {
  try {
    headers.forEach(([name, value]) => {
      response.headers.append(name, value);
    });
  } catch {
    // Ignore immutable headers
  }
  return response;
};

export const authorized = (request: Request) => {
  if (
    request.method === 'GET' &&
    request.headers.get('authorization') ===
      `Bearer ${Deno.env.get('SSR_API_KEY')}`
  ) {
    return true;
  }
};

export const redirect = (location: string | URL, status = 302) => {
  location = location instanceof URL ? location.href : location;
  return new Response(null, {
    status,
    headers: {
      location
    }
  });
};

export const replace = (
  subject: string,
  search: string,
  replace = '',
  all = false
) => {
  let parts = subject.split(search);
  if (parts.length === 1) return subject;
  if (!all) parts = [parts.shift()!, parts.join(search)];
  return parts.join(replace);
};
