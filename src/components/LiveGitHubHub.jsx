/**
 * ============================================================================
 * LIVE GITHUB DEV HUB COMPONENT
 * ============================================================================
 * Fetches real-time telemetry, repository stats, and live code activity
 * directly from the GitHub REST API (goyalshiwant8-create).
 * Features:
 * - Real Public Repo count
 * - Live follower telemetry
 * - Dynamic list of recently updated GitHub repositories
 * - Live sync indicator & manual refresh trigger
 * - Smooth fallback to curated cache if rate-limited or offline
 */

function LiveGitHubHub({ breathingStyle }) {
  const { socials } = window.portfolioData || {};
  const username = socials?.github?.username || "goyalshiwant8-create";

  const [userData, setUserData] = React.useState(null);
  const [repos, setRepos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdated, setLastUpdated] = React.useState(null);
  const [fetchError, setFetchError] = React.useState(null);

  const fetchGitHubData = React.useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      // 1. Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error(`User fetch failed (${userRes.status})`);
      const userJson = await userRes.json();
      setUserData(userJson);

      // 2. Fetch recent public repos
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
      );
      if (!reposRes.ok) throw new Error(`Repos fetch failed (${reposRes.status})`);
      const reposJson = await reposRes.json();
      setRepos(reposJson);

      setLastUpdated(new Date().toLocaleTimeString("en-US", { hour12: true, hour: "numeric", minute: "2-digit" }));
    } catch (err) {
      setFetchError(err.message);
      // Fallback cache so the card never looks broken
      setUserData({
        public_repos: 4,
        followers: 1,
        following: 1,
        name: "Shiwant Goyal",
        html_url: `https://github.com/${username}`,
      });
      setRepos([
        {
          id: 1,
          name: "SHIWANT-GOYAL",
          description: "Personal Demon Slayer themed developer portfolio with Web Audio & React architecture.",
          language: "JavaScript",
          stargazers_count: 1,
          html_url: `https://github.com/${username}/SHIWANT-GOYAL`,
        },
        {
          id: 2,
          name: "C-Lectures-And-Labs",
          description: "BCA 1st Year C programming exercises, pointer models, loops, and algorithmic calculators.",
          language: "C",
          stargazers_count: 0,
          html_url: `https://github.com/${username}`,
        },
        {
          id: 3,
          name: "HTML-Questions-Practice",
          description: "Comprehensive semantic HTML5 and modern CSS3 practice exercises and responsive layouts.",
          language: "HTML",
          stargazers_count: 0,
          html_url: `https://github.com/${username}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  React.useEffect(() => {
    fetchGitHubData();
  }, [fetchGitHubData]);

  const handleRefresh = () => {
    if (window.soundManager) window.soundManager.playKatanaChime();
    fetchGitHubData();
  };

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hub Card Container */}
        <div className="rounded-2xl bg-[#0c1017]/90 border border-white/10 hover:border-cyan-500/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-mono font-semibold tracking-wider text-emerald-300 uppercase">
                  ● Live GitHub Telemetry
                </span>
                {lastUpdated && (
                  <span className="text-[10px] font-mono text-gray-400">
                    // Synced at {lastUpdated}
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-space flex items-center gap-2">
                <span>Real-Time Code Activity</span>
                <span className="text-lg">⚡</span>
              </h3>
            </div>

            {/* Profile Action & Refresh */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                title="Re-sync data from GitHub API"
              >
                <span className={loading ? "animate-spin" : ""}>🔄</span>
                <span>{loading ? "Syncing..." : "Sync Live API"}</span>
              </button>

              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 shadow-md shadow-cyan-950 transition-all hover:scale-105"
              >
                <span>@{username}</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-2xl font-bold font-mono text-cyan-300">
                {userData?.public_repos ?? "..."}
              </span>
              <span className="block text-xs font-mono text-gray-400 mt-1">Public Repos</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-2xl font-bold font-mono text-emerald-300">
                {userData?.followers ?? "..."}
              </span>
              <span className="block text-xs font-mono text-gray-400 mt-1">Followers</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-2xl font-bold font-mono text-amber-300">
                BCA Yr 1
              </span>
              <span className="block text-xs font-mono text-gray-400 mt-1">Academic Rank</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-2xl font-bold font-mono text-purple-300">
                滅 100%
              </span>
              <span className="block text-xs font-mono text-gray-400 mt-1">Total Concentration</span>
            </div>
          </div>

          {/* Live Repositories Grid */}
          <div className="mt-4">
            <span className="text-xs font-mono text-gray-400 block mb-3 uppercase tracking-wider">
              Latest Synchronized Repositories:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 rounded-xl bg-[#090d13] border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 font-mono truncate">
                        {repo.name}
                      </h4>
                      {repo.language && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {repo.description || "Public repository for BCA programming & web practice."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-500 flex items-center gap-1">
                      <span>★</span> {repo.stargazers_count || 0}
                    </span>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-medium"
                    >
                      <span>Inspect</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

if (typeof window !== "undefined") {
  window.LiveGitHubHub = LiveGitHubHub;
}
