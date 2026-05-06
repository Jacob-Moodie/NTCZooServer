// ./js/api/zooStatusApi.js

// async zoo status API

export async function fetchZooStatus(zoo) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hasOpenAnimals = zoo.animals.some(a => a.status === "open");

      resolve({
        status: hasOpenAnimals ? "Open" : "Closed",
        totalAnimals: zoo.animals.length
      });
    }, 500);
  });
}