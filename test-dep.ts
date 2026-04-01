import "./loadEnv.js";
import { db } from "./helpers/db.tsx";

db.selectFrom('taskDependencies')
  .innerJoin('tasks as t1', 'taskDependencies.taskId', 't1.id')
  .innerJoin('tasks as t2', 'taskDependencies.dependsOnTaskId', 't2.id')
  .select(['taskDependencies.id'])
  .execute()
  .then((res) => { console.log(res); process.exit(0); })
  .catch((err) => { console.error(err); process.exit(1); });
