import type { Request, Response, NextFunction } from "express";
import prisma from "../../database/prisma.js";

export class ActivityLogController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const action = typeof req.query.action === "string" ? req.query.action : undefined;
      const limitVal = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 50;
      const pageVal = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;

      const take = isNaN(limitVal) ? 50 : limitVal;
      const page = isNaN(pageVal) ? 1 : pageVal;
      const skip = (page - 1) * take;

      const where: any = {};

      if (action) {
        where.action = action as string;
      }

      if (search) {
        where.OR = [
          {
            description: {
              contains: search as string,
              mode: "insensitive",
            },
          },
          {
            user: {
              name: {
                contains: search as string,
                mode: "insensitive",
              },
            },
          },
        ];
      }

      const [logs, total] = await Promise.all([
        prisma.activityLog.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take,
          skip,
        }),
        prisma.activityLog.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        message: "Data log aktivitas berhasil diambil",
        data: logs,
        pagination: {
          total,
          limit: take,
          page: Number(page),
          totalPages: Math.ceil(total / take),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
