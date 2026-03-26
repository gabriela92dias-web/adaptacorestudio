import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import styles from "./CoreactExecutiveHome.module.css";
import { FileText, Activity } from "lucide-react";

// --- MOCK DATA ---
const barData = [
  { name: "AM", projectA: 80, projectB: 60, projectC: 40, projectD: 60 },
  { name: "CH", projectA: 20, projectB: 120, projectC: 80, projectD: 80 },
  { name: "CR", projectA: 40, projectB: 40, projectC: 80, projectD: 40 },
  { name: "EK", projectA: 100, projectB: 60, projectC: 40, projectD: 40 },
  { name: "FA", projectA: 120, projectB: 80, projectC: 40, projectD: 30 },
];
const barColors = ["var(--primary)", "var(--muted-foreground)", "var(--border)", "var(--ring)", "var(--foreground)"];

const scheduleDays = [
  { day: "Sat", date: 4, type: "light" },
  { day: "Sun", date: 5, type: "light" },
  { day: "Mon", date: 6, type: "light" },
  { day: "Tue", date: 7, type: "light" },
  { day: "Wed", date: 8, type: "active" },
  { day: "Thu", date: 9, type: "normal" },
  { day: "Fri", date: 10, type: "light" },
];

const inProgressList = [
  { title: "Design", desc: "Low-fidelity wireframe mobile", value: 75, color: "var(--primary)" },
  { title: "Research", desc: "Auditing information architecture", value: 55, color: "var(--muted-foreground)" },
  { title: "Content", desc: "Improve clarity support docs", value: 30, color: "var(--foreground)" },
  { title: "Development", desc: "Fix header layout", value: 87, color: "var(--ring)" },
];

const timelineNodes = [
  { date: "01.09.2023", title: "Asana Integration", desc: "Line height for baselines is 10%", pos: "top" },
  { date: "14.09.2023", title: "Github Integration", desc: "Line height for baselines is 10%", pos: "bottom" },
  { date: "24.09.2023", title: "Slack Bot", desc: "Line height for baselines is 10%", pos: "top" },
  { date: "02.10.2023", title: "Release V2.3.0", desc: "Line height for baselines is 10%", pos: "bottom" },
];

export function CoreactExecutiveHome({ userName }: { userName: string }) {
  // Simple gauge logic
  const renderGauge = (value: number, color: string) => {
    const data = [{ name: 'A', value }, { name: 'B', value: 100 - value }];
    return (
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={25}
              outerRadius={35}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill="rgba(120,120,120,0.1)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className={styles.metricValue} style={{ fontSize: '0.85rem' }}>{value}K</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      
      <div className={styles.topGrid}>
        {/* LEFT COLUMN */}
        <div className={styles.leftColumn}>
          
          <div className={styles.welcomeBanner}>
            <div className={styles.welcomeText}>
              <h1>Olá, {userName}!</h1>
              <p>Bem-vinda de volta. O panorama central da agência está pronto. Você tem 3 aprovações pendentes para hoje.</p>
            </div>
          </div>

          <div className={styles.projectsByOwnerCard}>
            <h3 className={styles.cardTitle}>Projects by Owner</h3>
            <div style={{ height: 130, width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barSize={20} margin={{ top: 15, right: 0, left: -20, bottom: -5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  <Bar dataKey="projectA" stackId="a" fill={barColors[0]} radius={[0, 0, 4, 4]} />
                  <Bar dataKey="projectB" stackId="a" fill={barColors[1]} />
                  <Bar dataKey="projectC" stackId="a" fill={barColors[2]} />
                  <Bar dataKey="projectD" stackId="a" fill={barColors[3]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              {/* Fake Avatars manually placed over bars for the visual effect */}
              <div style={{ position: 'absolute', top: 0, left: 'calc(10% - 10px)', display: 'flex', gap: 'calc(20% - 12px)', width: '90%', pointerEvents: 'none' }}>
                <Avatar style={{ width: 20, height: 20 }}><AvatarFallback style={{ fontSize: 9 }}>AM</AvatarFallback></Avatar>
                <Avatar style={{ width: 20, height: 20, marginTop: -10 }}><AvatarFallback style={{ fontSize: 9 }}>CH</AvatarFallback></Avatar>
                <Avatar style={{ width: 20, height: 20, marginTop: 15 }}><AvatarFallback style={{ fontSize: 9 }}>CR</AvatarFallback></Avatar>
                <Avatar style={{ width: 20, height: 20, marginTop: -3 }}><AvatarFallback style={{ fontSize: 9 }}>EK</AvatarFallback></Avatar>
                <Avatar style={{ width: 20, height: 20, marginTop: -15 }}><AvatarFallback style={{ fontSize: 9 }}>FA</AvatarFallback></Avatar>
              </div>
            </div>
          </div>

          <div className={styles.darkCardsRow}>
            <div className={styles.darkCard}>
              <div className={styles.darkCardHeader}>
                <span><FileText size={14} /> Budget Usage</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <div style={{ position: 'relative', width: 90, height: 90 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{value:75}, {value:25}]} innerRadius={35} outerRadius={45} dataKey="value" stroke="none">
                        <Cell fill="var(--primary)" />
                        <Cell fill="var(--border)" />
                      </Pie>
                      <Pie data={[{value:40}, {value:60}]} innerRadius={22} outerRadius={30} dataKey="value" stroke="none">
                        <Cell fill="var(--muted-foreground)" />
                        <Cell fill="rgba(120,120,120,0.05)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>$180k</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.darkPanelsCombo}>
               <div className={styles.metricRing}>
                 {renderGauge(68, "#ec4899")}
                 <span className={styles.metricLabel}>Aliqua</span>
               </div>
               <div className={styles.metricRing}>
                 {renderGauge(33, "#fcd34d")}
                 <span className={styles.metricLabel}>Veniam</span>
               </div>
               <div className={styles.metricRing}>
                 {renderGauge(21, "#818cf8")}
                 <span className={styles.metricLabel}>Cillum</span>
               </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightColumn}>
          
          <div className={styles.scheduleCard}>
            <h3 className={styles.cardTitle}>My Tasks Schedule</h3>
            <div className={styles.scheduleStrip}>
              {scheduleDays.map((sd, i) => (
                <div key={i} className={styles.scheduleDay}>
                  <span className={styles.dayLabel}>{sd.day}</span>
                  <div className={`${styles.dayCirc} ${sd.type === 'active' ? styles.dayCircActive : sd.type === 'light' ? styles.dayCircLight : ''}`}>
                    {sd.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.overallProgressCard}>
            <h3 className={styles.cardTitle} style={{ alignSelf: 'flex-start' }}>Overall Progress</h3>
            
            {/* Half Donut */}
            <div style={{ width: '100%', height: 90, position: 'relative', marginTop: '0.5rem' }}>
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{value:1},{value:1},{value:1},{value:1},{value:1},{value:1},{value:1},{value:1}]}
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="var(--primary)" /><Cell fill="var(--primary)" /><Cell fill="var(--primary)" /><Cell fill="var(--muted-foreground)" />
                    <Cell fill="var(--muted-foreground)" /><Cell fill="var(--border)" /><Cell fill="var(--border)" /><Cell fill="var(--ring)" />
                  </Pie>
                </PieChart>
               </ResponsiveContainer>
               <div style={{ position: 'absolute', bottom: '15%', left: 0, right: 0, textAlign: 'center' }}>
                 <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>77%</div>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>Near complete</div>
               </div>
            </div>

            {/* List */}
            <div className={styles.inProgressList}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>In Progress</span>
                <span style={{ color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer' }}>View All</span>
              </div>
              
              {inProgressList.map((item, i) => (
                <div key={i} className={styles.progressItem}>
                  <div className={styles.progressRingCircle} style={{ border: `3px solid ${item.color}40`, borderTopColor: item.color }}>
                    {item.value}
                  </div>
                  <div className={styles.progressItemInfo}>
                    <span className={styles.progressItemTitle}>{item.title}</span>
                    <span className={styles.progressItemSubtitle}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* MATRIX TIMELINE */}
      <div className={styles.timelineCard}>
        <div className={styles.timelineHeader}>TIMELINE</div>
        <div className={styles.timelineTrack}>
          <div className={styles.timelineLine}></div>
          
          {timelineNodes.map((node, i) => (
            <div key={i} className={styles.timelineNode}>
              <div className={styles.nodeDiamond}></div>
              
              <div className={node.pos === 'top' ? styles.nodeContentTop : styles.nodeContentBottom}>
                <div className={styles.nodeDate}>{node.date}</div>
                <div className={styles.nodeTitle}>{node.title}</div>
                <div className={styles.nodeDesc}>{node.desc}</div>
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}
