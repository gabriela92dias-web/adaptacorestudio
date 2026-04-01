const result = await fetch("http://localhost:3001/_api/coreact/initiatives/list?input=null");
const text = await result.text();
console.log("Status:", result.status);
console.log("Response:", text);
