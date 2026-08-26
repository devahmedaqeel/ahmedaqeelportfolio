export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/health" || url.pathname === "/ping") {
      return new Response("OK", { status: 200 });
    }
    return fetch(request);
  }
};
