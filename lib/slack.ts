// ============================================================
// AI Product Studio — Slack Webhook Notifications
// ============================================================

import type { SlackNotificationPayload, SlackEventType, Project } from "./types";

// ─── Config ──────────────────────────────────────────────────

const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ai-product-studio.vercel.app";

// ─── Slack Block Kit Types ────────────────────────────────────

interface SlackBlock {
  type: string;
  [key: string]: unknown;
}

interface SlackPayload {
  text: string;
  blocks?: SlackBlock[];
  username?: string;
  icon_emoji?: string;
}

// ─── Core ────────────────────────────────────────────────────

export async function sendSlackNotification(
  payload: SlackNotificationPayload
): Promise<boolean> {
  if (!WEBHOOK_URL) {
    console.warn("[Slack] SLACK_WEBHOOK_URL not set — skipping notification");
    return false;
  }

  const slackPayload = buildSlackPayload(payload);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackPayload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Slack] Webhook failed:", response.status, text);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Slack] Network error:", error);
    return false;
  }
}

export async function slackHealthCheck(): Promise<{
  ok: boolean;
  latency_ms: number;
}> {
  if (!WEBHOOK_URL) return { ok: false, latency_ms: 0 };

  const start = Date.now();
  try {
    const ok = await sendSlackNotification({
      event: "project.created",
      message: "🏥 Health check ping",
      severity: "info",
    });
    return { ok, latency_ms: Date.now() - start };
  } catch {
    return { ok: false, latency_ms: Date.now() - start };
  }
}

// ─── Convenience Wrappers ────────────────────────────────────

export async function notifyIntakeReceived(
  project: Pick<Project, "id" | "name" | "client_name" | "status">
): Promise<void> {
  await sendSlackNotification({
    event: "intake.received",
    project,
    message: `New project intake received from *${project.client_name}*`,
    details: { project_name: project.name },
    severity: "info",
  });
}

export async function notifyDiscoveryCompleted(
  project: Pick<Project, "id" | "name" | "client_name" | "status">
): Promise<void> {
  await sendSlackNotification({
    event: "discovery.completed",
    project,
    message: `Discovery analysis completed for *${project.name}*`,
    severity: "info",
  });
}

export async function notifyDeliverableGenerated(
  project: Pick<Project, "id" | "name" | "client_name" | "status">,
  deliverableType: string
): Promise<void> {
  await sendSlackNotification({
    event: "deliverable.generated",
    project,
    message: `New *${deliverableType}* deliverable generated for *${project.name}*`,
    details: { type: deliverableType },
    severity: "info",
  });
}

export async function notifyCriticalError(
  error: Error,
  context: string
): Promise<void> {
  await sendSlackNotification({
    event: "error.critical",
    message: `🚨 Critical error in *${context}*: ${error.message}`,
    details: { context, stack: error.stack?.slice(0, 200) ?? "" },
    severity: "error",
  });
}

// ─── Payload Builder ─────────────────────────────────────────

function buildSlackPayload(payload: SlackNotificationPayload): SlackPayload {
  const emoji = getEventEmoji(payload.event, payload.severity);
  const color = getSeverityColor(payload.severity ?? "info");
  const projectUrl = payload.project
    ? `${APP_URL}/projects/${payload.project.id}`
    : null;

  const headerText = `${emoji} ${getEventTitle(payload.event)}`;
  const bodyText = payload.message ?? headerText;

  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: { type: "plain_text", text: headerText, emoji: true },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: bodyText },
    },
  ];

  if (payload.project) {
    blocks.push({
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Project:*\n${payload.project.name}`,
        },
        {
          type: "mrkdwn",
          text: `*Client:*\n${payload.project.client_name}`,
        },
        {
          type: "mrkdwn",
          text: `*Status:*\n${payload.project.status}`,
        },
        {
          type: "mrkdwn",
          text: `*Time:*\n<!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}|${new Date().toISOString()}>`,
        },
      ],
    });
  }

  if (payload.details && Object.keys(payload.details).length > 0) {
    const detailText = Object.entries(payload.details)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => `*${k.replace(/_/g, " ")}:* ${v}`)
      .join("\n");

    if (detailText) {
      blocks.push({
        type: "section",
        text: { type: "mrkdwn", text: detailText },
      });
    }
  }

  if (projectUrl) {
    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "View Project", emoji: true },
          url: projectUrl,
          style: color === "#36a64f" ? "primary" : undefined,
        },
      ],
    });
  }

  blocks.push({ type: "divider" });

  return {
    text: bodyText,
    blocks,
    username: "AI Product Studio",
    icon_emoji: ":robot_face:",
  };
}

// ─── Helpers ─────────────────────────────────────────────────

function getEventEmoji(
  event: SlackEventType,
  severity?: SlackNotificationPayload["severity"]
): string {
  if (severity === "error") return "🚨";
  if (severity === "warning") return "⚠️";

  const map: Record<SlackEventType, string> = {
    "project.created": "🆕",
    "project.updated": "✏️",
    "project.completed": "✅",
    "intake.received": "📥",
    "discovery.started": "🔍",
    "discovery.completed": "🎯",
    "deliverable.generated": "📄",
    "deliverable.approved": "✅",
    "error.critical": "🚨",
  };
  return map[event] ?? "ℹ️";
}

function getEventTitle(event: SlackEventType): string {
  const map: Record<SlackEventType, string> = {
    "project.created": "New Project Created",
    "project.updated": "Project Updated",
    "project.completed": "Project Completed",
    "intake.received": "New Intake Received",
    "discovery.started": "Discovery Started",
    "discovery.completed": "Discovery Completed",
    "deliverable.generated": "Deliverable Generated",
    "deliverable.approved": "Deliverable Approved",
    "error.critical": "Critical Error",
  };
  return map[event] ?? event;
}

function getSeverityColor(severity: string): string {
  const map: Record<string, string> = {
    info: "#36a64f",
    warning: "#ffcc00",
    error: "#ff0000",
  };
  return map[severity] ?? "#36a64f";
}
