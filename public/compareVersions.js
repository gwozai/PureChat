const VERSION = "version";

function compareVersions(latest, current) {
  // 检查版本号是否有效
  if (!/^\d+(\.\d+)*$/.test(latest) || !/^\d+(\.\d+)*$/.test(current)) {
    throw new Error("无效的版本格式");
  }
  const lat = latest.split(".").map(Number);
  const cur = current.split(".").map(Number);
  for (let i = 0; i < Math.max(lat.length, cur.length); i++) {
    const num1 = lat[i] || 0;
    const num2 = cur[i] || 0;
    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}

function checkForUpdates() {
  try {
    const latestVersion = JSON.parse(window.__APP_INFO__).pkg.version; // 0.3.4
    const version = localStorage.getItem(VERSION);
    if (version) {
      const versionComparison = compareVersions(latestVersion, version);
      if (versionComparison === 0) {
        console.log("已经是最新版本");
      } else if (versionComparison > 0) {
        console.log("发现新版本:", latestVersion);
        localStorage.clear();
      } else {
        localStorage.clear();
      }
    } else {
      localStorage.clear();
      localStorage.setItem(VERSION, latestVersion);
    }
  } catch (error) {
    console.error(error);
  }
}

checkForUpdates();
