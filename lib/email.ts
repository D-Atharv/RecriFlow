import "server-only";

import { Resend } from "resend";

import { env } from "@/lib/env";
import type { Recommendation, RejectionCategory, RoundType } from "@/types/domain";

interface InterviewerAssignmentPayload {
  interviewerEmail: string;
  interviewerName: string;
  candidateName: string;
  roundType: RoundType;
  scheduledAt: string | null;
  feedbackUrl: string;
}

interface FeedbackSubmittedPayload {
  recruiterEmail: string;
  recruiterName: string;
  candidateName: string;
  roundType: RoundType;
  overallRating: number;
  recommendation: Recommendation;
}

interface CandidateRejectedPayload {
  recruiterEmail: string;
  recruiterName: string;
  candidateName: string;
  category: RejectionCategory;
  notes: string;
}

function hasEmailConfig(): boolean {
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
}

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!hasEmailConfig()) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }

  return resendClient;
}

function toAbsoluteUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    return;
  }

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: [options.to],
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}

export async function sendInterviewerAssignmentEmail(payload: InterviewerAssignmentPayload): Promise<void> {
  const feedbackUrl = toAbsoluteUrl(payload.feedbackUrl);
  const safeCandidateName = escapeHtml(payload.candidateName);
  const safeInterviewerName = escapeHtml(payload.interviewerName);
  const safeRoundType = escapeHtml(payload.roundType);
  const scheduledText = payload.scheduledAt ? new Date(payload.scheduledAt).toLocaleString() : "To be scheduled";

  await sendEmail({
    to: payload.interviewerEmail,
    subject: `Interview Assignment: ${payload.candidateName} (${payload.roundType})`,
    text: [
      `Hi ${payload.interviewerName},`,
      "",
      `You have been assigned to interview ${payload.candidateName}.`,
      `Round Type: ${payload.roundType}`,
      `Scheduled At: ${scheduledText}`,
      `Feedback Link: ${feedbackUrl}`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;">
        <h2>RecriFlow Interview Assignment</h2>
        <p>Hi ${safeInterviewerName},</p>
        <p>You have been assigned to interview <strong>${safeCandidateName}</strong>.</p>
        <ul>
          <li><strong>Round Type:</strong> ${safeRoundType}</li>
          <li><strong>Scheduled At:</strong> ${escapeHtml(scheduledText)}</li>
        </ul>
        <p>
          <a href="${feedbackUrl}" style="display:inline-block;background:#111827;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none;">
            Open Feedback Form
          </a>
        </p>
      </div>
    `,
  });
}

export async function sendFeedbackSubmittedEmail(payload: FeedbackSubmittedPayload): Promise<void> {
  const safeRecruiterName = escapeHtml(payload.recruiterName);
  const safeCandidateName = escapeHtml(payload.candidateName);
  const safeRoundType = escapeHtml(payload.roundType);
  const safeRecommendation = escapeHtml(payload.recommendation);

  await sendEmail({
    to: payload.recruiterEmail,
    subject: `Feedback Submitted: ${payload.candidateName} (${payload.roundType})`,
    text: [
      `Hi ${payload.recruiterName},`,
      "",
      `Feedback was submitted for ${payload.candidateName}.`,
      `Round Type: ${payload.roundType}`,
      `Overall Rating: ${payload.overallRating}/5`,
      `Recommendation: ${payload.recommendation}`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;">
        <h2>RecriFlow Feedback Update</h2>
        <p>Hi ${safeRecruiterName},</p>
        <p>Feedback has been submitted for <strong>${safeCandidateName}</strong>.</p>
        <ul>
          <li><strong>Round Type:</strong> ${safeRoundType}</li>
          <li><strong>Overall Rating:</strong> ${payload.overallRating}/5</li>
          <li><strong>Recommendation:</strong> ${safeRecommendation}</li>
        </ul>
      </div>
    `,
  });
}

export async function sendCandidateRejectedEmail(payload: CandidateRejectedPayload): Promise<void> {
  const safeRecruiterName = escapeHtml(payload.recruiterName);
  const safeCandidateName = escapeHtml(payload.candidateName);
  const safeCategory = escapeHtml(payload.category);
  const safeNotes = escapeHtml(payload.notes);

  await sendEmail({
    to: payload.recruiterEmail,
    subject: `Candidate Rejected: ${payload.candidateName}`,
    text: [
      `Hi ${payload.recruiterName},`,
      "",
      `Candidate ${payload.candidateName} has been marked as rejected.`,
      `Category: ${payload.category}`,
      `Notes: ${payload.notes}`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;">
        <h2>RecriFlow Rejection Update</h2>
        <p>Hi ${safeRecruiterName},</p>
        <p><strong>${safeCandidateName}</strong> has been marked as rejected.</p>
        <ul>
          <li><strong>Category:</strong> ${safeCategory}</li>
          <li><strong>Notes:</strong> ${safeNotes}</li>
        </ul>
      </div>
    `,
  });
}
