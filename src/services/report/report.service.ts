import { createWriteStream } from "fs";
import Member from "../../models/member/member.model";
import Membership from "../../models/membership/membership.model";
import Report from "../../models/report/report.model";
import Workout from "../../models/workout/workout.model";
import pdfkit from "pdfkit";
import { Readable } from "stream";
export async function getMembersByTrainerId(trainerId: any) {
  const trainer = trainerId;
  const membership = await Membership.find({ trainer });

  const members = await Promise.all(
    membership.map(async (membership) => {
      const member = await Member.findById(membership.member);
      return member;
    })
  );

  return { members };
}

export async function createReport(reportData: any) {
  const doc = new pdfkit();
  // doc.text(JSON.stringify(reportData));
  const date = new Date(Date.now());
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Add title

  doc.fontSize(16).text(formattedDate, { align: "left" });
  doc.fontSize(16).text(reportData.member, { align: "right" });
  doc.moveDown(1.5);
  // Add introduction
  doc.fontSize(19).text("Introduction", { underline: true, align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(16).text(reportData.introduction, { align: "justify" });

  doc.moveDown(1.5);
  // Add workout
  doc.fontSize(19).text("Workout", { underline: true, align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(16).text(reportData.workout, { align: "justify" });
  doc.moveDown(1.5);
  // Add progress
  doc.fontSize(19).text("Progress", { underline: true, align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(16).text(reportData.progress, { align: "justify" });
  doc.moveDown(1.5);
  // Add conclusion
  doc.fontSize(19).text("Conclusion", { underline: true, align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(16).text(reportData.conclusion, { align: "justify" });
  doc.moveDown(1.5);
  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    const buffers: any[] = [];
    doc.on("data", (buffer) => buffers.push(buffer));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.end();
  });

  const report = await Report.create({
    ...reportData,
    pdf: pdfBuffer,
  });

  return report;
}

export async function getReports() {
  const reports = await Report.find();
  return reports;
}

export async function getReportByMemberId(memberId: string) {
  console.log({ memberId });
  const member = await Member.findById(memberId);

  const reports = await Report.find({ member: member.email });
  console.log({ reports });
  return reports;
}
