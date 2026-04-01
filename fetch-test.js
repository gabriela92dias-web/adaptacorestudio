fetch('http://localhost:3333/_api/coreact/dependencies/list?input={"json":{}}')
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
