/* GENERAL ACTIONS */
// SETTINGS
// ===========================================================
export const SETTINGS_SAVE = 'SETTINGS_SAVE';
export const SETTINGS_UPDATE = 'SETTINGS_UPDATE';
export const SETTINGS_GET_INITIAL = 'SETTINGS_GET_INITIAL';

// UI
// ===========================================================
export const UI_TAB_CHANGE = 'UI_TAB_CHANGE';
export const UI_NOTIFICATION_NEW = 'UI_NOTIFICATION_NEW';
export const UI_NOTIFICATION_REMOVE = 'UI_NOTIFICATION_REMOVE';
export const UI_CHECK_UPDATES_MESSAGE = 'UI_CHECK_UPDATES_MESSAGE';

/* OPERATIONAL ACTIONS */

// EMPLOYEE
// ===========================================================
export const EMPLOYEE_NEW = 'EMPLOYEE_NEW';
export const EMPLOYEE_UPDATE = 'EMPLOYEE_UPDATE';
export const EMPLOYEE_EDIT = 'EMPLOYEE_EDIT';
export const EMPLOYEE_SAVE = 'EMPLOYEE_SAVE';
export const EMPLOYEE_DELETE = 'EMPLOYEE_DELETE';
export const EMPLOYEE_GET_ALL = 'EMPLOYEE_GET_ALL';
export const EMPLOYEE_SET_STATUS = 'EMPLOYEE_SET_STATUS';
export const EMPLOYEE_CONFIGS_SAVE = 'EMPLOYEE_CONFIGS_SAVE';
export const EMPLOYEE_DUPLICATE = 'EMPLOYEE_DUPLICATE';

// CLIENT
// ===========================================================
export const CLIENT_NEW = 'CLIENT_NEW';
export const CLIENT_UPDATE = 'CLIENT_UPDATE';
export const CLIENT_EDIT = 'CLIENT_EDIT';
export const CLIENT_SAVE = 'CLIENT_SAVE';
export const CLIENT_DELETE = 'CLIENT_DELETE';
export const CLIENT_GET_ALL = 'CLIENT_GET_ALL';
export const CLIENT_SET_STATUS = 'CLIENT_SET_STATUS';
export const CLIENT_CONFIGS_SAVE = 'CLIENT_CONFIGS_SAVE';
export const CLIENT_DUPLICATE = 'CLIENT_DUPLICATE';

// SUPPLIER
// ===========================================================
export const SUPPLIER_NEW = 'SUPPLIER_NEW';
export const SUPPLIER_UPDATE = 'SUPPLIER_UPDATE';
export const SUPPLIER_EDIT = 'SUPPLIER_EDIT';
export const SUPPLIER_SAVE = 'SUPPLIER_SAVE';
export const SUPPLIER_DELETE = 'SUPPLIER_DELETE';
export const SUPPLIER_GET_ALL = 'SUPPLIER_GET_ALL';
export const SUPPLIER_SET_STATUS = 'SUPPLIER_SET_STATUS';
export const SUPPLIER_CONFIGS_SAVE = 'SUPPLIER_CONFIGS_SAVE';
export const SUPPLIER_DUPLICATE = 'INVOICE_DUPLICATE';

// MATERIAL
// ===========================================================
export const MATERIAL_NEW = 'MATERIAL_NEW';
export const MATERIAL_UPDATE = 'MATERIAL_UPDATE';
export const MATERIAL_EDIT = 'MATERIAL_EDIT';
export const MATERIAL_SAVE = 'MATERIAL_SAVE';
export const MATERIAL_DELETE = 'MATERIAL_DELETE';
export const MATERIAL_GET_ALL = 'MATERIAL_GET_ALL';
export const MATERIAL_SET_STATUS = 'MATERIAL_SET_STATUS';
export const MATERIAL_CONFIGS_SAVE = 'MATERIAL_CONFIGS_SAVE';
export const MATERIAL_DUPLICATE = 'MATERIAL_DUPLICATE';

// QUOTE
// ===========================================================

export const QUOTE_NEW = 'QUOTE_NEW';
export const QUOTE_UPDATE = 'QUOTE_UPDATE';
export const QUOTE_ITEM_ADD = 'QUOTE_ITEM_ADD';
export const QUOTE_ITEM_UPDATE = 'QUOTE_ITEM_UPDATE';
export const QUOTE_ITEM_EXTRA_COST_ADD = 'QUOTE_ITEM_EXTRA_COST_ADD';
export const QUOTE_ITEM_EXTRA_COST_UPDATE = 'QUOTE_ITEM_EXTRA_COST_UPDATE';
export const QUOTE_EDIT = 'QUOTE_EDIT';
export const QUOTE_SAVE = 'QUOTE_SAVE';
export const QUOTE_DELETE = 'QUOTE_DELETE';
export const QUOTE_GET_ALL = 'QUOTE_GET_ALL';
export const QUOTE_SET_STATUS = 'QUOTE_SET_STATUS';
export const QUOTE_CONFIGS_SAVE = 'QUOTE_CONFIGS_SAVE';
export const QUOTE_DUPLICATE = 'QUOTE_DUPLICATE';

// JOB
// ===========================================================
export const JOB_NEW = 'JOB_NEW';
export const JOB_EDIT = 'JOB_EDIT';
export const JOB_UPDATE = 'JOB_UPDATE';
export const JOB_TASK_ADD = 'JOB_TASK_ADD';
export const JOB_SAVE = 'JOB_SAVE';
export const JOB_DELETE = 'JOB_DELETE';
export const JOB_GET_ALL = 'JOB_GET_ALL';
export const JOB_SET_STATUS = 'JOB_SET_STATUS';
export const JOB_CONFIGS_SAVE = 'JOB_CONFIGS_SAVE';
export const JOB_DUPLICATE = 'JOB_DUPLICATE';

// TASK
// ===========================================================
export const TASK_EDIT = 'TASK_EDIT';
export const TASK_UPDATE = 'TASK_UPDATE';
export const TASK_SAVE = 'TASK_SAVE';
export const TASK_DELETE = 'TASK_DELETE';
export const TASK_GET_ALL = 'TASK_GET_ALL';
export const TASK_SET_STATUS = 'TASK_SET_STATUS';
export const TASK_CONFIGS_SAVE = 'TASK_CONFIGS_SAVE';
export const TASK_DUPLICATE = 'TASK_DUPLICATE';

// INVOICE
// ===========================================================
export const INVOICE_NEW = 'INVOICE_NEW';
export const INVOICE_EDIT = 'INVOICE_EDIT';
export const INVOICE_UPDATE = 'INVOICE_UPDATE';
export const INVOICE_SAVE = 'INVOICE_SAVE';
export const INVOICE_DELETE = 'INVOICE_DELETE';
export const INVOICE_GET_ALL = 'INVOICE_GET_ALL';
export const INVOICE_NEW_FROM_CONTACT = 'INVOICE_NEW_FROM_CONTACT';
export const INVOICE_SET_STATUS = 'INVOICE_SET_STATUS';
export const INVOICE_CONFIGS_SAVE = 'INVOICE_CONFIGS_SAVE';
export const INVOICE_DUPLICATE = 'INVOICE_DUPLICATE';

// PURCHASE ORDERS
// ===========================================================
export const PURCHASE_ORDER_NEW = 'PURCHASE_ORDER_NEW';
export const PURCHASE_ORDER_UPDATE = 'PURCHASE_ORDER_UPDATE';
export const PURCHASE_ORDER_ITEM_ADD = 'PURCHASE_ORDER_ITEM_ADD';
export const PURCHASE_ORDER_EDIT = 'PURCHASE_ORDER_EDIT';
export const PURCHASE_ORDER_SAVE = 'PURCHASE_ORDER_SAVE';
export const PURCHASE_ORDER_DELETE = 'PURCHASE_ORDER_DELETE';
export const PURCHASE_ORDER_GET_ALL = 'PURCHASE_ORDER_GET_ALL';
export const PURCHASE_ORDER_SET_STATUS = 'PURCHASE_ORDER_SET_STATUS';
export const PURCHASE_ORDER_CONFIGS_SAVE = 'PURCHASE_ORDER_CONFIGS_SAVE';
export const PURCHASE_ORDER_DUPLICATE = 'PURCHASE_ORDER_DUPLICATE';

// REQUISITION
// ===========================================================
export const REQUISITION_EDIT = 'REQUISITION_EDIT';
export const REQUISITION_UPDATE = 'REQUISITION_UPDATE';
export const REQUISITION_SAVE = 'REQUISITION_SAVE';
export const REQUISITION_DELETE = 'REQUISITION_DELETE';
export const REQUISITION_GET_ALL = 'REQUISITION_GET_ALL';
export const REQUISITION_SET_STATUS = 'REQUISITION_SET_STATUS';
export const REQUISITION_CONFIGS_SAVE = 'REQUISITION_CONFIGS_SAVE';
export const REQUISITION_DUPLICATE = 'INVOICE_DUPLICATE';

/* HR ACTIONS */

// LEAVE
// ===========================================================
export const LEAVE_NEW = 'LEAVE_NEW';
export const LEAVE_EDIT = 'LEAVE_EDIT';
export const LEAVE_UPDATE = 'LEAVE_UPDATE';
export const LEAVE_SAVE = 'LEAVE_SAVE';
export const LEAVE_DELETE = 'LEAVE_DELETE';
export const LEAVE_GET_ALL = 'LEAVE_GET_ALL';
export const LEAVE_SET_STATUS = 'LEAVE_SET_STATUS';
export const LEAVE_CONFIGS_SAVE = 'LEAVE_CONFIGS_SAVE';
export const LEAVE_DUPLICATE = 'INVOICE_DUPLICATE';

// OVERTIME
// ===========================================================
export const OVERTIME_NEW = 'OVERTIME_NEW';
export const OVERTIME_EDIT = 'OVERTIME_EDIT';
export const OVERTIME_UPDATE = 'OVERTIME_UPDATE';
export const OVERTIME_SAVE = 'OVERTIME_SAVE';
export const OVERTIME_DELETE = 'OVERTIME_DELETE';
export const OVERTIME_GET_ALL = 'OVERTIME_GET_ALL';
export const OVERTIME_SET_STATUS = 'OVERTIME_SET_STATUS';
export const OVERTIME_CONFIGS_SAVE = 'OVERTIME_CONFIGS_SAVE';
export const OVERTIME_DUPLICATE = 'INVOICE_DUPLICATE';

/* SAFETY ACTIONS */

// SAFETY
// ===========================================================
export const SAFETY_DOC_NEW = 'SAFETY_DOC_NEW';
export const SAFETY_DOC_EDIT = 'SAFETY_DOC_EDIT';
export const SAFETY_DOC_UPDATE = 'SAFETY_DOC_UPDATE';
export const SAFETY_DOC_SAVE = 'SAFETY_DOC_SAVE';
export const SAFETY_DOC_DELETE = 'SAFETY_DOC_DELETE';
export const SAFETY_DOC_GET_ALL = 'SAFETY_DOC_GET_ALL';
export const SAFETY_DOC_SET_STATUS = 'SAFETY_DOC_SET_STATUS';
export const SAFETY_DOC_CONFIGS_SAVE = 'SAFETY_DOC_CONFIGS_SAVE';
export const SAFETY_DOC_DUPLICATE = 'SAFETY_DOC_DUPLICATE';