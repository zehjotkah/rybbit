export function useIsProduction() {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isProduction = hostname === "demo.rybbit.com" || hostname === "app.rybbit.com";
  const isAppProduction = hostname === "app.rybbit.com";

  return { isProduction, isAppProduction };
}
