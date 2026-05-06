// ./js/api/visitorApi.js

//async visitor storage

export async function fetchVisitors() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const visitors = JSON.parse(localStorage.getItem("visitors")) || [];
      resolve(visitors);
    }, 300);
  });
}

export async function addVisitor(visitor) {
  const visitors = JSON.parse(localStorage.getItem("visitors")) || [];
  visitors.push(visitor);
  localStorage.setItem("visitors", JSON.stringify(visitors));
}