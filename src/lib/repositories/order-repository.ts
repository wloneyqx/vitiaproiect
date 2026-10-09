import "server-only";

import { prisma } from "@/lib/db";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

export async function getOrders(limit?: number) {
  return prisma.order.findMany({ take: limit, orderBy: { createdAt: "desc" }, include: { items: true } });
}

export async function getOrderById(id: number) {
  return prisma.order.findUnique({ where: { id }, include: { items: true } });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({ where: { orderNumber }, include: { items: true } });
}

export async function countOrdersByStatus(status?: OrderStatus) {
  return prisma.order.count(status ? { where: { status } } : {});
}

export async function getRevenueTotal() {
  return prisma.order.aggregate({ where: { paymentStatus: "PAID", status: { not: "CANCELLED" } }, _sum: { total: true } });
}

export async function updateOrderStatus(id: number, status: OrderStatus, paymentStatus?: PaymentStatus) {
  return prisma.order.update({ where: { id }, data: { status, ...(paymentStatus ? { paymentStatus } : {}) } });
}
