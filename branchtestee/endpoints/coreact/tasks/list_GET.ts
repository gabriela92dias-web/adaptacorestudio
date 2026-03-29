import { schema, OutputType, TaskWithActions } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { Selectable } from "kysely";
import { TaskActions, Executions } from "../../../helpers/schema";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    let query = db.selectFrom("tasks")
      .leftJoin("projects", "tasks.projectId", "projects.id")
      .leftJoin("teamMembers", "tasks.assigneeId", "teamMembers.id")
      .leftJoin("projectStages", "tasks.stageId", "projectStages.id")
      .selectAll("tasks")
      .select([
        "projects.name as projectName",
        "teamMembers.name as assigneeName",
        "teamMembers.initials as assigneeInitials",
        "projectStages.name as stageName",
      ]);

    if (input.projectId) {
      query = query.where("tasks.projectId", "=", input.projectId);
    }
    if (input.status) {
      query = query.where("tasks.status", "=", input.status);
    }

    // Filter by operatorId using the same deep logic as daily-view_GET
    if (input.operatorId) {
      query = query.where((eb) =>
        eb.or([
          eb("tasks.assigneeId", "=", input.operatorId!),
          eb("tasks.id", "in",
            eb.selectFrom("taskActions")
              .select("taskId")
              .where((eb2) =>
                eb2.or([
                  eb2("taskActions.assignedTo", "=", input.operatorId!),
                  eb2("taskActions.operatorId", "=", input.operatorId!),
                ])
              )
          ),
        ])
      );
    }

    // Filter by date range overlap: (startDate IS NULL OR startDate <= dateTo) AND (endDate IS NULL OR endDate >= dateFrom)
    if (input.dateFrom || input.dateTo) {
      if (input.dateTo) {
        query = query.where((eb) =>
          eb.or([
            eb("tasks.startDate", "is", null),
            eb("tasks.startDate", "<=", input.dateTo!),
          ])
        );
      }
      if (input.dateFrom) {
        query = query.where((eb) =>
          eb.or([
            eb("tasks.endDate", "is", null),
            eb("tasks.endDate", ">=", input.dateFrom!),
          ])
        );
      }
    }

    const tasksResult = await query.execute();
    const taskIds = tasksResult.map((t) => t.id);

    let actionsMap = new Map<string, Selectable<TaskActions>[]>();
    let executionsMap = new Map<string, Selectable<Executions>[]>();

    if (input.includeActions && taskIds.length > 0) {
      const actions = await db.selectFrom("taskActions")
        .selectAll()
        .where("taskId", "in", taskIds)
        .execute();

      for (const action of actions) {
        const existing = actionsMap.get(action.taskId) ?? [];
        existing.push(action);
        actionsMap.set(action.taskId, existing);
      }

      const actionIds = actions.map((a) => a.id);
      if (actionIds.length > 0) {
        const executions = await db.selectFrom("executions")
          .selectAll()
          .where("taskActionId", "in", actionIds)
          .execute();

        for (const execution of executions) {
          const existing = executionsMap.get(execution.taskActionId) ?? [];
          existing.push(execution);
          executionsMap.set(execution.taskActionId, existing);
        }
      }
    }

    const tasks: TaskWithActions[] = tasksResult.map((task) => {
      if (!input.includeActions) {
        return task;
      }
      const taskActions = (actionsMap.get(task.id) ?? []).map((action) => ({
        ...action,
        executions: executionsMap.get(action.id) ?? [],
      }));
      return { ...task, actions: taskActions };
    });

    // Compute totalTimeLogged when operatorId AND dateFrom are both provided
    let totalTimeLogged: number | undefined = undefined;
    if (input.operatorId && input.dateFrom) {
      let executionQuery = db.selectFrom("executions")
        .select((eb) => eb.fn.sum<number>("durationMinutes").as("totalMinutes"))
        .where("operatorId", "=", input.operatorId);

      executionQuery = executionQuery.where("startedAt", ">=", input.dateFrom);

      if (input.dateTo) {
        executionQuery = executionQuery.where("startedAt", "<=", input.dateTo);
      }

      const result = await executionQuery.executeTakeFirst();
      totalTimeLogged = Number(result?.totalMinutes ?? 0);
    }

    const output: OutputType = { tasks };
    if (totalTimeLogged !== undefined) {
      output.totalTimeLogged = totalTimeLogged;
    }

    return new Response(superjson.stringify(output satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}