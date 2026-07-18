const pool = require("../../../database/connection");
const OrderAdminRepository = require("../repositories/order-admin.repository");
const ApiError = require("../../../utils/api-error");
const httpStatus = require("../../../constants/http-status");

// Valid state machine transitions
const VALID_TRANSITIONS = {
  'ORDER_CREATED': ['CONFIRMED', 'CANCELLED'],
  'CONFIRMED': ['PACKED', 'CANCELLED'],
  'PACKED': ['READY_TO_SHIP'],
  'READY_TO_SHIP': ['SHIPPED'],
  'SHIPPED': ['OUT_FOR_DELIVERY'],
  'OUT_FOR_DELIVERY': ['DELIVERED', 'RETURNED'],
  'DELIVERED': ['RETURN_REQUESTED'],
  'CANCELLED': [],
  'RETURN_REQUESTED': ['RETURN_APPROVED', 'DELIVERED'], // can reject return
  'RETURN_APPROVED': ['RETURNED'],
  'RETURNED': ['REFUND_PENDING', 'REFUNDED'],
  'REFUND_PENDING': ['REFUNDED'],
  'REFUNDED': []
};

class OrderAdminService {
  async getOrders(queryParams) {
    return OrderAdminRepository.findAll(queryParams);
  }

  async getOrderById(id) {
    const order = await OrderAdminRepository.findById(id);
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    }
    return order;
  }

  async updateOrderStatus(id, newStatus, req) {
    const order = await this.getOrderById(id);
    const currentState = order.status;

    if (currentState === newStatus) {
      return order; // No change
    }

    // Validate Transition
    const allowedNextStates = VALID_TRANSITIONS[currentState] || [];
    if (!allowedNextStates.includes(newStatus)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST, 
        `Invalid status transition from ${currentState} to ${newStatus}`
      );
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await OrderAdminRepository.updateStatus(id, newStatus, connection);
      
      // Admin Action Log (Internal)
      await OrderAdminRepository.logAudit(
        id, 'STATUS_CHANGED', currentState, newStatus, req.user.id, 'ADMIN', req.ip, connection
      );

      // Customer Timeline (Public)
      await OrderAdminRepository.addTimelineNote(
        id, newStatus, `Order status updated to ${newStatus.replace(/_/g, ' ')}`, req.user.id, 'ADMIN', connection
      );

      await connection.commit();
      return await this.getOrderById(id);
    } catch (error) {
      await connection.rollback();
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update order status", "TX_FAILED", true, error.stack);
    } finally {
      connection.release();
    }
  }

  async addInternalNote(id, notes, req) {
    const order = await this.getOrderById(id);
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await OrderAdminRepository.addTimelineNote(
        id, order.status, notes, req.user.id, 'ADMIN', connection
      );

      await OrderAdminRepository.logAudit(
        id, 'NOTE_ADDED', order.status, order.status, req.user.id, 'ADMIN', req.ip, connection
      );

      await connection.commit();
      return await this.getOrderById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async toggleHoldStatus(id, isOnHold, holdReason, req) {
    const order = await this.getOrderById(id);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await OrderAdminRepository.updateHoldStatus(id, isOnHold, holdReason, connection);
      
      await OrderAdminRepository.logAudit(
        id, isOnHold ? 'ORDER_HELD' : 'ORDER_RESUMED', order.status, order.status, req.user.id, 'ADMIN', req.ip, connection
      );

      await connection.commit();
      return await this.getOrderById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new OrderAdminService();
