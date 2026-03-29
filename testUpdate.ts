import { postCoreactTasksUpdate } from "./endpoints/coreact/tasks/update_POST.schema.js";

async function run() {
  try {
    const res = await postCoreactTasksUpdate({
      id: "non-existent",
      startDate: new Date(),
    });
    console.log("Success:", res);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
