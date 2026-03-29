import React, { useState } from "react";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";
import styles from "./coreact.tarefas.module.css";
import { Search, Calendar, MessageSquare, Paperclip, MoreHorizontal } from "lucide-react";

type TaskStatus = "To Do" | "In Progress" | "Review" | "Complete";

const MOCK_TASKS = [
  {
    id: "t1",
    title: "Project Management Web App",
    desc: "Make a design for a web application for organizing the workspace of an IT company.",
    status: "To Do" as TaskStatus,
    tags: ["Dribbble", "Design"],
    dueDate: "30 Jan",
    avatars: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2", "https://i.pravatar.cc/150?u=3"],
    extraUsers: 3,
    comments: 2,
    attachments: 1,
    image: ""
  },
  {
    id: "t2",
    title: "Online Catalog Development",
    desc: "Develop an online employee directory for a company with more than 50,000 employees. When performing a task, you need to use specific libraries.",
    status: "In Progress" as TaskStatus,
    tags: ["Dev", "Design"],
    dueDate: "3 Feb",
    avatars: ["https://i.pravatar.cc/150?u=4", "https://i.pravatar.cc/150?u=5"],
    extraUsers: 0,
    comments: 4,
    attachments: 1,
    image: ""
  },
  {
    id: "t3",
    title: "Fintech App",
    desc: "The goal is to create an intuitive, user-friendly, and visually appealing design that simplifies complex financial transactions.",
    status: "Review" as TaskStatus,
    tags: ["Design"],
    dueDate: "23 Jan",
    avatars: ["https://i.pravatar.cc/150?u=6", "https://i.pravatar.cc/150?u=7"],
    extraUsers: 0,
    comments: 5,
    attachments: 3,
    image: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "t4",
    title: "Finance Manager Dashboard",
    desc: "Make a design for a web application for organizing the workspace of an IT company.",
    status: "Complete" as TaskStatus,
    tags: ["Dribbble", "Design"],
    dueDate: "12 Jan",
    avatars: ["https://i.pravatar.cc/150?u=1"],
    extraUsers: 0,
    comments: 0,
    attachments: 0,
    image: ""
  },
  {
    id: "t5",
    title: "Refactor Authentication Logic",
    desc: "Consolidate NextAuth hooks into a single context provider.",
    status: "Complete" as TaskStatus,
    tags: ["Dev", "Security"],
    dueDate: "10 Jan",
    avatars: ["https://i.pravatar.cc/150?u=2"],
    extraUsers: 0,
    comments: 1,
    attachments: 0,
    image: ""
  }
];

const COLUMNS: TaskStatus[] = ["To Do", "In Progress", "Review", "Complete"];

export default function CoreactTarefas() {
  const { hasPermission } = usePermissions();
  const [tasks, setTasks] = useState(MOCK_TASKS);

  if (!hasPermission("coreactTarefas")) {
    return <PermissionWall moduleName="Tarefas" />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tarefas</h1>
        <button style={{
          padding: "0.75rem 1.5rem", background: "var(--text-primary)", 
          color: "var(--bg-primary)", borderRadius: "999px",
          border: "none", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer"
        }}>
          Criar Tarefa
        </button>
      </header>

      <div className={styles.kanbanBoard}>
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col);
          const isCompleteCol = col === "Complete";

          return (
            <div key={col} className={styles.kanbanColumn}>
              <div className={styles.columnHeader}>
                {col} <span className={styles.taskCount}>({colTasks.length})</span>
              </div>
              
              {colTasks.map(task => {
                // UX: Se a tarefa está "Complete", ela colapsa visualmente (discreta)
                if (isCompleteCol) {
                  return (
                    <div key={task.id} className={`${styles.card} ${styles.collapsed}`}>
                      <span className={styles.cardTitle}>{task.title}</span>
                      <div className={styles.avatarGroup}>
                        {task.avatars.slice(0, 1).map((url, i) => (
                          <div key={i} className={styles.avatar}>
                            <img src={url} alt="Team member" />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={task.id} className={styles.card}>
                    <div className={styles.cardTop}>
                      <div className={styles.tagGroup}>
                        {task.tags.map(tag => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                      <MoreHorizontal size={18} color="var(--text-tertiary)" />
                    </div>

                    <h3 className={styles.cardTitle}>{task.title}</h3>
                    <p className={styles.cardDesc}>{task.desc}</p>
                    
                    {task.image && (
                      <img src={task.image} alt={task.title} className={styles.cardImage} />
                    )}

                    <div className={styles.cardBottom}>
                      <div className={styles.dueDate}>
                        <Calendar size={12} />
                        {task.dueDate}
                      </div>

                      <div className={styles.metaIcons}>
                        <div className={styles.avatarGroup}>
                          {task.avatars.map((url, i) => (
                            <div key={i} className={styles.avatar} style={{ zIndex: 10 - i }}>
                              <img src={url} alt="Team member" />
                            </div>
                          ))}
                          {task.extraUsers > 0 && (
                            <div className={styles.avatar} style={{ fontSize: '0.6rem', fontWeight: 600, zIndex: 0 }}>
                              +{task.extraUsers}
                            </div>
                          )}
                        </div>

                        {task.comments > 0 && (
                          <div className={styles.metaItem}>
                            <MessageSquare size={14} /> {task.comments}
                          </div>
                        )}
                        {task.attachments > 0 && (
                          <div className={styles.metaItem}>
                            <Paperclip size={14} /> {task.attachments}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
