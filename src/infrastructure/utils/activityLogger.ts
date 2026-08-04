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
    const ipAddress = req 
      ? (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || null) 
      : null;
      
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        description,
        ipAddress: ipAddress ? ipAddress.split(",")[0].trim() : null,
      },
    });
  } catch (error: any) {
    logger.error(`Gagal mencatat log aktivitas: ${error.message}`);
  }
}
