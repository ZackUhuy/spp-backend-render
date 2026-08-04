import type { Request } from "express";
import prisma from "../database/prisma.js";
import { logger } from "../services/WinstonLogger.js";

export async function logActivity(
  userId: number,
  action: string,
  description: string,
  req?: Request
): Promise<void> {
  try {
    let ipAddress: string | null = null;
    if (req) {
      const forwarded = req.headers["x-forwarded-for"];
      const rawIp = typeof forwarded === "string"
        ? forwarded
        : (Array.isArray(forwarded) ? forwarded[0] : (req.socket?.remoteAddress || null));
      if (rawIp) {
        ipAddress = rawIp.split(",")[0].trim();
      }
    }
      
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        description,
        ipAddress,
      },
    });
  } catch (error: any) {
    logger.error(`Gagal mencatat log aktivitas: ${error.message}`);
  }
}
