import { BareMuxConnection } from "/public/baremux/index.js";

async function initBareMux() {
  try {
    const connection = new BareMuxConnection("/public/baremux/worker.js");
    
    await connection.setTransport("/public/epoxy/index.mjs", [{ 
      wisp: "wss://wisp.mercurywork.shop/" 
    }]);
    
    console.log("BareMux initialized successfully!");
  } catch (error) {
    console.error("BareMux initialization failed:", error);
  }
}

// Initialize when the page loads
if (typeof window !== 'undefined') {
  initBareMux();
}